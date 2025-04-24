import { imageKeyToUrl } from "@workspace/ui/lib/format";
import { ActionResponse } from "@workspace/ui/types/common";

/**
 * Uploads a file and returns a full URL for preview/display
 * @param file - The file to upload
 * @param subFolder - Optional subfolder path (e.g. "categories", "products")
 * @param uploadAction - The upload action function to use
 * @param s3Path - The S3 path to use for constructing URLs
 * @returns A promise that resolves to the full URL or null if upload failed
 */
export async function uploadWithPreview(
  file: File,
  subFolder?: string,
  uploadAction?: (file: File | File[], subFolder?: string) => Promise<ActionResponse>,
  s3Path?: string
): Promise<string | null> {
  try {
    // If no upload action is provided, return null
    if (!uploadAction) {
      return null;
    }

    const uploadResult = await uploadAction(file, subFolder);

    if (!uploadResult.success || !uploadResult.data) {
      return null;
    }

    // Extract key from various possible response formats
    let uploadedKey: string | undefined;

    if (
      uploadResult.data.urls &&
      Array.isArray(uploadResult.data.urls) &&
      uploadResult.data.urls.length > 0
    ) {
      uploadedKey = uploadResult.data.urls[0];
    } else if (uploadResult.data.url) {
      uploadedKey = uploadResult.data.url;
    } else if (typeof uploadResult.data === "string") {
      uploadedKey = uploadResult.data;
    } else if (
      Array.isArray(uploadResult.data) &&
      uploadResult.data.length > 0
    ) {
      uploadedKey = uploadResult.data[0];
    }

    if (!uploadedKey || !s3Path) {
      return null;
    }

    // Convert the key to a complete URL
    return imageKeyToUrl(uploadedKey, s3Path);
  } catch (error) {
    return null;
  }
}

/**
 * Uploads multiple files and returns their full URLs for preview/display
 * @param files - Array of files to upload
 * @param subFolder - Optional subfolder path (e.g. "categories", "products")
 * @param uploadAction - The upload action function to use
 * @param s3Path - The S3 path to use for constructing URLs
 * @returns A promise that resolves to an array of full URLs (empty if upload failed)
 */
export async function uploadMultipleWithPreview(
  files: File[],
  subFolder?: string,
  uploadAction?: (file: File | File[], subFolder?: string) => Promise<ActionResponse>,
  s3Path?: string
): Promise<string[]> {
  try {
    if (!uploadAction || !s3Path) {
      return [];
    }
    
    const urls: string[] = [];
    
    // Upload files one by one to handle errors individually
    for (const file of files) {
      const url = await uploadWithPreview(file, subFolder, uploadAction, s3Path);
      if (url) {
        urls.push(url);
      }
    }
    
    return urls;
  } catch (error) {
    return [];
  }
}

/**
 * Extracts the key portion from a full image URL for deletion
 * @param imageUrl - The full image URL
 * @param s3Path - The base S3 path to remove from the URL
 * @returns The key portion of the URL or null if extraction fails
 */
export function extractKeyFromUrl(imageUrl: string, s3Path: string): string | null {
  try {
    if (!imageUrl || !s3Path) {
      return null;
    }
    
    // Remove the s3Path prefix to get just the key part
    if (imageUrl.startsWith(s3Path)) {
      // Remove the S3 path and the leading slash if present
      let key = imageUrl.substring(s3Path.length);
      if (key.startsWith('/')) {
        key = key.substring(1);
      }
      return key || null;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Deletes an image by its URL using the provided delete action
 * @param imageUrl - The URL of the image to delete
 * @param s3Path - The S3 path used to construct the URL
 * @param deleteAction - The function to use for deleting the image
 * @returns A promise that resolves to true if deletion was successful, false otherwise
 */
export async function deleteImageByUrl(
  imageUrl: string | null,
  s3Path: string,
  deleteAction: (keys: string | string[]) => Promise<ActionResponse>
): Promise<boolean> {
  try {
    if (!imageUrl || !s3Path || !deleteAction) {
      return false;
    }
    
    // Extract the key from the URL
    const key = extractKeyFromUrl(imageUrl, s3Path);
    if (!key) {
      return false;
    }
    
    // Delete the file
    const result = await deleteAction(key);
    return result.success;
  } catch (error) {
    return false;
  }
}