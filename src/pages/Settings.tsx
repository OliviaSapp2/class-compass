import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Database,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
              MJ
            </div>
            <div>
              <p className="font-medium">Ms. Johnson</p>
              <p className="text-sm text-muted-foreground">mjohnson@school.edu</p>
            </div>
            <Button variant="outline" className="ml-auto">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Analysis Complete</Label>
              <p className="text-sm text-muted-foreground">Get notified when analysis finishes</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>High-Risk Alerts</Label>
              <p className="text-sm text-muted-foreground">Alert when students fall into high risk</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly Summary</Label>
              <p className="text-sm text-muted-foreground">Receive weekly class performance digest</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data & Privacy
          </CardTitle>
          <CardDescription>Manage your data preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Data Retention</Label>
              <p className="text-sm text-muted-foreground">Keep analysis data for 1 year</p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Export All Data</Label>
              <p className="text-sm text-muted-foreground">Download all your data</p>
            </div>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="justify-start gap-2">
              <HelpCircle className="h-4 w-4" />
              Documentation
            </Button>
            <Button variant="outline" className="justify-start gap-2">
              <Database className="h-4 w-4" />
              API Reference
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
