# UI Components Reference for AI Agent Output Formatting

This document lists all available UI components and their props for formatting AI agent analysis output in the frontend pages.

## Import Path
All components are imported from `@/components/ui/[component-name]`

---

## Core Display Components

### Card
**Purpose**: Container for grouping related content with consistent styling.

**Components**:
- `Card` - Main container
- `CardHeader` - Header section with padding
- `CardTitle` - Title text (h3 element)
- `CardDescription` - Description text (muted)
- `CardContent` - Main content area
- `CardFooter` - Footer section

**Props**:
- All accept standard HTML div attributes (`className`, `children`, etc.)

**Example**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Analysis Results</CardTitle>
    <CardDescription>Student performance insights</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
  <CardFooter>
    {/* Footer content */}
  </CardFooter>
</Card>
```

---

### Badge
**Purpose**: Small label for status, categories, or tags.

**Props**:
- `variant`: "default" | "secondary" | "destructive" | "outline"
- `className`: string (optional)
- Standard HTML div attributes

**Example**:
```tsx
<Badge variant="secondary">High Priority</Badge>
<Badge variant="destructive">Low Score</Badge>
<Badge variant="outline">Medium Risk</Badge>
```

---

### Button
**Purpose**: Interactive button element.

**Props**:
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `asChild`: boolean (for composition)
- Standard button HTML attributes (`onClick`, `disabled`, etc.)

**Example**:
```tsx
<Button variant="outline" size="sm" onClick={handleClick}>
  Copy Results
</Button>
```

---

### Alert
**Purpose**: Display important messages or notifications.

**Components**:
- `Alert` - Container
- `AlertTitle` - Alert heading
- `AlertDescription` - Alert content

**Props**:
- `Alert`: `variant`: "default" | "destructive"
- All accept standard HTML attributes

**Example**:
```tsx
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Analysis failed to complete.</AlertDescription>
</Alert>
```

---

## Layout & Structure

### Tabs
**Purpose**: Organize content into multiple panels.

**Components**:
- `Tabs` - Root component (requires `value` and `onValueChange`)
- `TabsList` - Container for tab triggers
- `TabsTrigger` - Individual tab button (requires `value`)
- `TabsContent` - Tab panel content (requires `value`)

**Props**:
- `Tabs`: `value`: string, `onValueChange`: (value: string) => void
- `TabsTrigger`: `value`: string
- `TabsContent`: `value`: string
- All accept `className`

**Example**:
```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="formatted">Formatted</TabsTrigger>
    <TabsTrigger value="text">Text</TabsTrigger>
  </TabsList>
  <TabsContent value="formatted">
    {/* Formatted content */}
  </TabsContent>
  <TabsContent value="text">
    {/* Text content */}
  </TabsContent>
</Tabs>
```

---

### ScrollArea
**Purpose**: Scrollable container with custom scrollbar.

**Props**:
- `className`: string
- `children`: ReactNode
- Standard HTML div attributes

**Example**:
```tsx
<ScrollArea className="h-[500px] w-full">
  {/* Long content */}
