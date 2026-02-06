import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  success: boolean;
  upload?: {
    id: string;
    fileName: string;
    filePath: string;
    fileSize: string;
    category: string;
    status: string;
    uploadedAt: string;
  };
  error?: string;
}

export async function uploadStudentFile(
  file: File,
  category: 'lecture_notes' | 'study_guide' | 'practice_worksheet' | 'wrong_answers',
  studentId: string = 'student-1'
): Promise<UploadResult> {
  try {
    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${studentId}/${category}/${fileName}`;

    console.log('Uploading file to storage:', filePath);

    // Upload file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('student-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (storageError) {
      console.error('Storage upload error:', storageError);
      return { success: false, error: storageError.message };
    }

    console.log('File uploaded to storage:', storageData.path);

    // Format file size
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Insert metadata into database
    const { data: dbData, error: dbError } = await supabase
      .from('student_uploads')
      .insert({
        student_id: studentId,
        file_name: file.name,
        file_path: storageData.path,
        file_size: formatFileSize(file.size),
        category,
        status: 'uploaded',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Try to clean up the uploaded file
      await supabase.storage.from('student-uploads').remove([storageData.path]);
      return { success: false, error: dbError.message };
    }

    console.log('Upload metadata saved:', dbData.id);

    return {
      success: true,
      upload: {
        id: dbData.id,
        fileName: dbData.file_name,
        filePath: dbData.file_path,
        fileSize: dbData.file_size,
        category: dbData.category,
        status: dbData.status,
        uploadedAt: dbData.uploaded_at,
      },
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

export async function fetchStudentUploads(studentId: string = 'student-1') {
  const { data, error } = await supabase
    .from('student_uploads')
    .select('*')
    .eq('student_id', studentId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Error fetching uploads:', error);
    return { success: false, error: error.message, uploads: [] };
  }

  return {
    success: true,
    uploads: data.map((u) => ({
      id: u.id,
      studentId: u.student_id,
      fileName: u.file_name,
      filePath: u.file_path,
      fileSize: u.file_size,
      category: u.category as 'lecture_notes' | 'study_guide' | 'practice_worksheet' | 'wrong_answers',
      status: u.status as 'uploaded' | 'processing' | 'analyzed',
      uploadedAt: u.uploaded_at,
    })),
  };
}

export async function deleteStudentUpload(uploadId: string, filePath: string) {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('student-uploads')
      .remove([filePath]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('student_uploads')
      .delete()
      .eq('id', uploadId);

    if (dbError) {
      console.error('Database delete error:', dbError);
      return { success: false, error: dbError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}
