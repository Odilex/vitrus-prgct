"use client";

import { useState, useEffect } from "react";
import { useSettingsStore } from "@/lib/settingsStore";
import StaffSidebar from "@/components/staff/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Palette,
  Users,
  CreditCard,
  Key,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle
} from "lucide-react";

const StaffSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  // Settings store
  const {
    systemSettings,
    isLoading,
    error,
    isSaving,
    fetchSystemSettings,
    updateSystemSettings,
    clearError
  } = useSettingsStore();
  
  // Local state for form editing
  const [localSettings, setLocalSettings] = useState({
    // General Settings
    siteName: "Vitrus Real Estate",
    siteDescription: "Premium real estate platform",
    contactEmail: "contact@vitrus.com",
    supportEmail: "support@vitrus.com",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Business Ave, City, State 12345",
    timezone: "America/New_York",
    language: "en",
    currency: "USD",
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newPropertyAlerts: true,
    bookingAlerts: true,
    paymentAlerts: true,
    systemAlerts: true,
    
    // Security
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",
    
    // System
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    backupFrequency: "daily",
    logLevel: "info"
  });

  // Fetch system settings on component mount
  useEffect(() => {
    fetchSystemSettings();
  }, [fetchSystemSettings]);

  // Update local state when store data changes
  useEffect(() => {
    if (systemSettings) {
      setLocalSettings(prev => ({ ...prev, ...systemSettings }));
    }
  }, [systemSettings]);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateSystemSettings(localSettings);
    } catch (error) {
      console.error('Failed to save system settings:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <StaffSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
              <p className="text-slate-400">Configure system preferences and settings</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                <Download className="h-4 w-4 mr-2" />
                Export Config
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              <span className="ml-3 text-slate-400">Loading system settings...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="text-red-400 mr-3 h-5 w-5" />
                  <div>
                    <h3 className="text-red-400 font-medium">Error loading system settings</h3>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearError();
                    fetchSystemSettings();
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-900 mb-8">
              <TabsTrigger value="general" className="data-[state=active]:bg-slate-700">
                <Globe className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-slate-700">
                <Database className="h-4 w-4 mr-2" />
                System
              </TabsTrigger>
              <TabsTrigger value="integrations" className="data-[state=active]:bg-slate-700">
                <Key className="h-4 w-4 mr-2" />
                Integrations
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <div className="grid gap-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Site Information
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Basic information about your platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input
                          id="siteName"
                          value={localSettings.siteName}
                          onChange={(e) => handleSettingChange('siteName', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={localSettings.contactEmail}
                          onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Textarea
                        id="siteDescription"
                        value={localSettings.siteDescription}
                        onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          value={localSettings.phoneNumber}
                          onChange={(e) => handleSettingChange('phoneNumber', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supportEmail">Support Email</Label>
                        <Input
                          id="supportEmail"
                          type="email"
                          value={localSettings.supportEmail}
                          onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Textarea
                        id="address"
                        value={localSettings.address}
                        onChange={(e) => handleSettingChange('address', e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Localization
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Regional and language settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={localSettings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={localSettings.language} onValueChange={(value) => handleSettingChange('language', value)}>
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
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={localSettings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
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
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Delivery Methods</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications" className="text-white">Email Notifications</Label>
                          <p className="text-sm text-slate-400">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={localSettings.emailNotifications}
                          onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pushNotifications" className="text-white">Push Notifications</Label>
                          <p className="text-sm text-slate-400">Receive browser push notifications</p>
                        </div>
                        <Switch
                          id="pushNotifications"
                          checked={localSettings.pushNotifications}
                          onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="smsNotifications" className="text-white">SMS Notifications</Label>
                          <p className="text-sm text-slate-400">Receive notifications via SMS</p>
                        </div>
                        <Switch
                          id="smsNotifications"
                          checked={localSettings.smsNotifications}
                          onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Alert Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="newPropertyAlerts" className="text-white">New Property Alerts</Label>
                          <p className="text-sm text-slate-400">When new properties are added</p>
                        </div>
                        <Switch
                          id="newPropertyAlerts"
                          checked={localSettings.newPropertyAlerts}
                          onCheckedChange={(checked) => handleSettingChange('newPropertyAlerts', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="bookingAlerts" className="text-white">Booking Alerts</Label>
                          <p className="text-sm text-slate-400">When tours are booked or cancelled</p>
                        </div>
                        <Switch
                          id="bookingAlerts"
                          checked={localSettings.bookingAlerts}
                          onCheckedChange={(checked) => handleSettingChange('bookingAlerts', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="paymentAlerts" className="text-white">Payment Alerts</Label>
                          <p className="text-sm text-slate-400">When payments are processed or fail</p>
                        </div>
                        <Switch
                          id="paymentAlerts"
                          checked={localSettings.paymentAlerts}
                          onCheckedChange={(checked) => handleSettingChange('paymentAlerts', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="systemAlerts" className="text-white">System Alerts</Label>
                          <p className="text-sm text-slate-400">System maintenance and updates</p>
                        </div>
                        <Switch
                          id="systemAlerts"
                          checked={localSettings.systemAlerts}
                          onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Configuration
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage security policies and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="twoFactorAuth" className="text-white">Two-Factor Authentication</Label>
                        <p className="text-sm text-slate-400">Require 2FA for all staff accounts</p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
                        checked={localSettings.twoFactorAuth}
                        onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                      />
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Session Management</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={localSettings.sessionTimeout}
                          onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                        <Input
                          id="passwordExpiry"
                          type="number"
                          value={localSettings.passwordExpiry}
                          onChange={(e) => handleSettingChange('passwordExpiry', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                        <Input
                          id="loginAttempts"
                          type="number"
                          value={localSettings.loginAttempts}
                          onChange={(e) => handleSettingChange('loginAttempts', e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings */}
            <TabsContent value="system">
              <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      System Configuration
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Advanced system settings and maintenance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">System Status</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="maintenanceMode" className="text-white">Maintenance Mode</Label>
                            <p className="text-sm text-slate-400">Put the system in maintenance mode</p>
                          </div>
                          <Switch
                            id="maintenanceMode"
                            checked={localSettings.maintenanceMode}
                            onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="debugMode" className="text-white">Debug Mode</Label>
                            <p className="text-sm text-slate-400">Enable detailed error logging</p>
                          </div>
                          <Switch
                            id="debugMode"
                            checked={localSettings.debugMode}
                            onCheckedChange={(checked) => handleSettingChange('debugMode', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="cacheEnabled" className="text-white">Cache Enabled</Label>
                            <p className="text-sm text-slate-400">Enable system caching for better performance</p>
                          </div>
                          <Switch
                            id="cacheEnabled"
                            checked={localSettings.cacheEnabled}
                            onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-slate-700" />

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Backup & Logging</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="backupFrequency">Backup Frequency</Label>
                          <Select value={localSettings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
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
                        <div className="space-y-2">
                          <Label htmlFor="logLevel">Log Level</Label>
                          <Select value={localSettings.logLevel} onValueChange={(value) => handleSettingChange('logLevel', value)}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="error">Error</SelectItem>
                              <SelectItem value="warn">Warning</SelectItem>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="debug">Debug</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      System Actions
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Perform system maintenance tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear Cache
                      </Button>
                      <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download Backup
                      </Button>
                      <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Restore Backup
                      </Button>
                      <Button variant="outline" className="bg-red-800 border-red-700 text-red-400 hover:bg-red-700">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Reset System
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Integrations Settings */}
            <TabsContent value="integrations">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Third-Party Integrations
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure API keys and external service integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Payment Gateways</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="stripeKey">Stripe API Key</Label>
                        <Input
                          id="stripeKey"
                          type="password"
                          placeholder="sk_live_..."
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paypalKey">PayPal Client ID</Label>
                        <Input
                          id="paypalKey"
                          type="password"
                          placeholder="AYjcyDKqJgYIgnngJUSaN7ZOynLpmHLs2wIIkXU6yPiVXypNNWxNF6evi6ZI"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Email Services</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sendgridKey">SendGrid API Key</Label>
                        <Input
                          id="sendgridKey"
                          type="password"
                          placeholder="SG.xxxxxxxxxxxx"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mailchimpKey">Mailchimp API Key</Label>
                        <Input
                          id="mailchimpKey"
                          type="password"
                          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Analytics & Tracking</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                        <Input
                          id="googleAnalytics"
                          placeholder="GA_MEASUREMENT_ID"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                        <Input
                          id="facebookPixel"
                          placeholder="123456789012345"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffSettings;