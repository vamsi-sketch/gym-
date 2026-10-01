import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  recommendedSize?: string;
  acceptVideo?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Media Asset',
  recommendedSize = 'Recommended: 16:9 or 4:3 high-res JPG/PNG, max 10MB',
  acceptVideo = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File size exceeds 20MB limit');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
      }, 100);

      const res = await apiService.uploadFile(file);
      clearInterval(interval);
      setUploadProgress(100);

      if (res.success && res.url) {
        onChange(res.url);
      } else {
        setErrorMessage('Failed to upload file');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = () => {
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim());
    setManualUrl('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-md p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === 'upload' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === 'url' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
            }`}
          >
            URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptVideo ? 'image/*,video/*' : 'image/*'}
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              isUploading
                ? 'border-amber-500/50 bg-amber-500/5'
                : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-900'
            }`}
          >
            {isUploading ? (
              <div className="py-4 space-y-2 flex flex-col items-center justify-center">
                <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                <p className="text-xs text-neutral-300 font-medium">Uploading to storage... {uploadProgress}%</p>
                <div className="w-48 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="py-2 flex flex-col items-center justify-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <Upload className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-xs text-neutral-300">
                  <span className="font-semibold text-amber-400 hover:underline">Click to browse</span> or drag and drop
                </div>
                <p className="text-[11px] text-neutral-500">{recommendedSize}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste media image or video URL (e.g. /src/assets/... or https://...)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-white font-medium rounded-lg transition-colors flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5 text-amber-400" />
            Apply
          </button>
        </div>
      )}

      {errorMessage && (
        <p className="text-xs text-rose-400 mt-1">{errorMessage}</p>
      )}

      {/* Preview Card */}
      {value && (
        <div className="relative mt-2 p-2 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center gap-3">
          <div className="w-16 h-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
            {value.endsWith('.mp4') || value.endsWith('.webm') ? (
              <video src={value} className="w-full h-full object-cover" muted />
            ) : (
              <img
                src={value}
                alt="Uploaded asset preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-200 truncate">{value}</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Live media referenced
            </p>
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