</ScrollArea>
```

---

### Separator
**Purpose**: Visual divider between sections.

**Props**:
- `orientation`: "horizontal" | "vertical" (default: "horizontal")
- `className`: string

**Example**:
```tsx
<Separator />
<Separator orientation="vertical" />
```

---

## Data Display

### Table
**Purpose**: Display structured data in rows and columns.

**Components**:
- `Table` - Root table element
- `TableHeader` - Header section
- `TableBody` - Body section
- `TableFooter` - Footer section
- `TableRow` - Table row
- `TableHead` - Header cell
- `TableCell` - Data cell
- `TableCaption` - Table caption

**Props**:
- All accept standard HTML table element attributes
- `className`: string

**Example**:
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Student</TableHead>
      <TableHead>Score</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>85%</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Progress
**Purpose**: Display progress indicator (0-100%).

**Props**:
- `value`: number (0-100, required)
- `className`: string

**Example**:
```tsx
<Progress value={75} className="h-2" />
```

---

## Text & Typography

### Typography Classes (via className)
**Purpose**: Text styling utilities.

**Common Classes**:
- `text-sm` - Small text
- `text-base` - Base text size
- `text-lg` - Large text
- `text-xl` - Extra large
- `text-2xl` - 2x large
- `font-semibold` - Semi-bold weight
- `font-bold` - Bold weight
- `text-muted-foreground` - Muted text color
- `text-foreground` - Default text color
- `text-primary` - Primary color
- `text-destructive` - Error/destructive color
- `text-status-success` - Success color
- `text-status-warning` - Warning color
- `text-status-error` - Error color

**Example**:
```tsx
<h2 className="text-xl font-semibold mb-2">Title</h2>
<p className="text-sm text-muted-foreground">Description</p>
```

---

## Interactive Components

### Dialog
**Purpose**: Modal dialog overlay.

**Components**:
- `Dialog` - Root (requires `open` and `onOpenChange`)
- `DialogTrigger` - Button to open dialog
- `DialogContent` - Dialog container
- `DialogHeader` - Header section
- `DialogTitle` - Dialog title
- `DialogDescription` - Dialog description
- `DialogFooter` - Footer section
- `DialogClose` - Close button

**Props**:
- `Dialog`: `open`: boolean, `onOpenChange`: (open: boolean) => void
- `DialogContent`: `className`: string
- All accept standard HTML attributes

**Example**:
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-4xl">
    <DialogHeader>
      <DialogTitle>Analysis Results</DialogTitle>
      <DialogDescription>View detailed analysis</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button onClick={() => setIsOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Select
**Purpose**: Dropdown selection menu.

**Components**:
- `Select` - Root (requires `value` and `onValueChange`)
- `SelectTrigger` - Trigger button
- `SelectValue` - Display selected value
- `SelectContent` - Dropdown content
- `SelectItem` - Individual option (requires `value`)
- `SelectLabel` - Group label
- `SelectSeparator` - Separator line

**Props**:
- `Select`: `value`: string, `onValueChange`: (value: string) => void
- `SelectItem`: `value`: string
- All accept `className`

**Example**:
```tsx
<Select value={selected} onValueChange={setSelected}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

## Icons (from lucide-react)

**Common Icons for Analysis Display**:
- `TrendingUp` - Upward trend
- `TrendingDown` - Downward trend
- `AlertCircle` - Warning/alert
- `CheckCircle2` - Success/completion
- `X` - Close/remove
- `Copy` - Copy action
- `FileText` - Document/text
- `BookOpen` - Book/documentation
- `Users` - Students/users
- `BarChart3` - Analytics/charts
- `Loader2` - Loading spinner (use with `className="animate-spin"`)

**Example**:
```tsx
import { TrendingUp, AlertCircle } from 'lucide-react';

<TrendingUp className="h-4 w-4 text-primary" />
<AlertCircle className="h-5 w-5 text-status-warning" />
```

---

## Color & Status Classes

### Risk Level Colors
- `text-risk-high` / `bg-risk-high` - High risk (red)
- `text-risk-medium` / `bg-risk-medium` - Medium risk (orange)
- `text-risk-low` / `bg-risk-low` - Low risk (green)
- `bg-risk-high-bg` - High risk background
- `bg-risk-medium-bg` - Medium risk background
- `bg-risk-low-bg` - Low risk background

### Status Colors
- `text-status-success` - Success state
- `text-status-warning` - Warning state
- `text-status-error` - Error state
- `bg-status-success` - Success background

### Border Colors
- `border-primary` - Primary border
- `border-status-warning` - Warning border
- `border-risk-high` - High risk border
- `border-l-4 border-l-red-500` - Left border accent

---

## Layout Utilities

### Spacing
- `space-y-2` - Vertical spacing (gap between children)
- `space-y-4` - Larger vertical spacing
- `space-x-2` - Horizontal spacing
- `gap-2` - Flex/grid gap
- `gap-4` - Larger gap
- `p-2`, `p-4`, `p-6` - Padding
- `px-4`, `py-2` - Padding X/Y
- `mb-2`, `mt-4` - Margin bottom/top

