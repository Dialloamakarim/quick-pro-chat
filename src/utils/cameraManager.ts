import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export const takePhoto = async (): Promise<string | null> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Camera is only available on native platforms');
    return null;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    return image.dataUrl || null;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
};

export const pickImageFromGallery = async (): Promise<string | null> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Gallery is only available on native platforms');
    return null;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    return image.dataUrl || null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

// For web: simulate image selection with file input
export const pickImageWeb = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    };
    
    input.click();
  });
};
