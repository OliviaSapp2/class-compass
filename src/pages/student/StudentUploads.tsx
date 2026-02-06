import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  Clock,
  CheckCircle,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { StudentUpload } from '@/lib/studentMockData';
import { uploadStudentFile, fetchStudentUploads } from '@/lib/api/student-uploads';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type UploadCategory = StudentUpload['category'];

export default function StudentUploads() {
  const { studentUploads, addStudentUpload, setStudentUploads } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<{ file: File; category: UploadCategory }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load uploads from database on mount
  useEffect(() => {
    loadUploads();
  }, []);

  const loadUploads = async () => {
    setIsLoading(true);
    const result = await fetchStudentUploads();
    if (result.success && result.uploads.length > 0) {
      setStudentUploads(result.uploads);
    }
    setIsLoading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newPendingFiles = files.map(file => ({
      file,
      category: 'lecture_notes' as UploadCategory,
    }));
    setPendingFiles(prev => [...prev, ...newPendingFiles]);
  };

  const updatePendingCategory = (index: number, category: UploadCategory) => {
    setPendingFiles(prev => 
      prev.map((item, i) => i === index ? { ...item, category } : item)
    );
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (pendingFiles.length === 0) return;
    
    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const item of pendingFiles) {
      const result = await uploadStudentFile(item.file, item.category);
      
      if (result.success && result.upload) {
        successCount++;
        // Add to local state
        const newUpload: StudentUpload = {
          id: result.upload.id,
          studentId: 'student-1',
          fileName: result.upload.fileName,
          fileSize: result.upload.fileSize,
          category: result.upload.category as UploadCategory,
          status: result.upload.status as StudentUpload['status'],
          uploadedAt: result.upload.uploadedAt,
        };
        addStudentUpload(newUpload);
      } else {
        errorCount++;
        console.error('Upload failed:', result.error);
      }
    }

    setPendingFiles([]);
    setIsUploading(false);

    if (successCount > 0) {
      toast.success(`${successCount} file${successCount !== 1 ? 's' : ''} uploaded successfully`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} file${errorCount !== 1 ? 's' : ''} failed to upload`);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="h-4 w-4" />;
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) {
      return <FileText className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const getCategoryLabel = (category: UploadCategory) => {
    switch (category) {
      case 'lecture_notes': return 'Lecture Notes';
      case 'study_guide': return 'Study Guide';
      case 'practice_worksheet': return 'Practice Worksheet';
      case 'wrong_answers': return 'Questions I Got Wrong';
    }
  };

  const getStatusBadge = (status: StudentUpload['status']) => {
    switch (status) {
      case 'uploaded':
        return <Badge variant="secondary">Uploaded</Badge>;
      case 'processing':
        return (
          <Badge variant="outline" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      case 'analyzed':
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Analyzed
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Upload className="h-6 w-6 text-primary" />
          My Uploads
        </h1>
        <p className="text-muted-foreground">
          Upload your notes, study guides, and practice materials to get better recommendations
        </p>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Drop files here or click to upload</h3>
            <p className="text-sm text-muted-foreground">
              Supports PDF, Word documents, and images
            </p>
          </div>

          {/* Pending Files */}
          {pendingFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-sm">Ready to upload ({pendingFiles.length})</h4>
              {pendingFiles.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50"
                >
                  {getFileIcon(item.file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(item.file.size)}</p>
                  </div>
                  <Select
                    value={item.category}
                    onValueChange={(v) => updatePendingCategory(index, v as UploadCategory)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lecture_notes">Lecture Notes</SelectItem>
                      <SelectItem value="study_guide">Study Guide</SelectItem>
                      <SelectItem value="practice_worksheet">Practice Worksheet</SelectItem>
                      <SelectItem value="wrong_answers">Questions I Got Wrong</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePendingFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={uploadFiles} className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {pendingFiles.length} file{pendingFiles.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploads Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Uploaded Files</CardTitle>
          <CardDescription>
            Your uploaded materials help us provide better recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studentUploads.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentUploads.map((upload) => (
                  <TableRow key={upload.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getFileIcon(upload.fileName)}
                        <span className="font-medium">{upload.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getCategoryLabel(upload.category)}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{upload.fileSize}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(upload.uploadedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{getStatusBadge(upload.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">No uploads yet</h3>
              <p className="text-sm text-muted-foreground">
                Upload your first file to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