### Flexbox
- `flex` - Display flex
- `flex-col` - Column direction
- `flex-row` - Row direction
- `items-center` - Align items center
- `justify-between` - Space between
- `justify-start` - Align start
- `gap-2` - Gap between items

### Grid
- `grid` - Display grid
- `grid-cols-2` - 2 columns
- `grid-cols-3` - 3 columns
- `md:grid-cols-2` - Responsive: 2 cols on medium screens
- `lg:grid-cols-4` - Responsive: 4 cols on large screens

---

## Common Patterns for AI Output Display

### Student Card Pattern
```tsx
<Card className="border-l-4 border-l-red-500">
  <CardHeader>
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center">
        1
      </div>
      <div>
        <CardTitle>Student Name</CardTitle>
        <p className="text-sm font-semibold text-red-500">
          Score: 5/15 (33%)
        </p>
      </div>
    </div>
  </CardHeader>
  <CardContent className="space-y-3">
    <div>
      <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
        Weak Areas:
      </h4>
      <div className="space-y-1 pl-4">
        <div className="text-sm">
          Mathematics → Number Sense → Integer Operations
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

### Key-Value Display Pattern
```tsx
<div className="mb-2">
  <span className="font-semibold text-foreground">Score:</span>{' '}
  <span className="text-red-500">5/15 (33%)</span>
</div>
```

### Hierarchical Path Display
```tsx
<div className="text-sm">
  {path.split('→').map((part, idx) => (
    <span key={idx}>
      <span className="font-medium">{part.trim()}</span>
      {idx < path.split('→').length - 1 && (
        <span className="mx-2 text-muted-foreground">→</span>
      )}
    </span>
  ))}
</div>
```

### Evidence/Example Highlight
```tsx
<div className="ml-4 mb-2 p-2 bg-muted/50 rounded border-l-2 border-l-primary">
  <span className="text-sm">
    Q1: -5 - 7 = ? → Student answered <strong>12</strong> | Correct: <strong>-12</strong>
  </span>
</div>
```

### Summary Statistics Card
```tsx
<Card>
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">High Priority</p>
        <p className="text-3xl font-bold text-red-500">5</p>
      </div>
      <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Best Practices for AI Output Formatting

1. **Use Cards for Grouping**: Wrap related content in Card components
2. **Hierarchical Structure**: Use CardHeader → CardTitle → CardContent
3. **Color Coding**: Use risk-level colors (red/orange/green) for scores and priorities
4. **Spacing**: Use consistent spacing (`space-y-4`, `gap-2`, etc.)
5. **Typography**: Use semantic text sizes (`text-sm`, `text-base`, `text-lg`)
6. **Icons**: Add relevant icons from lucide-react for visual context
7. **Badges**: Use badges for status indicators and labels
8. **Scrollable Content**: Use ScrollArea for long content (set height)
9. **Responsive**: Use responsive classes (`md:`, `lg:`) for mobile-friendly layouts
10. **Bold Text**: Use `<strong>` or `font-bold` for emphasis on important values

---

## Complete Component List

Available components (import from `@/components/ui/[name]`):
- accordion
- alert-dialog
- alert
- aspect-ratio
- avatar
- badge
- breadcrumb
- button
- calendar
- card
- carousel
- chart
- checkbox
- collapsible
- command
- context-menu
- dialog
- drawer
- dropdown-menu
- form
- hover-card
- input-otp
- input
- label
- menubar
- navigation-menu
- pagination
- popover
- progress
- radio-group
- resizable
- scroll-area
- select
- separator
- sheet
- sidebar
- skeleton
- slider
- sonner (toast notifications)
- switch
- table
- tabs
- textarea
- toast
- toaster
- toggle-group
- toggle
- tooltip
- use-toast (hook)

---

## Utility Functions

### cn() - Class Name Utility
**Purpose**: Merge Tailwind classes conditionally.

**Import**: `import { cn } from '@/lib/utils';`

**Example**:
```tsx
<div className={cn(
  "base-class",
  condition && "conditional-class",
  className
)}>
```

---

This reference should be used when formatting AI agent analysis output for display in Dashboard, Students, and Class Insights pages.
