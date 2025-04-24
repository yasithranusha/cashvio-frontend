"use client";

import React, { useState, useEffect } from "react";
import {
  type FileState,
  MultiImageDropzone,
} from "@workspace/ui/components/uploder/MultiImageDropzone";
import { S3FolderType } from "@workspace/ui/types/common";

interface MultiImageUploadInputProps
  extends Omit<React.ComponentProps<"div">, "value" | "onChange"> {
  // Accept string for existing image URL
  value?: string | null;
  // Only return File[] to keep it simple
  onChange?: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // Size in bytes
  subFolder?: string;
}

const MultiImageUploadInput = React.forwardRef<
  HTMLDivElement,
  MultiImageUploadInputProps
>(
  (
    {
      value = null,
      onChange,
      disabled = false,
      maxFiles = 1,
      maxFileSize = 4 * 1024 * 1024, // 4MB default
      subFolder,
      ...props
    },
    ref
  ) => {
    // State to track the dropzone's files
    const [fileStates, setFileStates] = useState<FileState[]>([]);

    // Effect to handle existing image URL if provided
    useEffect(() => {
      if (value && typeof value === "string" && value.trim() !== "") {
        // Check if we already have this URL in our fileStates
        const hasUrl = fileStates.some(f => 
          typeof f.file === 'string' && f.file === value
        );
        
        if (!hasUrl) {
          setFileStates([
            {
              file: value,
              key: value,
              progress: "COMPLETE" as const,
            },
          ]);
        }
      } else if (!value) {
        // If value is nullified, clear any URL files but keep File objects
        setFileStates(prev => prev.filter(f => f.file instanceof File));
      }
    }, [value]);

    // Calculate remaining slots
    const remainingSlots = maxFiles - fileStates.length;

    // Handle file changes from the dropzone
    const handleFileChange = (updatedFiles: FileState[]) => {
      setFileStates(updatedFiles);
      
      // Extract actual File objects for the form
      const fileObjects = updatedFiles
        .map((f) => f.file)
        .filter((f): f is File => f instanceof File);
      
      // Notify parent about file changes
      onChange?.(fileObjects);
    };

    return (
      <div ref={ref} {...props} className="space-y-4">
        <MultiImageDropzone
          value={fileStates}
          dropzoneOptions={{
            maxFiles: remainingSlots > 0 ? remainingSlots : 1,
            maxSize: maxFileSize,
          }}
          disabled={disabled}
          onChange={handleFileChange}
          onFilesAdded={(addedFiles) => {
            if (remainingSlots > 0) {
              const allowedFiles = addedFiles.slice(0, remainingSlots);
              const updatedFiles = [...fileStates, ...allowedFiles];
              setFileStates(updatedFiles);
              
              // Extract actual File objects for the form
              const fileObjects = updatedFiles
                .map((f) => f.file)
                .filter((f): f is File => f instanceof File);
              
              onChange?.(fileObjects);
            }
          }}
        />

        {fileStates.some(f => f.file instanceof File) && (
          <p className="text-sm text-muted-foreground mt-2">
            Image will be uploaded when you submit the form
          </p>
        )}
      </div>
    );
  }
);

MultiImageUploadInput.displayName = "MultiImageUploadInput";

export { MultiImageUploadInput };