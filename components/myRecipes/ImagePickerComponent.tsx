import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';
import globalStyles from "@/styles/global";
import { Camera } from 'lucide-react-native';

interface Props {
  imageUri: string | null;
  onImagePicked: (uri: string | null) => void;
}

const ImagePickerComponent = ({ imageUri, onImagePicked }: Props) => {
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();

  const handlePickImage = async () => {
    if (imageUri) {
      Alert.alert(
        'Cambiar imagen',
        '¿Qué quieres hacer?',
        [
          { text: 'Tomar foto', onPress: takePhoto },
          { text: 'Elegir de galería', onPress: pickFromGallery },
          { text: 'Eliminar foto', onPress: () => onImagePicked(null), style: 'destructive' },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    } else {
      Alert.alert(
        'Seleccionar imagen',
        '',
        [
          { text: 'Tomar foto', onPress: takePhoto },
          { text: 'Elegir de galería', onPress: pickFromGallery },
          { text: 'Cancelar', style: 'cancel' },
        ]
      );
    }
  };

  const pickFromGallery = async () => {
    const permission = await requestMediaPermission();
    if (!permission.granted) {
      alert('Necesitas dar permisos para acceder a tus fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await requestCameraPermission();
    if (!permission.granted) {
      alert('Necesitas dar permisos para usar la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity onPress={handlePickImage} style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Camera size={40} strokeWidth={1.75} color={Colors.colors.gray[400]} />
          <Text style={styles.placeholderText}>Añadir foto de portada</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    width: '100%',
    backgroundColor: Colors.colors.gray[200],
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    ...globalStyles.mediumBodySemiBold,
    color: Colors.colors.gray[400],
    marginTop: 8,
  },
});

export default ImagePickerComponent;