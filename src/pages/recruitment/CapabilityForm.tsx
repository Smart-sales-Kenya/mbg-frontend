"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";

// Environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: get CSRF token
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

interface FormData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  
  // Role Interest
  rolesInterested: string[];
  yearsExperience: string;
  industries: string;
  hasTeamExperience: string;
  teamSize: string;
  
  // Business Development
  bdApproach: string;
  bdTools: string;
  bdExample: string;
  bdConfidence: string;
  
  // Account Management
  amApproach: string;
  amChallenges: string;
  amExperience: string;
  amConfidence: string;
  
  // Sales Management
  smExperience: string;
  smPerformance: string;
  smTools: string;
  smConfidence: string;
  
  // Performance
  achievements: string;
  targets: string;
  awards: string;
  
  // Education
  education: string;
  certifications: string;
  
  // File upload
  resumeFile: File | null;
  
  // Consent
  consent: boolean;
}

const CapabilityForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const totalSteps = 7;
  
  // Initialize form data
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    
    // Role Interest
    rolesInterested: [],
    yearsExperience: "",
    industries: "",
    hasTeamExperience: "",
    teamSize: "",
    
    // Business Development
    bdApproach: "",
    bdTools: "",
    bdExample: "",
    bdConfidence: "",
    
    // Account Management
    amApproach: "",
    amChallenges: "",
    amExperience: "",
    amConfidence: "",
    
    // Sales Management
    smExperience: "",
    smPerformance: "",
    smTools: "",
    smConfidence: "",
    
    // Performance
    achievements: "",
    targets: "",
    awards: "",
    
    // Education
    education: "",
    certifications: "",
    
    // File upload
    resumeFile: null,
    
    // Consent
    consent: false
  });

  // Check if we're in edit mode and pre-populate form data
  useEffect(() => {
    if (location.state?.submissionId && location.state?.existingData) {
      setIsEditing(true);
      setSubmissionId(location.state.submissionId);
      const existingData = location.state.existingData;
      
      setFormData({
        // Personal Information
        fullName: existingData.full_name || "",
        email: existingData.email || "",
        phone: existingData.phone || "",
        location: existingData.location || "",
        linkedIn: existingData.linkedin_profile || "",
        
        // Role Interest
        rolesInterested: existingData.role_interests?.map((ri: any) => ri.role) || [],
        yearsExperience: existingData.years_experience || "",
        industries: existingData.industries || "",
        hasTeamExperience: existingData.has_team_experience || "",
        teamSize: existingData.team_size?.toString() || "",
        
        // Business Development
        bdApproach: existingData.bd_approach || "",
        bdTools: existingData.bd_tools || "",
        bdExample: existingData.bd_example || "",
        bdConfidence: existingData.bd_confidence?.toString() || "",
        
        // Account Management
        amApproach: existingData.am_approach || "",
        amChallenges: existingData.am_challenges || "",
        amExperience: existingData.am_experience || "",
        amConfidence: existingData.am_confidence?.toString() || "",
        
        // Sales Management
        smExperience: existingData.sm_experience || "",
        smPerformance: existingData.sm_performance || "",
        smTools: existingData.sm_tools || "",
        smConfidence: existingData.sm_confidence?.toString() || "",
        
        // Performance
        achievements: existingData.achievements || "",
        targets: existingData.targets || "",
        awards: existingData.awards || "",
        
        // Education
        education: existingData.education || "",
        certifications: existingData.certifications || "",
        
        // File upload
        resumeFile: null,
        
        // Consent
        consent: existingData.consent || false
      });
    }
  }, [location.state]);

  // Fetch CSRF token
  const fetchCsrfToken = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/get-csrf-token/`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("CSRF token fetch error:", error);
    }
  };

  const roles = [
    "National Sales Manager",
    "Area/Regional Sales Manager",
    "Territory Manager",
    "Sales Representative",
    "Sales Operations"
  ];

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      rolesInterested: prev.rolesInterested.includes(role)
        ? prev.rolesInterested.filter(r => r !== role)
        : [...prev.rolesInterested, role]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resumeFile: e.target.files[0] });
    }
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.location) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (currentStep === 2) {
      if (formData.rolesInterested.length === 0 || !formData.yearsExperience || !formData.hasTeamExperience || !formData.industries) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.bdApproach || !formData.bdTools || !formData.bdConfidence) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (currentStep === 4) {
      if (!formData.amApproach || !formData.amChallenges || !formData.amConfidence) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast.error("Please provide consent to proceed");
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error("Please log in to submit the form");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare form data for Django
      const submissionData = new FormData();
      
      // Convert camelCase to snake_case and append all fields
      submissionData.append('full_name', formData.fullName);
      submissionData.append('email', formData.email);
      submissionData.append('phone', formData.phone);
      submissionData.append('location', formData.location);
      submissionData.append('linkedin_profile', formData.linkedIn || '');
      
      // Role interests - send as JSON strings
      formData.rolesInterested.forEach(role => {
        submissionData.append('role_interests', JSON.stringify({ role }));
      });
      
      submissionData.append('years_experience', formData.yearsExperience);
      submissionData.append('industries', formData.industries);
      submissionData.append('has_team_experience', formData.hasTeamExperience);
      if (formData.teamSize) {
        submissionData.append('team_size', formData.teamSize);
      }
      
      submissionData.append('bd_approach', formData.bdApproach);
      submissionData.append('bd_tools', formData.bdTools);
      submissionData.append('bd_example', formData.bdExample || '');
      submissionData.append('bd_confidence', formData.bdConfidence);
      
      submissionData.append('am_approach', formData.amApproach);
      submissionData.append('am_challenges', formData.amChallenges);
      submissionData.append('am_experience', formData.amExperience || '');
      submissionData.append('am_confidence', formData.amConfidence);
      
      submissionData.append('sm_experience', formData.smExperience || '');
      submissionData.append('sm_performance', formData.smPerformance || '');
      submissionData.append('sm_tools', formData.smTools || '');
      if (formData.smConfidence) {
        submissionData.append('sm_confidence', formData.smConfidence);
      }
      
      submissionData.append('achievements', formData.achievements);
      submissionData.append('targets', formData.targets || '');
      submissionData.append('awards', formData.awards || '');
      
      submissionData.append('education', formData.education);
      submissionData.append('certifications', formData.certifications || '');
      
      if (formData.resumeFile) {
        submissionData.append('resume', formData.resumeFile);
      }
      
      submissionData.append('consent', formData.consent.toString());

      // Debug: Log what's being sent
      console.log('Submitting role interests:', formData.rolesInterested);
      for (let pair of (submissionData as any).entries()) {
        console.log(pair[0], pair[1]);
      }

      // Get CSRF token first
      await fetchCsrfToken();

      let url = `${API_BASE_URL}/api/sales-capability/submissions/`;
      let method = "POST";
      
      // If editing, use PATCH to the specific submission
      if (isEditing && submissionId) {
        url = `${API_BASE_URL}/api/sales-capability/submissions/${submissionId}/`;
        method = "PATCH";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-CSRFToken": getCookie("csrftoken") || "",
          // Don't set Content-Type for FormData - let browser set it with boundary
        },
        body: submissionData,
        credentials: "include",
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        toast.error("Server error: Check API endpoint configuration.");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.non_field_errors) {
          toast.error(data.non_field_errors.join(' '));
        } else if (data.role_interests) {
          toast.error(`Role interests error: ${data.role_interests.join(' ')}`);
        } else {
          const errorMsg = Object.values(data).flat().join(" ") || "Submission failed!";
          toast.error(errorMsg);
        }
        return;
      }

      toast.success(isEditing ? "Form updated successfully!" : "Form submitted successfully!");
      navigate("/recruitment/user-dashboard");
      
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "Personal & Contact Information",
    "Role Interest & Experience",
    "Business Development Capabilities",
    "Account Management Capabilities",
    "Sales Management Capabilities",
    "Performance & Education",
    "Review & Submit"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-elegant">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CardTitle className="text-3xl">
                    {isEditing ? "Edit Submission" : "Sales Capability Submission"}
                  </CardTitle>
                  {isEditing && <Edit className="h-6 w-6 text-blue-600" />}
                </div>
                <CardDescription className="text-base">
                  Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
                </CardDescription>
                <div className="mt-4">
                  <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
                </div>
                {isEditing && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="px-3 py-1">
                      Editing Mode
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Step 1: Personal & Contact Information */}
                  {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Personal & Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input 
                          id="fullName" 
                          required 
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          required 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          required 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location (Country/City) *</Label>
                        <Input 
                          id="location" 
                          required 
                          placeholder="e.g., Nairobi, Kenya"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="linkedIn">LinkedIn Profile (optional)</Label>
                        <Input 
                          id="linkedIn" 
                          type="url" 
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={formData.linkedIn}
                          onChange={(e) => setFormData({...formData, linkedIn: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  )}

                  {/* Step 2: Role Interest & Experience */}
                  {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Role Interest & Experience</h3>
                    <div>
                      <Label className="mb-3 block">Which role(s) are you interested in? *</Label>
                      <div className="space-y-2">
                        {roles.map((role) => (
                          <div key={role} className="flex items-center space-x-2">
                            <Checkbox 
                              id={role} 
                              checked={formData.rolesInterested.includes(role)}
                              onCheckedChange={() => handleRoleToggle(role)}
                            />
                            <label htmlFor={role} className="text-sm cursor-pointer">{role}</label>
                          </div>
                        ))}
                      </div>
                      {formData.rolesInterested.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Selected roles:</strong> {formData.rolesInterested.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="yearsExperience">Years of Sales Experience *</Label>
                        <Select 
                          value={formData.yearsExperience}
                          onValueChange={(value) => setFormData({...formData, yearsExperience: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-6">3-6 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="hasTeamExperience">Team Management Experience *</Label>
                        <Select 
                          value={formData.hasTeamExperience}
                          onValueChange={(value) => setFormData({...formData, hasTeamExperience: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {formData.hasTeamExperience === "yes" && (
                      <div>
                        <Label htmlFor="teamSize">Number of Direct Reports</Label>
                        <Input 
                          id="teamSize" 
                          type="number" 
                          placeholder="e.g., 5"
                          value={formData.teamSize}
                          onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="industries">Industries Worked In *</Label>
                      <Input 
                        id="industries" 
                        required 
                        placeholder="e.g., FMCG, Beverages, Financial Services"
                        value={formData.industries}
                        onChange={(e) => setFormData({...formData, industries: e.target.value})}
                      />
                    </div>
                  </div>
                  )}

                  {/* Step 3: Business Development Capabilities */}
                  {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Business Development Capabilities</h3>
                    <div>
                      <Label htmlFor="bdApproach">Describe how you identify and pursue new business opportunities *</Label>
                      <Textarea 
                        id="bdApproach" 
                        required 
                        rows={4}
                        placeholder="Share your approach to business development..."
                        value={formData.bdApproach}
                        onChange={(e) => setFormData({...formData, bdApproach: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bdTools">What tools or methods do you use to generate leads and grow territory? *</Label>
                      <Textarea 
                        id="bdTools" 
                        required 
                        rows={3}
                        value={formData.bdTools}
                        onChange={(e) => setFormData({...formData, bdTools: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bdExample">Give an example of how you've converted a high-potential account into a key customer</Label>
                      <Textarea 
                        id="bdExample" 
                        rows={4}
                        value={formData.bdExample}
                        onChange={(e) => setFormData({...formData, bdExample: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bdConfidence">Rate your confidence in Business Development (1-5) *</Label>
                      <Select 
                        value={formData.bdConfidence}
                        onValueChange={(value) => setFormData({...formData, bdConfidence: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Beginner</SelectItem>
                          <SelectItem value="2">2 - Developing</SelectItem>
                          <SelectItem value="3">3 - Competent</SelectItem>
                          <SelectItem value="4">4 - Proficient</SelectItem>
                          <SelectItem value="5">5 - Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  )}

                  {/* Step 4: Account Management Capabilities */}
                  {currentStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Account Management Capabilities</h3>
                    <div>
                      <Label htmlFor="amApproach">Describe your approach to maintaining and growing existing accounts *</Label>
                      <Textarea 
                        id="amApproach" 
                        required 
                        rows={4}
                        value={formData.amApproach}
                        onChange={(e) => setFormData({...formData, amApproach: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="amChallenges">How do you handle underperforming or dissatisfied accounts? *</Label>
                      <Textarea 
                        id="amChallenges" 
                        required 
                        rows={3}
                        value={formData.amChallenges}
                        onChange={(e) => setFormData({...formData, amChallenges: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="amExperience">What's your experience with Joint Business Planning or Key Account Management?</Label>
                      <Textarea 
                        id="amExperience" 
                        rows={3}
                        value={formData.amExperience}
                        onChange={(e) => setFormData({...formData, amExperience: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="amConfidence">Rate your confidence in Account Management (1-5) *</Label>
                      <Select 
                        value={formData.amConfidence}
                        onValueChange={(value) => setFormData({...formData, amConfidence: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Beginner</SelectItem>
                          <SelectItem value="2">2 - Developing</SelectItem>
                          <SelectItem value="3">3 - Competent</SelectItem>
                          <SelectItem value="4">4 - Proficient</SelectItem>
                          <SelectItem value="5">5 - Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  )}

                  {/* Step 5: Sales Management Capabilities */}
                  {currentStep === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Sales Management Capabilities</h3>
                    <div>
                      <Label htmlFor="smExperience">Describe your experience managing sales teams or distributors</Label>
                      <Textarea 
                        id="smExperience" 
                        rows={4}
                        value={formData.smExperience}
                        onChange={(e) => setFormData({...formData, smExperience: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smPerformance">How do you drive performance and accountability in your team?</Label>
                      <Textarea 
                        id="smPerformance" 
                        rows={3}
                        value={formData.smPerformance}
                        onChange={(e) => setFormData({...formData, smPerformance: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smTools">What tools or dashboards do you use to track sales performance?</Label>
                      <Textarea 
                        id="smTools" 
                        rows={3}
                        value={formData.smTools}
                        onChange={(e) => setFormData({...formData, smTools: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smConfidence">Rate your confidence in Sales Management (1-5)</Label>
                      <Select 
                        value={formData.smConfidence}
                        onValueChange={(value) => setFormData({...formData, smConfidence: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Beginner</SelectItem>
                          <SelectItem value="2">2 - Developing</SelectItem>
                          <SelectItem value="3">3 - Competent</SelectItem>
                          <SelectItem value="4">4 - Proficient</SelectItem>
                          <SelectItem value="5">5 - Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  )}

                  {/* Step 6: Performance and Achievements */}
                  {currentStep === 6 && (
                  <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Performance & Achievements</h3>
                    <div>
                      <Label htmlFor="achievements">What are your top 3 sales achievements? *</Label>
                      <Textarea 
                        id="achievements" 
                        required 
                        rows={4}
                        placeholder="1. 
2. 
3. "
                        value={formData.achievements}
                        onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="targets">Provide examples of targets achieved (%, volume, or revenue growth)</Label>
                      <Textarea 
                        id="targets" 
                        rows={3}
                        value={formData.targets}
                        onChange={(e) => setFormData({...formData, targets: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="awards">Awards or recognition received</Label>
                      <Textarea 
                        id="awards" 
                        rows={2}
                        value={formData.awards}
                        onChange={(e) => setFormData({...formData, awards: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Education & Certifications */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Education & Certifications</h3>
                    <div>
                      <Label htmlFor="education">Highest Education Level *</Label>
                      <Select 
                        value={formData.education}
                        onValueChange={(value) => setFormData({...formData, education: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">High School</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                          <SelectItem value="masters">Master's Degree</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="certifications">Sales Certifications (if any)</Label>
                      <Input 
                        id="certifications" 
                        placeholder="e.g., Certified Professional Sales Person (CPSP)"
                        value={formData.certifications}
                        onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Resume/CV Upload</h3>
                    <div>
                      <Label htmlFor="resume">Upload your Resume/CV (PDF or DOCX)</Label>
                      <Input 
                        id="resume" 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      {formData.resumeFile && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected: {formData.resumeFile.name}
                        </p>
                      )}
                      {isEditing && !formData.resumeFile && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Current resume will be kept unless you upload a new one
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Consent & Declaration</h3>
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="consent" 
                        checked={formData.consent}
                        onCheckedChange={(checked) => setFormData({...formData, consent: checked as boolean})}
                      />
                      <label htmlFor="consent" className="text-sm cursor-pointer leading-relaxed">
                        I consent to my data being used for sales role matching and stored per the privacy policy. 
                        I confirm that all information provided is accurate and truthful. *
                      </label>
                    </div>
                  </div>
                  </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    {currentStep > 1 ? (
                      <Button type="button" variant="outline" onClick={handlePrevious}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate("/recruitment/user-dashboard")}
                      >
                        Cancel
                      </Button>
                    )}
                    
                    {currentStep < totalSteps ? (
                      <Button type="button" onClick={handleNext}>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : isEditing ? "Update Application" : "Submit Application"}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CapabilityForm;