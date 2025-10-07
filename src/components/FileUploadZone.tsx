import { useCallback, useState } from 'react';
import { Upload, FileText, Image, Music, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadProgress: number;
}

interface FileUploadZoneProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (id: string) => void;
}

export const FileUploadZone = ({ onFilesUploaded, uploadedFiles, onRemoveFile }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.includes('pdf') || type.includes('doc') || type.includes('text')) {
      return <FileText className="w-6 h-6" />;
    }
    if (type.includes('image')) {
      return <Image className="w-6 h-6" />;
    }
    if (type.includes('audio')) {
      return <Music className="w-6 h-6" />;
    }
    return <FileText className="w-6 h-6" />;
  };

  const simulateUpload = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadProgress: 0,
    }));

    // Simulate progressive upload
    newFiles.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        
        onFilesUploaded(newFiles.map((f, i) => 
          i === index ? { ...f, uploadProgress: Math.min(progress, 100) } : f
        ));
      }, 200);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    simulateUpload(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      simulateUpload(files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300",
          isDragging 
            ? "border-accent bg-accent/5 scale-[1.02]" 
            : "border-border bg-card hover:border-primary/50"
        )}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.doc,.docx,.txt,image/*,audio/*"
        />
        
        <div className="flex flex-col items-center gap-4 pointer-events-none">
          <div className={cn(
            "p-4 rounded-full transition-all duration-300",
            isDragging ? "bg-accent text-accent-foreground scale-110" : "bg-primary/10 text-primary"
          )}>
            <Upload className="w-8 h-8" />
          </div>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-1">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, DOC, images, and audio files
            </p>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Uploaded Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-all"
              >
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  {getFileIcon(file.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${file.uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(file.uploadProgress)}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
