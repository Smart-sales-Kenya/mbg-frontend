"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trash2,
  Star,
  MoreVertical,
  Clock,
  TrendingUp,
  Users,
  Briefcase,
  SortAsc,
  SortDesc,
  File,
  EyeOff,
  Eye as EyeIcon,
  CalendarDays,
  Filter as FilterIcon,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Submission {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_profile: string;
  years_experience: string;
  industries: string;
  has_team_experience: string;
  team_size?: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | 'shortlisted' | 'interview';
  submitted_at: string;
  last_updated: string;
  resume_url?: string;
  resume_filename?: string;
  role_interests: Array<{ role: string }>;
  bd_confidence?: number;
  am_confidence?: number;
  sm_confidence?: number;
  bd_approach?: string;
  am_approach?: string;
  achievements?: string;
  education?: string;
  certifications?: string;
  review_note?: string;
  application_score?: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResumeViewerOpen, setIsResumeViewerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [reviewNote, setReviewNote] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<keyof Submission>('submitted_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Available roles from the form
  const availableRoles = [
    "National Sales Manager",
    "Area/Regional Sales Manager",
    "Territory Manager",
    "Sales Representative",
    "Sales Operations"
  ];

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'under_review', label: 'Under Review', color: 'bg-blue-100 text-blue-800' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'bg-purple-100 text-purple-800' },
    { value: 'interview', label: 'Interview', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
  ];

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role');
    
    if (!token) {
      toast.error("Please log in");
      navigate("/auth");
      return;
    }
    
    // Optional: Check if user is admin
    if (userRole && userRole !== 'admin') {
      toast.error("Access denied. Admin only.");
      navigate("/recruitment/user-dashboard");
    }
  }, [navigate]);

  // Fetch all submissions
  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("Please log in");
        navigate("/auth");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/sales-capability/submissions/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch submissions");

      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch submission details
  const fetchSubmissionDetails = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/sales-capability/submissions/${id}/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch submission details");

      const data = await response.json();
      setSelectedSubmission(data);
    } catch (error) {
      console.error("Error fetching submission details:", error);
      toast.error("Failed to load submission details");
    }
  };

  // Update submission status
  const updateStatus = async (id: number, status: string, note?: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      const response = await fetch(`${API_BASE_URL}/api/sales-capability/submissions/${id}/`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        body: JSON.stringify({ 
          status,
          review_note: note || "" 
        }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Update local state
      const updatedData = await response.json();
      setSubmissions(prev => prev.map(sub => 
        sub.id === id ? updatedData : sub
      ));
      
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(updatedData);
      }

      toast.success(`Status updated to ${status}`);
      setIsDialogOpen(false);
      setReviewNote("");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async (status: string) => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one submission");
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      const promises = selectedRows.map(id => 
        fetch(`${API_BASE_URL}/api/sales-capability/submissions/${id}/`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken || "",
          },
          body: JSON.stringify({ status }),
        })
      );

      await Promise.all(promises);

       // Update local state
      setSubmissions(prev => prev.map(sub => 
        selectedRows.includes(sub.id) 
          ? { ...sub, status: status as 'pending' | 'approved' | 'rejected' | 'under_review' | 'shortlisted' | 'interview', last_updated: new Date().toISOString() } 
          : sub
      ));

      setSelectedRows([]);
      setBulkAction("");
      toast.success(`Updated ${selectedRows.length} submission(s) to ${status}`);
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast.error("Failed to update submissions");
    }
  };

  // Delete submission
  const deleteSubmission = async (id: number) => {
    if (!confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access_token');
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      const response = await fetch(`${API_BASE_URL}/api/sales-capability/submissions/${id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-CSRFToken": csrfToken || "",
        },
      });

      if (!response.ok) throw new Error("Failed to delete submission");

      // Update local state
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
      
      if (selectedSubmission?.id === id) {
        setIsDialogOpen(false);
        setSelectedSubmission(null);
      }

      toast.success("Submission deleted successfully");
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    } finally {
      setIsDeleting(false);
    }
  };

  // Download resume
  const downloadResume = async (submission: Submission) => {
    if (!submission.resume_url) {
      toast.error("No resume available");
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(submission.resume_url, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to download resume");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = submission.resume_filename || `resume_${submission.full_name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume");
    }
  };

  // View resume in new tab
  const viewResume = (submission: Submission) => {
    if (!submission.resume_url) {
      toast.error("No resume available");
      return;
    }

    const token = localStorage.getItem('access_token');
    if (token) {
      // If resume URL is accessible with token, open in new tab
      window.open(submission.resume_url, '_blank');
    } else {
      toast.error("Cannot view resume: No authentication token");
    }
  };

  // Handle sorting
  const handleSort = (field: keyof Submission) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...submissions];
    
    let filterCount = 0;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.industries.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
      filterCount++;
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(sub => statusFilter.includes(sub.status));
      filterCount++;
    }

    // Apply role filter
    if (roleFilter.length > 0) {
      filtered = filtered.filter(sub => 
        sub.role_interests.some(role => roleFilter.includes(role.role))
      );
      filterCount++;
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(sub => {
        const submitted = new Date(sub.submitted_at);
        const diffTime = Math.abs(now.getTime() - submitted.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "today":
            return diffDays <= 1;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          default:
            return true;
        }
      });
      filterCount++;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle nested fields
      if (sortField === 'role_interests') {
        aValue = a.role_interests[0]?.role || '';
        bValue = b.role_interests[0]?.role || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setActiveFilterCount(filterCount);
    setFilteredSubmissions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, roleFilter, dateFilter, submissions, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubmissions.slice(indexOfFirstItem, indexOfLastItem);

  // Status badge component
  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    if (!statusOption) return null;
    
    return (
      <Badge className={`${statusOption.color} hover:${statusOption.color}`}>
        {statusOption.label}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format date with time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate days since submission
  const getDaysSince = (dateString: string) => {
    const submitted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - submitted.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Toggle row selection
  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  // Toggle all rows on current page
  const toggleAllRows = () => {
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([]);
    } else {
      const pageIds = currentItems.map(item => item.id);
      setSelectedRows(pageIds);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setRoleFilter([]);
    setDateFilter("all");
  };

  // Fetch submissions on component mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Calculate stats
  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    under_review: submissions.filter(s => s.status === 'under_review').length,
    shortlisted: submissions.filter(s => s.status === 'shortlisted').length,
    interview: submissions.filter(s => s.status === 'interview').length,
  };

  // Get primary role for display
  const getPrimaryRole = (roleInterests: Array<{ role: string }>) => {
    return roleInterests.length > 0 ? roleInterests[0].role : "Not specified";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="py-20 bg-muted/30 flex-1">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Applications Dashboard</h1>
                <p className="text-gray-600 mt-2">View and manage all sales job applications</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="px-3 py-1">
                  <FileText className="h-4 w-4 mr-2" />
                  {submissions.length} Total Applications
                </Badge>
                <Button variant="outline" onClick={fetchSubmissions}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Pending</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Review</p>
                    <p className="text-2xl font-bold">{stats.under_review}</p>
                  </div>
                  <EyeIcon className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Approved</p>
                    <p className="text-2xl font-bold">{stats.approved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Rejected</p>
                    <p className="text-2xl font-bold">{stats.rejected}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-700">Interview</p>
                    <p className="text-2xl font-bold">{stats.interview + stats.shortlisted}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Card */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FilterIcon className="h-5 w-5 text-gray-500" />
                  <CardTitle className="text-lg">Filters & Search</CardTitle>
                </div>
                {activeFilterCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters ({activeFilterCount})
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search applications by name, email, phone, location, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 text-base"
                />
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Application Status</label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <Button
                        key={status.value}
                        variant={statusFilter.includes(status.value) ? "default" : "outline"}
                        size="sm"
                        className={`px-3 py-1 h-auto ${statusFilter.includes(status.value) ? status.color : ''}`}
                        onClick={() => {
                          setStatusFilter(prev =>
                            prev.includes(status.value)
                              ? prev.filter(s => s !== status.value)
                              : [...prev, status.value]
                          );
                        }}
                      >
                        {status.label}
                        {statusFilter.includes(status.value) && (
                          <span className="ml-1 bg-white/20 px-1 rounded">✓</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Role Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Role Applied For</label>
                  <div className="flex flex-wrap gap-2">
                    {availableRoles.map((role) => (
                      <Button
                        key={role}
                        variant={roleFilter.includes(role) ? "default" : "outline"}
                        size="sm"
                        className="px-3 py-1 h-auto"
                        onClick={() => {
                          setRoleFilter(prev =>
                            prev.includes(role)
                              ? prev.filter(r => r !== role)
                              : [...prev, role]
                          );
                        }}
                      >
                        {role}
                        {roleFilter.includes(role) && (
                          <span className="ml-1 bg-primary/20 px-1 rounded">✓</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Applied</label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="All dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 days</SelectItem>
                      <SelectItem value="month">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <Card className="mb-4 border-blue-200 bg-blue-50">
              <CardContent className="py-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white">
                      {selectedRows.length} selected
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Select bulk action to apply to all selected applications
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={bulkAction} onValueChange={(value) => {
                      setBulkAction(value);
                      if (value) {
                        bulkUpdateStatus(value);
                      }
                    }}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Bulk Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shortlisted">Mark as Shortlisted</SelectItem>
                        <SelectItem value="under_review">Mark as Under Review</SelectItem>
                        <SelectItem value="interview">Mark for Interview</SelectItem>
                        <SelectItem value="approved">Mark as Approved</SelectItem>
                        <SelectItem value="rejected">Mark as Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRows([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>
                    Showing {currentItems.length} of {filteredSubmissions.length} applications
                    {filteredSubmissions.length > 0 && (
                      <span className="ml-2 text-blue-600">
                        (Page {currentPage} of {totalPages})
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <SortAsc className="h-4 w-4 mr-2" />
                        Sort By
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort Applications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSort('submitted_at')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Date Applied
                        {sortField === 'submitted_at' && (
                          <span className="ml-auto">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('full_name')}>
                        <User className="h-4 w-4 mr-2" />
                        Applicant Name
                        {sortField === 'full_name' && (
                          <span className="ml-auto">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('role_interests')}>
                        <Briefcase className="h-4 w-4 mr-2" />
                        Role Applied
                        {sortField === 'role_interests' && (
                          <span className="ml-auto">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort('status')}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Application Status
                        {sortField === 'status' && (
                          <span className="ml-auto">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading applications...</p>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <File className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-600 mb-4">
                    {submissions.length === 0 
                      ? "No applications have been submitted yet." 
                      : "No applications match your current filters."}
                  </p>
                  {(searchTerm || statusFilter.length > 0 || roleFilter.length > 0 || dateFilter !== "all") && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={selectedRows.length === currentItems.length && currentItems.length > 0}
                              onCheckedChange={toggleAllRows}
                            />
                          </TableHead>
                          <TableHead className="w-[80px]">ID</TableHead>
                          <TableHead>
                            <Button 
                              variant="ghost" 
                              className="p-0 h-auto font-semibold"
                              onClick={() => handleSort('full_name')}
                            >
                              Applicant
                              {sortField === 'full_name' && (
                                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button 
                              variant="ghost" 
                              className="p-0 h-auto font-semibold"
                              onClick={() => handleSort('role_interests')}
                            >
                              Role Applied
                              {sortField === 'role_interests' && (
                                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button 
                              variant="ghost" 
                              className="p-0 h-auto font-semibold"
                              onClick={() => handleSort('submitted_at')}
                            >
                              Date Applied
                              {sortField === 'submitted_at' && (
                                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button 
                              variant="ghost" 
                              className="p-0 h-auto font-semibold"
                              onClick={() => handleSort('status')}
                            >
                              Status
                              {sortField === 'status' && (
                                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                              )}
                            </Button>
                          </TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((submission) => (
                          <TableRow 
                            key={submission.id} 
                            className={`hover:bg-gray-50 ${selectedRows.includes(submission.id) ? 'bg-blue-50' : ''}`}
                          >
                            <TableCell>
                              <Checkbox 
                                checked={selectedRows.includes(submission.id)}
                                onCheckedChange={() => toggleRowSelection(submission.id)}
                              />
                            </TableCell>
                            <TableCell className="font-mono text-sm">#{submission.id}</TableCell>
                            <TableCell>
                              <div className="flex items-start space-x-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-full">
                                  <User className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-medium">{submission.full_name}</div>
                                  <div className="text-sm text-gray-500">
                                    <Mail className="inline h-3 w-3 mr-1" />
                                    {submission.email}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {submission.phone}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{getPrimaryRole(submission.role_interests)}</div>
                              {submission.role_interests.length > 1 && (
                                <div className="text-xs text-gray-500">
                                  +{submission.role_interests.length - 1} more
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{formatDate(submission.submitted_at)}</div>
                              <div className="text-xs text-gray-500">
                                {getDaysSince(submission.submitted_at)} days ago
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(submission.status)}</TableCell>
                            <TableCell>
                              <div className="text-sm">{submission.years_experience}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[120px]">
                                {submission.industries}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => {
                                      fetchSubmissionDetails(submission.id);
                                      setIsDialogOpen(true);
                                    }}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    {submission.resume_url && (
                                      <>
                                        <DropdownMenuItem onClick={() => downloadResume(submission)}>
                                          <Download className="h-4 w-4 mr-2" />
                                          Download Resume
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => viewResume(submission)}>
                                          <File className="h-4 w-4 mr-2" />
                                          View Resume
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => updateStatus(submission.id, 'shortlisted')}>
                                      <Star className="h-4 w-4 mr-2" />
                                      Shortlist
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateStatus(submission.id, 'under_review')}>
                                      <EyeIcon className="h-4 w-4 mr-2" />
                                      Mark for Review
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateStatus(submission.id, 'interview')}>
                                      <Briefcase className="h-4 w-4 mr-2" />
                                      Schedule Interview
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => deleteSubmission(submission.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 gap-4">
                      <div className="text-sm text-gray-700">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSubmissions.length)} of {filteredSubmissions.length} entries
                        {selectedRows.length > 0 && (
                          <span className="ml-3 text-blue-600">
                            ({selectedRows.length} selected)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => setCurrentPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Application Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">Application Details</DialogTitle>
                    <DialogDescription className="mt-2">
                      Reviewing application from {selectedSubmission.full_name}
                      <div className="text-sm text-gray-500 mt-1">
                        Applied: {formatDateTime(selectedSubmission.submitted_at)}
                      </div>
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedSubmission.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedSubmission.resume_url) {
                          viewResume(selectedSubmission);
                        }
                      }}
                      disabled={!selectedSubmission.resume_url}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Resume
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                  <TabsTrigger value="review">Review & Action</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Full Name</p>
                            <p className="font-medium">{selectedSubmission.full_name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Location</p>
                            <p>{selectedSubmission.location}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <a 
                              href={`mailto:${selectedSubmission.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {selectedSubmission.email}
                            </a>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <a 
                              href={`tel:${selectedSubmission.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {selectedSubmission.phone}
                            </a>
                          </div>
                        </div>
                        {selectedSubmission.linkedin_profile && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">LinkedIn Profile</p>
                            <a 
                              href={selectedSubmission.linkedin_profile} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all inline-flex items-center gap-1"
                            >
                              <span>View Profile</span>
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </a>
                          </div>
                        )}
                        {selectedSubmission.resume_filename && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Resume/CV</p>
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadResume(selectedSubmission)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewResume(selectedSubmission)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Role & Education Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          Application Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Roles Interested In</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedSubmission.role_interests.map((role, index) => (
                              <Badge key={index} variant="secondary" className="text-sm">
                                {role.role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Years Experience</p>
                            <p>{selectedSubmission.years_experience}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Team Experience</p>
                            <p>{selectedSubmission.has_team_experience === 'yes' ? 'Yes' : 'No'}</p>
                            {selectedSubmission.team_size && (
                              <p className="text-sm text-gray-600">Team Size: {selectedSubmission.team_size}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Education</p>
                          <p>{selectedSubmission.education || 'Not specified'}</p>
                        </div>
                        {selectedSubmission.certifications && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Certifications</p>
                            <p>{selectedSubmission.certifications}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Industries Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Industry Experience
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{selectedSubmission.industries}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedSubmission.achievements ? (
                        <div className="whitespace-pre-line text-gray-700">
                          {selectedSubmission.achievements}
                        </div>
                      ) : (
                        <p className="text-gray-500">No achievements provided</p>
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Business Development Approach</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedSubmission.bd_approach ? (
                          <div className="text-gray-700">{selectedSubmission.bd_approach}</div>
                        ) : (
                          <p className="text-gray-500">Not provided</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Account Management Approach</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedSubmission.am_approach ? (
                          <div className="text-gray-700">{selectedSubmission.am_approach}</div>
                        ) : (
                          <p className="text-gray-500">Not provided</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="capabilities" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Capability Scores</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {selectedSubmission.bd_confidence && (
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Business Development</span>
                            <span className="text-sm font-medium">{selectedSubmission.bd_confidence}/5</span>
                          </div>
                          <Progress value={(selectedSubmission.bd_confidence / 5) * 100} className="h-2" />
                        </div>
                      )}
                      {selectedSubmission.am_confidence && (
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Account Management</span>
                            <span className="text-sm font-medium">{selectedSubmission.am_confidence}/5</span>
                          </div>
                          <Progress value={(selectedSubmission.am_confidence / 5) * 100} className="h-2" />
                        </div>
                      )}
                      {selectedSubmission.sm_confidence && (
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Sales Management</span>
                            <span className="text-sm font-medium">{selectedSubmission.sm_confidence}/5</span>
                          </div>
                          <Progress value={(selectedSubmission.sm_confidence / 5) * 100} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="review" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Review & Decision</CardTitle>
                      {selectedSubmission.review_note && (
                        <CardDescription className="bg-gray-50 p-3 rounded-md mt-2">
                          <strong className="text-gray-700">Previous Note:</strong>
                          <p className="text-gray-600 mt-1">{selectedSubmission.review_note}</p>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Add Review Notes</p>
                        <textarea
                          className="w-full min-h-[120px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add your notes about this candidate, strengths, weaknesses, recommendations, interview feedback..."
                          value={reviewNote}
                          onChange={(e) => setReviewNote(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Button
                          variant="outline"
                          className="h-auto py-4 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => updateStatus(selectedSubmission.id, 'rejected', reviewNote)}
                        >
                          <XCircle className="h-5 w-5 mr-2" />
                          <div className="text-left">
                            <div className="font-semibold">Reject</div>
                            <div className="text-xs font-normal">Not suitable for role</div>
                          </div>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="h-auto py-4 border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() => updateStatus(selectedSubmission.id, 'under_review', reviewNote)}
                        >
                          <EyeIcon className="h-5 w-5 mr-2" />
                          <div className="text-left">
                            <div className="font-semibold">Review</div>
                            <div className="text-xs font-normal">Needs more review</div>
                          </div>
                        </Button>
                        
                        <Button
                          className="h-auto py-4 bg-green-600 hover:bg-green-700"
                          onClick={() => updateStatus(selectedSubmission.id, 'approved', reviewNote)}
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <div className="text-left">
                            <div className="font-semibold">Approve</div>
                            <div className="text-xs font-normal">Move to next stage</div>
                          </div>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <Button
                          variant="outline"
                          className="h-auto py-4 border-purple-200 text-purple-600 hover:bg-purple-50"
                          onClick={() => updateStatus(selectedSubmission.id, 'shortlisted', reviewNote)}
                        >
                          <Star className="h-5 w-5 mr-2" />
                          <div className="text-left">
                            <div className="font-semibold">Shortlist</div>
                            <div className="text-xs font-normal">High-potential candidate</div>
                          </div>
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="h-auto py-4 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          onClick={() => updateStatus(selectedSubmission.id, 'interview', reviewNote)}
                        >
                          <Briefcase className="h-5 w-5 mr-2" />
                          <div className="text-left">
                            <div className="font-semibold">Interview</div>
                            <div className="text-xs font-normal">Schedule interview</div>
                          </div>
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center pt-6 border-t">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSubmission(selectedSubmission.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Application
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Resume Viewer Dialog */}
      <Dialog open={isResumeViewerOpen} onOpenChange={setIsResumeViewerOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Resume Viewer</DialogTitle>
            <DialogDescription>
              Viewing resume for {selectedSubmission?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 border rounded-md overflow-hidden">
            {selectedSubmission?.resume_url ? (
              <iframe
                src={selectedSubmission.resume_url}
                className="w-full h-full"
                title="Resume Viewer"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No resume available</p>
              </div>
            )}
          </div>
          <DialogFooter>
            {selectedSubmission?.resume_url && (
              <Button onClick={() => downloadResume(selectedSubmission)}>
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsResumeViewerOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;