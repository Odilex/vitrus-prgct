"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/lib/settingsStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  ArrowLeft,
  Save,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = 'user-123';

export default function DashboardSettingsPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  // Settings store
  const {
    userSettings,
    isLoading,
    error,
    isSaving,
    fetchUserSettings,
    updateProfile,
    updateNotifications,
    updateAppearance,
    updateSecurity,
    clearError
  } = useSettingsStore();
  
  // Extract settings with defaults
  const profile = userSettings?.profile || {
    name: 'Admin User',
    email: 'admin@vitrus.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, City, State 12345',
    company: 'Vitrus Real Estate',
    bio: 'Real estate professional with over 10 years of experience in luxury property management.',
    avatar: ''
  };
  
  const notifications = userSettings?.notifications || {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newInquiries: true,
    tourReminders: true,
    propertyUpdates: true,
    marketingEmails: false
  };
  
  const appearance = userSettings?.appearance || {
    theme: 'dark' as const,
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  };
  
  const security = userSettings?.security || {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAlerts: true
  };

  const system = {
    autoBackup: true,
    analyticsTracking: true,
    performanceMode: false,
    backupFrequency: 'daily',
    dataRetention: 365
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Local state for form editing
  const [localProfile, setLocalProfile] = useState(profile);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [localAppearance, setLocalAppearance] = useState(appearance);
  const [localSecurity, setLocalSecurity] = useState(security);
  const [localSystem, setLocalSystem] = useState(system);

  // Update local state when store data changes
  useEffect(() => {
    if (userSettings?.profile) {
      setLocalProfile(userSettings.profile);
    }
  }, [userSettings?.profile]);

  useEffect(() => {
    if (userSettings?.notifications) {
      setLocalNotifications(userSettings.notifications);
    }
  }, [userSettings?.notifications]);

  useEffect(() => {
    if (userSettings?.appearance) {
      setLocalAppearance(userSettings.appearance);
    }
  }, [userSettings?.appearance]);

  useEffect(() => {
    if (userSettings?.security) {
      setLocalSecurity(userSettings.security);
    }
  }, [userSettings?.security]);

  // Fetch user settings on component mount
  useEffect(() => {
    fetchUserSettings(MOCK_USER_ID);
  }, []);

  const handleSaveProfile = async () => {
    try {
      await updateProfile(MOCK_USER_ID, localProfile);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await updateNotifications(MOCK_USER_ID, localNotifications);
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  };

  const handleSaveAppearance = async () => {
    try {
      await updateAppearance(MOCK_USER_ID, localAppearance);
    } catch (error) {
      console.error('Failed to save appearance:', error);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      await updateSecurity(MOCK_USER_ID, localSecurity);
    } catch (error) {
      console.error('Failed to save security:', error);
    }
  };

  const handleSaveSystem = async () => {
    // System settings would need a separate store method
    console.log('System settings save not implemented yet');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Password change would be handled by the store in a real implementation
    console.log('Password change not implemented yet');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleExportData = () => {
    // Export user settings data
    const data = {
      profile: localProfile,
      notifications: localNotifications,
      appearance: localAppearance,
      security: { ...localSecurity, twoFactorAuth: localSecurity.twoFactorAuth },
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vitrus-settings-backup.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.profile) setLocalProfile(data.profile);
          if (data.notifications) setLocalNotifications(data.notifications);
          if (data.appearance) setLocalAppearance(data.appearance);
          if (data.security) setLocalSecurity(data.security);
          alert('Settings imported successfully!');
        } catch (error) {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-slate-400">Manage your account and application preferences</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 relative overflow-hidden"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <span className="ml-3 text-slate-400">Loading settings...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-400 mr-3">⚠️</div>
                <div>
                  <h3 className="text-red-400 font-medium">Error loading settings</h3>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearError();
                  fetchUserSettings(MOCK_USER_ID);
                }}
                className="border-red-700 text-red-400 hover:bg-red-900/30"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Settings Tabs */}
        {!isLoading && (
          <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-600">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-cyan-600">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-cyan-600">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-cyan-600">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-cyan-600">
              <Database className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-slate-400">
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                    <Input
                      id="name"
                      value={localProfile.name}
                      onChange={(e) => setLocalProfile({...localProfile, name: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={localProfile.email}
                      onChange={(e) => setLocalProfile({...localProfile, email: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                    <Input
                      id="phone"
                      value={localProfile.phone}
                      onChange={(e) => setLocalProfile({...localProfile, phone: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-slate-300">Company</Label>
                    <Input
                      id="company"
                      value={localProfile.company}
                      onChange={(e) => setLocalProfile({...localProfile, company: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-slate-300">Address</Label>
                  <Input
                    id="address"
                    value={localProfile.address}
                    onChange={(e) => setLocalProfile({...localProfile, address: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-slate-300">Bio</Label>
                  <Textarea
                    id="bio"
                    value={localProfile.bio}
                    onChange={(e) => setLocalProfile({...localProfile, bio: e.target.value})}
                    className="bg-slate-800 border-slate-700 text-white"
                    rows={4}
                  />
                </div>
                
                {/* Password Change Section */}
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPassword(!showPassword)}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Update Password
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-medium">Email Notifications</Label>
                      <p className="text-slate-400 text-sm">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={localNotifications.emailNotifications}
                      onCheckedChange={(checked) => setLocalNotifications({...localNotifications, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-medium">SMS Notifications</Label>
                      <p className="text-slate-400 text-sm">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={localNotifications.smsNotifications}
                      onCheckedChange={(checked) => setLocalNotifications({...localNotifications, smsNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-medium">Push Notifications</Label>
                      <p className="text-slate-400 text-sm">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={localNotifications.pushNotifications}
                      onCheckedChange={(checked) => setLocalNotifications({...localNotifications, pushNotifications: checked})}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white font-medium">New Inquiries</Label>
                        <p className="text-slate-400 text-sm">When someone inquires about a property</p>
                      </div>
                      <Switch
                        checked={localNotifications.newInquiries}
                        onCheckedChange={(checked) => setLocalNotifications({...localNotifications, newInquiries: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white font-medium">Tour Reminders</Label>
                        <p className="text-slate-400 text-sm">Reminders for upcoming property tours</p>
                      </div>
                      <Switch
                        checked={localNotifications.tourReminders}
                        onCheckedChange={(checked) => setLocalNotifications({...localNotifications, tourReminders: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white font-medium">Property Updates</Label>
                        <p className="text-slate-400 text-sm">When property information is updated</p>
                      </div>
                      <Switch
                        checked={localNotifications.propertyUpdates}
                        onCheckedChange={(checked) => setLocalNotifications({...localNotifications, propertyUpdates: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white font-medium">Marketing Emails</Label>
                        <p className="text-slate-400 text-sm">Promotional and marketing communications</p>
                      </div>
                      <Switch
                        checked={localNotifications.marketingEmails}
                        onCheckedChange={(checked) => setLocalNotifications({...localNotifications, marketingEmails: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveNotifications}
                    disabled={isSaving}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Appearance & Localization</CardTitle>
                <CardDescription className="text-slate-400">
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="theme" className="text-slate-300">Theme</Label>
                    <Select value={localAppearance.theme} onValueChange={(value: 'light' | 'dark' | 'system') => setLocalAppearance({...localAppearance, theme: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="language" className="text-slate-300">Language</Label>
                    <Select value={localAppearance.language} onValueChange={(value) => setLocalAppearance({...localAppearance, language: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone" className="text-slate-300">Timezone</Label>
                    <Select value={localAppearance.timezone} onValueChange={(value) => setLocalAppearance({...localAppearance, timezone: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dateFormat" className="text-slate-300">Date Format</Label>
                    <Select value={localAppearance.dateFormat} onValueChange={(value) => setLocalAppearance({...localAppearance, dateFormat: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="currency" className="text-slate-300">Currency</Label>
                    <Select value={localAppearance.currency} onValueChange={(value) => setLocalAppearance({...localAppearance, currency: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveAppearance}
                    disabled={isSaving}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Appearance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Security & Privacy</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-medium">Two-Factor Authentication</Label>
                      <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={localSecurity.twoFactorAuth}
                      onCheckedChange={(checked) => setLocalSecurity({...localSecurity, twoFactorAuth: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-medium">Login Alerts</Label>
                      <p className="text-slate-400 text-sm">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      checked={localSecurity.loginAlerts}
                      onCheckedChange={(checked) => setLocalSecurity({...localSecurity, loginAlerts: checked})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sessionTimeout" className="text-slate-300">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={localSecurity.sessionTimeout}
                      onChange={(e) => setLocalSecurity({...localSecurity, sessionTimeout: parseInt(e.target.value) || 30})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="passwordExpiry" className="text-slate-300">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={localSecurity.passwordExpiry}
                      onChange={(e) => setLocalSecurity({...localSecurity, passwordExpiry: parseInt(e.target.value) || 90})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveSecurity}
                    disabled={isSaving}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Security
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">System Configuration</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-medium">Auto Backup</Label>
                      <p className="text-slate-400 text-sm">Automatically backup your data</p>
                    </div>
                    <Switch
                      checked={localSystem.autoBackup}
                    onCheckedChange={(checked) => setLocalSystem({...localSystem, autoBackup: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-medium">Analytics Tracking</Label>
                      <p className="text-slate-400 text-sm">Enable usage analytics and reporting</p>
                    </div>
                    <Switch
                      checked={localSystem.analyticsTracking}
                    onCheckedChange={(checked) => setLocalSystem({...localSystem, analyticsTracking: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-medium">Performance Mode</Label>
                      <p className="text-slate-400 text-sm">Optimize for better performance</p>
                    </div>
                    <Switch
                      checked={localSystem.performanceMode}
                    onCheckedChange={(checked) => setLocalSystem({...localSystem, performanceMode: checked})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="backupFrequency" className="text-slate-300">Backup Frequency</Label>
                    <Select value={localSystem.backupFrequency} onValueChange={(value) => setLocalSystem({...localSystem, backupFrequency: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="dataRetention" className="text-slate-300">Data Retention (days)</Label>
                    <Input
                      id="dataRetention"
                      type="number"
                      value={localSystem.dataRetention}
                  onChange={(e) => setLocalSystem({...localSystem, dataRetention: parseInt(e.target.value) || 365})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/20">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Reset All Settings
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-900 border-slate-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Reset All Settings</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            This action cannot be undone. This will permanently reset all your settings to default values.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Reset Settings
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveSystem}
                    disabled={isSaving}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save System
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
}