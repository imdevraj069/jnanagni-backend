import { Event } from "../models/event.model.js";
import { EventCategory } from "../models/eventcategory.model.js";

//  ---- Event Category Controllers ---- //

export const createEventCategory = async (req, res) => {
  try {
    const { name, description, leaduserId } = req.body;

    // create slug. if slug exist append a random string. use while loop to check for uniqueness
    let slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    let uniqueSlug = slug;
    let counter = 1;
    while (await EventCategory.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const newCategory = await EventCategory.create({
      name,
      description,
      slug: uniqueSlug,
      lead: leaduserId,
      createdby: req.user._id,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating event category", error });
  }
};

export const getAllEventCategories = async (req, res) => {
  try {
    const categories = await EventCategory.find()
      .populate("lead", "name email")
      .populate("createdby", "name email");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event categories", error });
  }
};

export const getEventCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await EventCategory.findById(categoryId)
      .populate("lead", "name email")
      .populate("createdby", "name email");
    if (!category) {
      return res.status(404).json({ message: "Event category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event category", error });
  }
};

export const updateEventCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updates = req.body;

    const updatedCategory = await EventCategory.findByIdAndUpdate(
      categoryId,
      updates,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Event category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating event category", error });
  }
};

export const deleteEventCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deletedCategory = await EventCategory.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Event category not found" });
    }
    res.status(200).json({ message: "Event category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event category", error });
  }
};

//  ---- Event Controllers ---- //

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, categoryId } = req.body;

    // slug generation
    let slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    let uniqueSlug = slug;
    let counter = 1;
    while (await Event.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const newEvent = await Event.create({
      title,
      description,
      slug: uniqueSlug,
      date,
      venue,
      category: categoryId,
      createdby: req.user._id,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find()
      .populate("category")
      .populate("createdby", "name email")
      .sort({ date: 1 }) // Sort by date ascending (soonest events first)
      .skip(skip)
      .limit(limit);

    const totalDocs = await Event.countDocuments();

    res.status(200).json({
      data: events,
      pagination: {
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId)
      .populate("category")
      .populate("createdby", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
};

export const getEventsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find({ category: categoryId })
      .populate("category")
      .populate("createdby", "name email")
      .skip(skip)
      .limit(limit);

    const totalDocs = await Event.countDocuments({ category: categoryId });

    res.status(200).json({
      data: events,
      pagination: {
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events by category", error });
  }
};

export const addCoordinatorToEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { coordinatorId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // user can be coordinator in only one event
    const existingEvent = await Event.findOne({ coordinators: coordinatorId });
    if (existingEvent) {
      if (existingEvent._id.toString() === eventId) {
        return res
          .status(400)
          .json({ message: "User is already a coordinator for this event" });
      } else {
        return res
          .status(400)
          .json({ message: "User is already a coordinator for another event" });
      }
    }

    event.coordinators.push(coordinatorId);
    await event.save();

    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding coordinator to event", error });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};
