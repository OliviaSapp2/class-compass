import { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Target, 
  Clock, 
  Shield,
  ChevronRight,
  Save,
  Globe,
  Languages
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { SupportedLanguage, supportedLanguages } from '@/lib/studentMockData';
import { toast } from 'sonner';

export default function StudentSettings() {
  const { studentProfile } = useApp();
  const [name, setName] = useState(studentProfile.name);
  const [email, setEmail] = useState(studentProfile.email);
  const [dailyGoal, setDailyGoal] = useState('30');
  
  // Language preferences
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>('en');
  const [bilingualModeDefault, setBilingualModeDefault] = useState(false);
  const [translateForTeachers, setTranslateForTeachers] = useState(true);
  
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    progressUpdates: true,
    newResources: false,
    assessmentAlerts: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and study preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            Profile
          </CardTitle>
          <CardDescription>
            Your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Class</Label>
            <Input value={studentProfile.className} disabled />
            <p className="text-xs text-muted-foreground">
              Contact your teacher to change classes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Language & Tutor Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Languages className="h-5 w-5 text-muted-foreground" />
            Language & Tutor Preferences
          </CardTitle>
          <CardDescription>
            Configure how the AI Tutor communicates with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Language</Label>
            <Select value={preferredLanguage} onValueChange={(val) => setPreferredLanguage(val as SupportedLanguage)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.name}</span>
                      <span className="text-muted-foreground text-xs">({lang.nativeName})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The AI Tutor will explain concepts in this language
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bilingual Mode (Default)</Label>
              <p className="text-sm text-muted-foreground">
                Show English translation alongside explanations
              </p>
            </div>
            <Switch
              checked={bilingualModeDefault}
              onCheckedChange={setBilingualModeDefault}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Translate Messages for Teachers</Label>
              <p className="text-sm text-muted-foreground">
                Automatically translate your tutor messages to English when shared
              </p>
            </div>
            <Switch
              checked={translateForTeachers}
              onCheckedChange={setTranslateForTeachers}
            />
          </div>
        </CardContent>
      </Card>

      {/* Study Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            Study Preferences
          </CardTitle>
          <CardDescription>
            Customize your learning experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Daily Study Goal</Label>
            <Select value={dailyGoal} onValueChange={setDailyGoal}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Learning Goals</Label>
            <div className="space-y-2">
              {studentProfile.goals.map((goal, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm">{goal}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                Add Goal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what updates you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Study Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Daily reminders to complete your study plan
              </p>
            </div>
            <Switch
              checked={notifications.studyReminders}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, studyReminders: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Progress Updates</Label>
              <p className="text-sm text-muted-foreground">
                Weekly summary of your progress
              </p>
            </div>
            <Switch
              checked={notifications.progressUpdates}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, progressUpdates: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Resources</Label>
              <p className="text-sm text-muted-foreground">
                When new study materials are available
              </p>
            </div>
            <Switch
              checked={notifications.newResources}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, newResources: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Assessment Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Reminders about upcoming quizzes and tests
              </p>
            </div>
            <Switch
              checked={notifications.assessmentAlerts}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, assessmentAlerts: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            Privacy
          </CardTitle>
          <CardDescription>
            Control what your teacher can see
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Share Progress with Teacher</Label>
              <p className="text-sm text-muted-foreground">
                Allow your teacher to see your study activity
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Study Plan</Label>
              <p className="text-sm text-muted-foreground">
                Let your teacher view your personalized plan
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
