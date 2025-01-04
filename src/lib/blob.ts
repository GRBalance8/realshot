// src/lib/blob.ts
import { put, PutBlobResult } from '@vercel/blob';

export enum BlobFolder {
  TRAINING = 'training-images',
  REFERENCE = 'reference-images',
  GENERATED = 'generated-images',
}

interface UploadOptions {
  userId: string;
  folder: BlobFolder;
  fileName: string;
  file: Buffer | File;
  contentType?: string;
}

export async function uploadToBlob({
  userId,
  folder,
  fileName,
  file,
  contentType
}: UploadOptions): Promise<PutBlobResult> {
  // Create path with user-specific folder structure
  const path = `${userId}/${folder}/${fileName}`;
  
  try {
    const blob = await put(path, file, {
      contentType,
      access: 'public',
    });

    return blob;
  } catch (error) {
    console.error(`Failed to upload ${path}:`, error);
    throw new Error('Failed to upload file');
  }
}

export async function generateBlobPath(
  userId: string,
  folder: BlobFolder,
  fileName: string
): string {
  return `${userId}/${folder}/${fileName}`;
}
