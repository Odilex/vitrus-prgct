"use client";

import { useState, useEffect } from "react";
import StaffSidebar from "@/components/staff/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  UserPlus,
  Shield,
  Crown,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Settings
} from "lucide-react";

// Team management interfaces
interface TeamStat {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive: string;
  avatar: string;
  permissions: string[];
}

interface TeamData {
  stats: TeamStat[];
  members: TeamMember[];
}

// Team management service
class TeamService {
  private static readonly BASE_URL = '/api/v1/team';

  static async getTeamData(): Promise<TeamData> {
    try {
      const response = await fetch(`${this.BASE_URL}/overview`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`Team API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        stats: data.stats || [],
        members: data.members || []
      };
    } catch (error) {
      console.error('Error fetching team data:', error);
      return {
        stats: [
          {
            title: "Total Staff",
            value: "0",
            change: "No data",
            icon: <Users className="h-5 w-5" />
          },
          {
            title: "Administrators",
            value: "0",
            change: "No data",
            icon: <Crown className="h-5 w-5" />
          },
          {
            title: "Active Agents",
            value: "0",
            change: "No data",
            icon: <Shield className="h-5 w-5" />
          },
          {
            title: "Support Staff",
            value: "0",
            change: "No data",
            icon: <UserPlus className="h-5 w-5" />
          }
        ],
        members: []
      };
    }
  }

  static async addTeamMember(memberData: Omit<TeamMember, 'id' | 'joinDate' | 'lastActive'>): Promise<TeamMember | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify(memberData)
      });

      if (!response.ok) {
        throw new Error(`Add member API error: ${response.status}`);
      }

      const data = await response.json();
      return data.member;
    } catch (error) {
      console.error('Error adding team member:', error);
      return null;
    }
  }

  static async updateTeamMember(memberId: string, memberData: Partial<TeamMember>): Promise<TeamMember | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify(memberData)
      });

      if (!response.ok) {
        throw new Error(`Update member API error: ${response.status}`);
      }

      const data = await response.json();
      return data.member;
    } catch (error) {
      console.error('Error updating team member:', error);
      return null;
    }
  }

  static async deleteTeamMember(memberId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting team member:', error);
      return false;
    }
  }
}

const TeamManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [teamData, setTeamData] = useState<TeamData>({ stats: [], members: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await TeamService.getTeamData();
        setTeamData(data);
      } catch (err) {
        setError('Failed to load team data');
        console.error('Team data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, []);

  // Filter team members based on search and role filter
  const filteredMembers = teamData.members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  // Default roles configuration (can be moved to API later)
  const roles = [
    {
      name: "Administrator",
      description: "Full system access and management",
      permissions: ["all"],
      color: "bg-red-500/20 text-red-400"
    },
    {
      name: "Senior Agent",
      description: "Advanced property and client management",
      permissions: ["properties", "clients", "tours", "analytics"],
      color: "bg-blue-500/20 text-blue-400"
    },
    {
      name: "Agent",
      description: "Basic property and client access",
      permissions: ["properties", "clients"],
      color: "bg-green-500/20 text-green-400"
    },
    {
      name: "Support Specialist",
      description: "Customer support and ticket management",
      permissions: ["support", "clients"],
      color: "bg-yellow-500/20 text-yellow-400"
    }
  ];

  const getRoleColor = (role: string) => {
    const roleData = roles.find(r => r.name === role);
    return roleData ? roleData.color : "bg-gray-500/20 text-gray-400";
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <StaffSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
              <p className="text-slate-400">Manage staff members, roles, and permissions</p>
            </div>
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Roles
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Role Management</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Configure roles and permissions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {roles.map((role, index) => (
                      <div key={index} className="p-4 bg-slate-800 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-white">{role.name}</h4>
                            <p className="text-sm text-slate-400">{role.description}</p>
                          </div>
                          <Badge className={role.color}>{role.name}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {role.permissions.map((permission, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Invite a new team member to join
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" placeholder="Full name" className="col-span-3 bg-slate-800 border-slate-700" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input id="email" type="email" placeholder="email@company.com" className="col-span-3 bg-slate-800 border-slate-700" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">Phone</Label>
                      <Input id="phone" placeholder="+1 (555) 123-4567" className="col-span-3 bg-slate-800 border-slate-700" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">Role</Label>
                      <Select>
                        <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {roles.map((role) => (
                            <SelectItem key={role.name} value={role.name.toLowerCase()}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">Department</Label>
                      <Select>
                        <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="management">Management</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                      Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {teamData.stats.map((stat, index) => (
              <Card key={index} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="bg-blue-500/20 p-2 rounded-md">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    <p className="text-slate-400 text-sm">{stat.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Team Members */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Team Members</CardTitle>
              <CardDescription className="text-slate-400">Manage your team members and their access</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.name} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Members Table */}
              <div className="rounded-md border border-slate-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-300">Member</TableHead>
                      <TableHead className="text-slate-300">Role</TableHead>
                      <TableHead className="text-slate-300">Department</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Last Active</TableHead>
                      <TableHead className="text-slate-300">Join Date</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id} className="border-slate-800">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="bg-slate-700 text-white">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white">{member.name}</p>
                              <p className="text-sm text-slate-400">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{member.department}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{member.lastActive}</TableCell>
                        <TableCell className="text-slate-300">{member.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-red-800 border-red-700 text-red-400 hover:bg-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;