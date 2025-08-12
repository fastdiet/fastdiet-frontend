import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export const getLogoBase64 = async (): Promise<string | null> => {
  try {
    const asset = Asset.fromModule(require('@/assets/images/registerFastdiet.png')); 
    await asset.downloadAsync();
    
    if (!asset.localUri) {
      return null;
    }

    const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return `data:image/png;base64,${base64}`;

  } catch (error) {
    return null;
  }
};