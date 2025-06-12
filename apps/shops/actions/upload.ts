"use server";

import { axiosClient } from "@/lib/customAxios";
import { BACKEND_URL, MAILER_UPLOAD_PATH } from "@/lib/constants";
import axios from "axios";
import { ActionResponse } from "@workspace/ui/types/common";

/**
 * Upload files to the server
 * @param files - Files to upload (can be single file or array)
 * @param subFolder - Optional subfolder path (e.g. "electronics/smartphones")
 */
export async function uploadFiles(
  files: File | File[],
  subFolder?: string,
): Promise<ActionResponse> {
  try {
    const formData = new FormData();
    
    // Handle both single file and array of files
    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append('files', file);
      });
    } else {
      formData.append('files', files);
    }

    // Build URL with optional subfolder query param
    let url = `${BACKEND_URL}${MAILER_UPLOAD_PATH}/upload`;
    if (subFolder) {
      url += `?subFolder=${encodeURIComponent(subFolder)}`;
    }

    const response = await axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to upload file(s)",
      };
    }
    return {
      success: false,
      error: "Failed to upload file(s)",
    };
  }
}

/**
 * Delete files from the server
 * @param keys - File keys to delete (can be single key or array of keys)
 */
export async function deleteFiles(
  keys: string | string[],
): Promise<ActionResponse> {
  try {
    // Format keys into an array for the request payload
    const keysArray = Array.isArray(keys) ? keys : [keys];

    await axiosClient.delete(`${BACKEND_URL}${MAILER_UPLOAD_PATH}/upload`, {
      data: {
        key: keysArray,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete file(s)",
      };
    }
    return {
      success: false,
      error: "Failed to delete file(s)",
    };
  }
}