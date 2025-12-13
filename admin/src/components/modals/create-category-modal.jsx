"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { searchUserByJnanagniId } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export function CreateCategoryModal({ isOpen, onClose, onSubmit }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: "", description: "", leaduserId: "" });
  const [searchId, setSearchId] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSearchUser = async () => {
    if (!searchId.trim()) return;
    setSearchLoading(true);
    setSearchError("");
    setFoundUser(null);

    try {
      const response = await searchUserByJnanagniId(searchId.trim().toUpperCase());
      const user = response.data; // Adjusted based on standard ApiResponse
      
      if (user) {
        setFoundUser(user);
        setFormData({ ...formData, leaduserId: user._id });
      } else {
        setSearchError("User not found");
      }
    } catch (error) {
      setSearchError(error.message || "User not found");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({ name: "", description: "", leaduserId: "" });
    setStep(0);
    setFoundUser(null);
    setSearchId("");
  };

  return (
     <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }} 
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-primary/20 bg-card p-0 shadow-2xl glow-primary"
          >
            <div className="bg-primary/10 p-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-primary">Create Event Category</h2>
                <p className="text-xs text-muted-foreground">Step {step + 1} of 2</p>
            </div>

            <div className="p-6">
               <form onSubmit={handleFinalSubmit}>
                 <div className="min-h-[250px] relative">
                    
                    {/* STEP 0: Basic Details */}
                    {step === 0 && (
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }} 
                            animate={{ x: 0, opacity: 1 }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input 
                                    id="name" 
                                    placeholder="e.g. Technical Events" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc">Description</Label>
                                <Textarea 
                                    id="desc" 
                                    placeholder="Short description of this category..." 
                                    value={formData.description} 
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 1: Assign Lead */}
                    {step === 1 && (
                       <motion.div 
                            initial={{ x: 20, opacity: 0 }} 
                            animate={{ x: 0, opacity: 1 }}
                            className="space-y-4"
                        >
                           <Label>Assign Category Lead (Jnanagni ID)</Label>
                           <div className="flex gap-2">
                             <Input 
                                placeholder="JG26-XY12" 
                                value={searchId} 
                                onChange={(e) => setSearchId(e.target.value.toUpperCase())} 
                                className="font-mono uppercase" 
                            />
                             <Button 
                                type="button" 
                                onClick={handleSearchUser} 
                                disabled={searchLoading || !searchId} 
                                className="bg-primary text-black hover:bg-primary/80"
                            >
                                {searchLoading ? "..." : "Find"}
                             </Button>
                           </div>
                           
                           {searchError && <p className="text-xs text-red-400">{searchError}</p>}

                           {foundUser && (
                              <div className="mt-4 p-4 rounded-md bg-secondary/50 border border-primary/20 flex flex-col gap-1">
                                 <span className="text-xs text-muted-foreground">Selected Lead:</span>
                                 <h4 className="font-bold text-primary text-lg">{foundUser.name}</h4>
                                 <p className="text-xs text-white/70">{foundUser.email}</p>
                                 <Badge variant="outline" className="w-fit mt-2">{foundUser.jnanagniId}</Badge>
                              </div>
                           )}
                       </motion.div>
                    )}
                 </div>

                 {/* Footer Buttons */}
                 <div className="flex justify-between pt-6 mt-4 border-t border-border/50">
                    <Button type="button" variant="ghost" onClick={step > 0 ? handleBack : onClose}>
                        {step > 0 ? "Back" : "Cancel"}
                    </Button>
                    
                    {step === 0 ? (
                        <Button type="button" onClick={handleNext} disabled={!formData.name || !formData.description}>
                            Next
                        </Button>
                    ) : (
                        <Button type="submit" disabled={!formData.leaduserId}>
                            Create Category
                        </Button>
                    )}
                 </div>
               </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}