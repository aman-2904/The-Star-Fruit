"use client";

import React, { useCallback, useRef } from 'react';
import Image from 'next/image';
import { CloudUpload, ImagePlus, X, Lightbulb, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface PhotoItem {
  id: string;
  url: string;          // Permanent Supabase Storage URL or blob URL (while uploading)
  isUploading?: boolean;
  uploadError?: string;
  file?: File;          // Only present temporarily during upload
}

export interface Step4PropertyPhotosProps {
  photos: PhotoItem[];
  setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>;
  propertyId: string | null;
  onBack: () => void;
  onNext: () => void;
  canContinue: boolean;
  isSaving?: boolean;
}

const MIN_PHOTOS = 5;
const STORAGE_BUCKET = 'property-images';

async function uploadToSupabase(file: File, propertyId: string): Promise<string> {
  if (!supabase) throw new Error('Supabase not initialized');

  const ext = file.name.split('.').pop();
  const path = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return urlData.publicUrl;
}

export default function Step4PropertyPhotos({
  photos,
  setPhotos,
  propertyId,
  onBack,
  onNext,
  canContinue,
  isSaving
}: Step4PropertyPhotosProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const retryUpload = useCallback(async (photo: PhotoItem) => {
    if (!photo.file || !supabase || !propertyId) return;
    // Mark as uploading again
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, isUploading: true, uploadError: undefined } : p));
    try {
      const permanentUrl = await uploadToSupabase(photo.file, propertyId);
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, url: permanentUrl, isUploading: false, file: undefined } : p));
    } catch (err: any) {
      const errMsg = err?.message || 'Upload failed';
      console.error('[Step4] Retry failed:', errMsg);
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, isUploading: false, uploadError: errMsg } : p));
    }
  }, [setPhotos, propertyId]);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!fileArray.length) return;

    // Immediately add placeholders showing upload state
    const placeholders: PhotoItem[] = fileArray.map(file => ({
      id: `uploading-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      isUploading: true,
      file
    }));

    setPhotos(prev => [...prev, ...placeholders]);

    // Upload each file concurrently
    await Promise.all(
      placeholders.map(async (placeholder, i) => {
        const file = fileArray[i];
        try {
          let permanentUrl: string;

          if (supabase && propertyId) {
            permanentUrl = await uploadToSupabase(file, propertyId);
          } else {
            // If no Supabase / propertyId yet, succeed with blob URL (won't persist)
            permanentUrl = placeholder.url;
          }

          setPhotos(prev => prev.map(p =>
            p.id === placeholder.id
              ? { ...p, url: permanentUrl, isUploading: false, file: undefined }
              : p
          ));

          // Only revoke blob if we got a permanent URL
          if (permanentUrl !== placeholder.url) {
            URL.revokeObjectURL(placeholder.url);
          }
        } catch (err: any) {
          const errMsg = err?.message || JSON.stringify(err) || 'Unknown error';
          console.error(`[Step4] Upload failed for ${file.name}:`, errMsg, err);
          // On error, keep the blob URL so the preview stays but mark as failed
          setPhotos(prev => prev.map(p =>
            p.id === placeholder.id
              ? { ...p, isUploading: false, uploadError: errMsg, file }
              : p
          ));
        }
      })
    );

    // After all uploads, also sync the images array in the DB row
    const client = supabase; // capture for closure
    if (client && propertyId) {
      setPhotos(current => {
        const savedUrls = current
          .filter(p => !p.isUploading && !p.uploadError && !p.url.startsWith('blob:'))
          .map(p => p.url);

        client
          .from('properties')
          .update({ images: savedUrls })
          .eq('id', propertyId)
          .then(({ error }) => {
            if (error) console.error('Error saving images to DB:', error);
          });

        return current; // Don't mutate state here, just trigger the side-effect
      });
    }
  }, [setPhotos, propertyId]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removePhoto = async (photo: PhotoItem) => {
    // Optimistically remove from state
    setPhotos(prev => prev.filter(p => p.id !== photo.id));

    // Delete from Supabase Storage if it's a real uploaded URL
    if (supabase && photo.url && !photo.url.startsWith('blob:') && propertyId) {
      try {
        // Extract the path portion from the public URL
        const urlObj = new URL(photo.url);
        const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${STORAGE_BUCKET}/`);
        if (pathParts[1]) {
          await supabase.storage.from(STORAGE_BUCKET).remove([pathParts[1]]);
        }
      } catch (err) {
        console.error('Error removing photo from storage:', err);
      }
    }

    if (photo.url.startsWith('blob:')) {
      URL.revokeObjectURL(photo.url);
    }
  };

  const uploadedCount = photos.filter(p => !p.isUploading && !p.uploadError).length;
  const isAnyUploading = photos.some(p => p.isUploading);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-12 flex flex-col h-full min-h-[600px]">
      <div className="flex-1">

        {/* Motivational Sub-header */}
        <p className="text-[#EC5B13] font-semibold text-sm mb-3 tracking-wide">
          Almost there! Your luxury listing is coming to life.
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-[#1A1A24] mb-3 tracking-tight">
          Add some photos of your Goa property
        </h2>
        <p className="text-[#6B7280] font-medium text-[15px] mb-8 leading-relaxed max-w-2xl">
          You'll need at least {MIN_PHOTOS} photos to get started. You can add more or change them later. High-quality visuals are key to attracting premium guests.
        </p>

        {/* Supabase not configured warning banner */}
        {(!supabase || !propertyId) && (
          <div className="mb-6 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800 font-medium">
            ⚠️ {!supabase ? 'Supabase credentials not configured in .env.' : 'Please complete Step 1 first to get a property ID before uploading photos.'} Images will show as previews only and will not be saved.
          </div>
        )}

        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-14 px-6 transition-all cursor-pointer mb-6 ${isDragging ? 'border-[#EC5B13] bg-[#FFF5F0]' : 'border-[#FFCBB5] bg-white hover:border-[#EC5B13] hover:bg-[#FFF9F7]'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-[#EC5B13]' : 'bg-[#FFF0E8]'}`}>
            <CloudUpload className={`${isDragging ? 'text-white' : 'text-[#EC5B13]'}`} size={28} strokeWidth={1.8} />
          </div>
          <p className="text-[#1A1A24] font-bold text-lg mb-1">Drag and drop photos here</p>
          <p className="text-gray-500 text-sm mb-6">PNG, JPG or WEBP (Max. 10MB per photo)</p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="flex items-center gap-2 bg-[#1A1A24] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors shadow-md"
          >
            <ImagePlus size={16} />
            Upload from device
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-[#1A1A24] mb-4 text-[17px] flex items-center gap-3">
              Uploaded Photos ({uploadedCount})
              {isAnyUploading && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[#EC5B13]">
                  <Loader2 size={14} className="animate-spin" /> Uploading...
                </span>
              )}
              {!isAnyUploading && uploadedCount < MIN_PHOTOS && (
                <span className="text-sm font-semibold text-[#EC5B13]">
                  ({MIN_PHOTOS - uploadedCount} more needed)
                </span>
              )}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`relative aspect-square rounded-xl overflow-hidden group border-2 ${
                    photo.uploadError ? 'border-red-400 bg-red-50' :
                    index === 0 && !photo.isUploading ? 'border-[#EC5B13]' :
                    'border-transparent hover:border-gray-200'
                  }`}
                >
                  {/* Image Preview */}
                  <Image
                    src={photo.url}
                    alt={`Property photo ${index + 1}`}
                    fill
                    className={`object-cover transition-all ${photo.isUploading ? 'opacity-50' : 'opacity-100'}`}
                    unoptimized
                  />

                  {/* Uploading Overlay */}
                  {photo.isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 gap-1">
                      <Loader2 size={22} className="text-white animate-spin" />
                      <span className="text-white text-[11px] font-bold">Uploading...</span>
                    </div>
                  )}

                  {/* Error Overlay */}
                  {photo.uploadError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/80 gap-2 p-2">
                      <span className="text-white text-[10px] font-bold text-center leading-tight line-clamp-3 px-1">
                        {photo.uploadError.includes('Bucket not found') || photo.uploadError.includes('not found')
                          ? 'Bucket not found. Create "property-images" bucket in Supabase Storage.'
                          : photo.uploadError.includes('security') || photo.uploadError.includes('policy') || photo.uploadError.includes('unauthorized') || photo.uploadError.includes('403')
                          ? 'Permission denied. Check Storage policies in Supabase.'
                          : photo.uploadError
                        }
                      </span>
                      {photo.file && supabase && propertyId && (
                        <button
                          onClick={() => retryUpload(photo)}
                          className="bg-white text-red-600 text-[10px] font-black px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                          Retry ↺
                        </button>
                      )}
                    </div>
                  )}

                  {/* Cover Photo Badge */}
                  {index === 0 && !photo.isUploading && !photo.uploadError && (
                    <div className="absolute top-2 left-2 bg-[#EC5B13] text-white text-[9px] font-black tracking-widest px-2 py-1 rounded-md uppercase">
                      Cover Photo
                    </div>
                  )}

                  {/* Remove Button */}
                  {!photo.isUploading && (
                    <button
                      onClick={() => removePhoto(photo)}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-50 z-10"
                    >
                      <X size={12} strokeWidth={3} className="text-gray-700" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add More Placeholder */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-square rounded-xl border-2 border-dashed border-[#FFCBB5] flex items-center justify-center cursor-pointer hover:border-[#EC5B13] hover:bg-[#FFF9F7] transition-colors group"
              >
                <span className="text-3xl font-light text-gray-400 group-hover:text-[#EC5B13] transition-colors">+</span>
              </div>
            </div>
          </div>
        )}

        {/* Pro Tip */}
        <div className="bg-[#FFF8F5] rounded-xl p-5 flex items-start gap-3 border border-[#FEECE3] mb-8">
          <Lightbulb className="text-[#EC5B13] shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm text-gray-700 font-medium tracking-tight">
              <span className="font-bold text-black">Pro Tip:</span> Bright, high-resolution photos of the living area, bedrooms, and the view can increase your booking potential by up to 60%.
            </p>
          </div>
          <button className="text-[#EC5B13] text-sm font-bold shrink-0 hover:underline flex items-center gap-1">
            Learn more →
          </button>
        </div>
      </div>

      {/* Step Actions */}
      <div className="mb-12 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 text-sm font-bold text-gray-800 hover:bg-gray-100 bg-[#F3F4F6] rounded-xl transition-colors flex items-center gap-2"
        >
          <span>&larr;</span> Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue || isSaving || isAnyUploading}
          className={`px-8 py-3 text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 ${(canContinue && !isSaving && !isAnyUploading) ? 'bg-[#1A1A24] text-white hover:bg-black hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}`}
        >
          {isAnyUploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> :
           isSaving ? 'Saving...' :
           <>Continue <span>&rarr;</span></>}
        </button>
      </div>
    </div>
  );
}
