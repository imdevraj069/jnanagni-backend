'use server'

import axios from "axios";
import { cookies } from "next/headers";

// Use internal Docker URL on server, or public URL on client (fallback)
// const BASE_URL = process.env.BACKEND_INTERNAL_URL || "http://node_app:8001";
const BASE_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:8001";

// Helper to create authenticated requests
const fetchWithAuth = async (method, endpoint, data = null, contentType = "application/json") => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      "Content-Type": contentType,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    data,
  };

  try {
    const response = await axios(config);
    return response.data; // Return plain data
  } catch (error) {
    // Standardize error return for Server Actions
    const errorMessage = error.response?.data?.message || error.message || "Request failed";
    throw new Error(errorMessage);
  }
};

// --- Auth ---
export async function loginApi(credentials) {
  return fetchWithAuth("POST", "/api/v1/auth/login", credentials);
}

// --- Categories ---
export async function getCategories() {
  return fetchWithAuth("GET", "/api/v1/events/categories");
}

export async function createCategory(data) {
  return fetchWithAuth("POST", "/api/v1/admin/categories", data);
}

export async function updateCategory(id, data) {
  return fetchWithAuth("PUT", `/api/v1/admin/categories/${id}`, data);
}

export async function deleteCategory(id) {
  return fetchWithAuth("DELETE", `/api/v1/admin/categories/${id}`);
}

// --- Events ---
export async function getEvents(page = 1, limit = 100) {
  return fetchWithAuth("GET", `/api/v1/events?page=${page}&limit=${limit}`);
}

export async function getEventsByCategory(categoryId) {
  return fetchWithAuth("GET", `/api/v1/events/category/${categoryId}`);
}

export async function createEvent(data) {
  return fetchWithAuth("POST", "/api/v1/admin/events", data);
}

export async function updateEvent(id, data) {
  return fetchWithAuth("PUT", `/api/v1/admin/events/${id}`, data);
}

export async function deleteEvent(id) {
  return fetchWithAuth("DELETE", `/api/v1/admin/events/${id}`);
}

// --- Users ---
export async function getUsers(page = 1, limit = 100) {
  return fetchWithAuth("GET", `/api/v1/users/all/users?page=${page}&limit=${limit}`);
}

export async function getUsersByRole(role) {
  return fetchWithAuth("GET", `/api/v1/users/special-role/${role}`);
}

// --- User Search ---
export async function searchUserByJnanagniId(jnanagniId) {
  return fetchWithAuth("GET", `/api/v1/users/scan/${jnanagniId}`);
}

// --- Registrations ---
export async function getRegistrationsByEvent(eventId) {
  return fetchWithAuth("GET", `/api/v1/admin/events/${eventId}/registrations`);
}

export async function updateRegistrationStatus(id, status) {
  return fetchWithAuth("PUT", `/api/v1/admin/registrations/${id}/status`, { status });
}

// --- Utility: Get Current User ---
export async function getCurrentUser() {
  try {
    const response = await fetchWithAuth("GET", "/api/v1/auth/me");
    return response.data.user; // Assuming response structure { data: { user: ... } }
  } catch (e) {
    return null;
  }
}