import { useState, useCallback } from 'react';
import { 
  Upload as UploadIcon, 
  FileText, 
  X, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  BookOpen,
  StickyNote,
  Presentation
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Upload } from '@/lib/mockData';

export default function Uploads() {
  const { uploads, addUpload } = useApp();
  const [activeTab, setActiveTab] = useState('materials');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);

  const materials = uploads.filter(u => u.type === 'material');
  const studentWork = uploads.filter(u => u.type === 'student_work');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [activeTab]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      setUploadingFiles(prev => [...prev, file.name]);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUpload: Upload = {
        id: Date.now().toString(),
        type: activeTab === 'materials' ? 'material' : 'student_work',
        category: activeTab === 'materials' ? 'lesson_plan' : 'homework',
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        status: 'uploaded',
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Ms. Johnson',
      };
      
      addUpload(newUpload);
      setUploadingFiles(prev => prev.filter(f => f !== file.name));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusBadge = (status: Upload['status']) => {
    switch (status) {
      case 'uploaded':
        return <Badge className="badge-status-success">Uploaded</Badge>;
      case 'processing':
        return <Badge className="badge-status-processing">Processing</Badge>;
      case 'analyzed':
        return <Badge className="badge-status-success">Analyzed</Badge>;
      case 'error':
        return <Badge className="badge-status-error">Error</Badge>;
    }
  };

  const getCategoryIcon = (category: Upload['category']) => {
    switch (category) {
      case 'textbook':
        return <BookOpen className="h-4 w-4" />;
      case 'lesson_plan':
        return <Presentation className="h-4 w-4" />;
      case 'lecture_notes':
        return <StickyNote className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: Upload['category']) => {
    switch (category) {
      case 'textbook': return 'Textbook';
      case 'lesson_plan': return 'Lesson Plan';
      case 'lecture_notes': return 'Lecture Notes';
      case 'homework': return 'Homework';
      case 'quiz': return 'Quiz';
      case 'test': return 'Test';
      case 'classwork': return 'Classwork';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Uploads Hub</h1>
        <p className="text-muted-foreground">
          Upload class materials and graded student work for analysis
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="materials" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Class Materials
            <Badge variant="secondary" className="ml-1">{materials.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="student_work" className="gap-2">
            <FileText className="h-4 w-4" />
            Student Work
            <Badge variant="secondary" className="ml-1">{studentWork.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-6 mt-6">
          <UploadZone
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileInput={handleFileInput}
            uploadingFiles={uploadingFiles}
            description="Textbooks (PDF), lesson plans/slides (PDF/PPT), lecture notes (PDF/DOC)"
          />
          <UploadsTable uploads={materials} getStatusBadge={getStatusBadge} getCategoryIcon={getCategoryIcon} getCategoryLabel={getCategoryLabel} />
        </TabsContent>

        <TabsContent value="student_work" className="space-y-6 mt-6">
          <UploadZone
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileInput={handleFileInput}
            uploadingFiles={uploadingFiles}
            description="Homework, quizzes, tests, classwork (PDF/Images/CSV) – already graded"
          />
          <UploadsTable uploads={studentWork} getStatusBadge={getStatusBadge} getCategoryIcon={getCategoryIcon} getCategoryLabel={getCategoryLabel} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface UploadZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingFiles: string[];
  description: string;
}

function UploadZone({ 
  isDragging, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  onFileInput,
  uploadingFiles,
  description 
}: UploadZoneProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div
          className={cn(
            'dropzone',
            isDragging && 'dropzone-active'
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <UploadIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium">Drop files here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <label>
              <Button variant="secondary" className="cursor-pointer" asChild>
                <span>
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={onFileInput}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.csv,.png,.jpg,.jpeg"
                  />
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Uploading Files */}
        {uploadingFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadingFiles.map(fileName => (
              <div key={fileName} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm flex-1 truncate">{fileName}</span>
                <span className="text-xs text-muted-foreground">Uploading...</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface UploadsTableProps {
  uploads: Upload[];
  getStatusBadge: (status: Upload['status']) => React.ReactNode;
  getCategoryIcon: (category: Upload['category']) => React.ReactNode;
  getCategoryLabel: (category: Upload['category']) => string;
}

function UploadsTable({ uploads, getStatusBadge, getCategoryIcon, getCategoryLabel }: UploadsTableProps) {
  if (uploads.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No files uploaded yet</p>
            <p className="text-sm mt-1">Upload your first file to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploads.map((upload) => (
              <TableRow key={upload.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium truncate max-w-[300px]">{upload.fileName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(upload.category)}
                    <span>{getCategoryLabel(upload.category)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{upload.fileSize}</TableCell>
                <TableCell className="text-muted-foreground">{upload.uploadedBy}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(upload.uploadedAt), { addSuffix: true })}
                </TableCell>
                <TableCell>{getStatusBadge(upload.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
