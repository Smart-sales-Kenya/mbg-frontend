"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Eye, CheckCircle, XCircle, Download, User, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: get CSRF token
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

interface SubmissionData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_profile: string;
  years_experience: string;
  industries: string;
  has_team_experience: string;
  team_size: number | null;
  bd_confidence: number;
  am_confidence: number;
  am_approach: string;
  bd_approach: string;
  sm_confidence: number | null;
  achievements: string;
  education: string;
  certifications: string;
  status: string;
  submitted_at: string;
  role_interests: Array<{
    id: number;
    role: string;
  }>;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<SubmissionData[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userData, setUserData] = useState<any>(null);

  // Check admin access and fetch data
  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, statusFilter, experienceFilter, roleFilter]);

  const checkAdminAccess = async () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user_data');

    if (!token || !user) {
      navigate('/register');
      return;
    }

    try {
      const userData = JSON.parse(user);
      setUserData(userData);

      // Check if user is admin (using is_staff as primary indicator)
      const isAdmin = userData.is_staff || userData.is_superuser || userData.role === 'admin';
      if (!isAdmin) {
        toast.error("Access denied. Admin privileges required.");
        navigate('/recruitment/user-dashboard');
        return;
      }

      // If admin, fetch submissions
      await fetchSubmissions();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/register');
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("Please log in to access admin dashboard");
        return;
      }

      // Use the correct endpoint based on your Django URLs
      const response = await fetch(`${API_BASE_URL}/api/sales-capability/`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        navigate('/register');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }

      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.industries.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }

    // Experience filter
    if (experienceFilter !== "all") {
      filtered = filtered.filter(submission => submission.years_experience === experienceFilter);
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(submission =>
        submission.role_interests.some(interest => interest.role === roleFilter)
      );
    }

    setFilteredSubmissions(filtered);
  };

  const updateSubmissionStatus = async (submissionId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error("Please log in");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/sales-capability/${submissionId}/update_status/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      // Update local state
      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === submissionId ? { ...sub, status: newStatus } : sub
        )
      );

      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null);
      }

      toast.success(`Submission status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 mr-1" />;
      case 'reviewed':
        return <Eye className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  const getExperienceLabel = (years: string) => {
    const experienceMap: { [key: string]: string } = {
      '0-1': '0-1 years',
      '1-3': '1-3 years',
      '3-6': '3-6 years',
      '6-10': '6-10 years',
      '10+': '10+ years',
    };
    return experienceMap[years] || years;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const downloadCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Location',
      'Experience',
      'Industries',
      'Roles',
      'Status',
      'Submitted Date'
    ];

    const csvData = filteredSubmissions.map(sub => [
      sub.full_name,
      sub.email,
      sub.phone,
      sub.location,
      getExperienceLabel(sub.years_experience),
      sub.industries,
      sub.role_interests.map(ri => ri.role).join('; '),
      sub.status,
      formatDate(sub.submitted_at)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("CSV exported successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100 mt-1">
                Welcome back, {userData?.first_name || userData?.username || 'Admin'}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="secondary" 
                onClick={downloadCSV}
                className="bg-white/20 hover:bg-white/30 border-white/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {filteredSubmissions.length} submissions
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search candidates..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Experience Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All experience levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Experience</SelectItem>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-6">3-6 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Role Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Role Interest</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="National Sales Manager">National Sales Manager</SelectItem>
                        <SelectItem value="Area/Regional Sales Manager">Area/Regional Sales Manager</SelectItem>
                        <SelectItem value="Territory Manager">Territory Manager</SelectItem>
                        <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                        <SelectItem value="Sales Operations">Sales Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setExperienceFilter("all");
                      setRoleFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-semibold">{submissions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {submissions.filter(s => s.status === 'pending').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reviewed</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {submissions.filter(s => s.status === 'reviewed').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Accepted</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {submissions.filter(s => s.status === 'accepted').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Rejected</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {submissions.filter(s => s.status === 'rejected').length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="list" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="list">Submission List</TabsTrigger>
                  <TabsTrigger value="details" disabled={!selectedSubmission}>
                    Candidate Details
                  </TabsTrigger>
                </TabsList>

                {/* Submission List */}
                <TabsContent value="list">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submissions</CardTitle>
                      <CardDescription>
                        Manage and review all candidate submissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {filteredSubmissions.length === 0 ? (
                        <div className="text-center py-12">
                          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground text-lg">No submissions found</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {submissions.length === 0 
                              ? "No submissions have been made yet" 
                              : "Try adjusting your filters or search terms"
                            }
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Experience</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredSubmissions.map((submission) => (
                                <TableRow key={submission.id} className="hover:bg-gray-50">
                                  <TableCell>
                                    <div>
                                      <p className="font-medium">{submission.full_name}</p>
                                      <p className="text-sm text-muted-foreground">{submission.email}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {getExperienceLabel(submission.years_experience)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                                      {submission.role_interests.slice(0, 2).map((interest) => (
                                        <Badge key={interest.id} variant="outline" className="text-xs">
                                          {interest.role.split(' ')[0]}
                                        </Badge>
                                      ))}
                                      {submission.role_interests.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{submission.role_interests.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>{submission.location}</TableCell>
                                  <TableCell>{formatDate(submission.submitted_at)}</TableCell>
                                  <TableCell>
                                    <Badge className={`${getStatusColor(submission.status)} flex items-center w-fit`}>
                                      {getStatusIcon(submission.status)}
                                      {submission.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedSubmission(submission)}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      {submission.status !== 'accepted' && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 border-green-200 hover:bg-green-50"
                                          onClick={() => updateSubmissionStatus(submission.id, 'accepted')}
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                        </Button>
                                      )}
                                      {submission.status !== 'rejected' && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-red-600 border-red-200 hover:bg-red-50"
                                          onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                                        >
                                          <XCircle className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Candidate Details */}
                <TabsContent value="details">
                  {selectedSubmission && (
                    <CandidateDetails
                      submission={selectedSubmission}
                      onStatusUpdate={updateSubmissionStatus}
                      onBack={() => setSelectedSubmission(null)}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Candidate Details Component (keep the same as before)
const CandidateDetails = ({ 
  submission, 
  onStatusUpdate, 
  onBack 
}: { 
  submission: SubmissionData;
  onStatusUpdate: (id: number, status: string) => void;
  onBack: () => void;
}) => {
  // ... (keep the same CandidateDetails component code from your original)
  return (
    <Card>
      {/* ... (same content as your original CandidateDetails) */}
    </Card>
  );
};

export default AdminDashboard;