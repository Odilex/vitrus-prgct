import { AuthService } from '../auth';

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export class UploadService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  static async uploadImage(file: File): Promise<UploadResponse> {
    try {
      const validation = this.validateImageFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const formData = new FormData();
      formData.append('files', file);

      const response = await AuthService.makeAuthenticatedRequest<{ files: Array<{ url: string }> }>(
        '/uploads/images',
        {
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type, let browser set it with boundary
          },
        }
      );

      if (response.files && response.files.length > 0 && response.files[0].url) {
        // Convert relative URL to full backend URL
        const fullUrl = response.files[0].url.startsWith('http') 
          ? response.files[0].url 
          : `${this.BASE_URL}/api/v1/uploads/serve/images/${response.files[0].url.split('/').pop()}`;
        return { success: true, url: fullUrl };
      } else {
        return { success: false, error: 'No URL returned from server' };
      }
    } catch (error: unknown) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      return { success: false, error: errorMessage };
    }
  }

  static async uploadMultipleImages(files: File[]): Promise<UploadResponse[]> {
    try {
      const formData = new FormData();
      
      // Validate all files first
      for (const file of files) {
        const validation = this.validateImageFile(file);
        if (!validation.valid) {
          return [{ success: false, error: `Invalid file ${file.name}: ${validation.error}` }];
        }
        formData.append('files', file);
      }

      const response = await AuthService.makeAuthenticatedRequest<{ files: Array<{ url: string, filename: string }> }>(
        '/uploads/images',
        {
          method: 'POST',
          body: formData,
          headers: {
            // Don't set Content-Type, let browser set it with boundary
          },
        }
      );

      if (response.files && response.files.length > 0) {
        return response.files.map(file => {
          // Convert relative URL to full backend URL
          const fullUrl = file.url.startsWith('http') 
            ? file.url 
            : `${this.BASE_URL}/api/v1/uploads/serve/images/${file.url.split('/').pop()}`;
          return { success: true, url: fullUrl };
        });
      } else {
        return [{ success: false, error: 'No files returned from server' }];
      }
    } catch (error: unknown) {
      console.error('Multiple upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      return [{ success: false, error: errorMessage }];
    }
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, and WebP images are allowed'
      };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 5MB'
      };
    }

    return { valid: true };
  }
}

export default UploadService;