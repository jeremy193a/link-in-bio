'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { UploadedImage } from '@/types';

interface ImageUploaderProps {
  images: File[];
  uploadedImages: UploadedImage[];
  onChange: (files: File[]) => void;
  onUploadedChange: (images: UploadedImage[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  error?: string;
}

export function ImageUploader({
  images,
  uploadedImages,
  onChange,
  onUploadedChange,
  maxFiles = 5,
  maxSizeMB = 5,
  error,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter out files that are too large
      const validFiles = acceptedFiles.filter((file) => {
        const sizeMB = file.size / (1024 * 1024);
        return sizeMB <= maxSizeMB;
      });

      // Limit total number of files
      const totalFiles = images.length + validFiles.length;
      const filesToAdd = totalFiles > maxFiles ? validFiles.slice(0, maxFiles - images.length) : validFiles;

      if (filesToAdd.length > 0) {
        const newImages = [...images, ...filesToAdd];
        onChange(newImages);

        // Generate previews
        filesToAdd.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviews((prev) => [...prev, e.target?.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    [images, maxFiles, maxSizeMB, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: maxFiles - images.length,
    disabled: images.length >= maxFiles,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onChange(newImages);
    setPreviews(newPreviews);
  };

  const removeUploadedImage = (index: number) => {
    const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
    onUploadedChange(newUploadedImages);
  };

  const totalImages = images.length + uploadedImages.length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-slate-700">
          Hình ảnh sản phẩm <span className="text-red-500">*</span>
        </label>
        <span className="text-sm text-slate-500">
          {totalImages}/{maxFiles}
        </span>
      </div>

      {/* Dropzone */}
      {totalImages < maxFiles && (
        <div
          {...getRootProps()}
          className={clsx(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-slate-300 hover:border-emerald-400 bg-white'
          )}
        >
          <input {...getInputProps()} />
          <Upload
            className={clsx(
              'w-12 h-12 mx-auto mb-4',
              isDragActive ? 'text-emerald-600' : 'text-slate-400'
            )}
          />
          <p className="text-base font-medium text-slate-700 mb-1">
            {isDragActive ? 'Thả ảnh vào đây...' : 'Kéo thả ảnh hoặc nhấn để chọn'}
          </p>
          <p className="text-sm text-slate-500">
            PNG, JPG, WebP (tối đa {maxSizeMB}MB mỗi ảnh)
          </p>
        </div>
      )}

      {/* Image Previews */}
      {(previews.length > 0 || uploadedImages.length > 0) && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Uploaded Images */}
          {uploadedImages.map((img, index) => (
            <div key={`uploaded-${index}`} className="relative group aspect-square">
              <img
                src={img.cdnUrl}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-slate-200"
              />
              <button
                type="button"
                onClick={() => removeUploadedImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                aria-label="Xóa ảnh"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded">
                Đã tải lên
              </div>
            </div>
          ))}

          {/* New Image Previews */}
          {previews.map((preview, index) => (
            <div key={`preview-${index}`} className="relative group aspect-square">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-slate-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                aria-label="Xóa ảnh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <p className="mt-2 text-sm text-slate-500">
        Thêm ít nhất 1 hình ảnh sản phẩm. Ảnh sẽ được tối ưu hóa tự động.
      </p>
    </div>
  );
}
