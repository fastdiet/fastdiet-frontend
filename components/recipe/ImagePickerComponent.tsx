import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Colors } from '@/constants/Colors';
// Si tienes estilos globales:


interface Props {
  imageUri: string | null;
  onImagePicked: (uri: string | null) => void;
}

const ImagePickerComponent = ({ imageUri, onImagePicked }: Props) => {
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();

  const openPicker = () => {
    Alert.alert(
      'Selecciona',
      '¿De dónde quieres la foto?',
      [
        { text: 'Cámara', onPress: pickFromCamera },
        { text: 'Galería', onPress: pickFromLibrary },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const pickFromCamera = async () => {
    const permission = await requestCameraPermission();
    if (!permission.granted) {
      alert('Necesitas permiso para usar la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  const pickFromLibrary = async () => {
    const permission = await requestMediaPermission();
    if (!permission.granted) {
      alert('Necesitas permiso para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      onImagePicked(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity onPress={openPicker} style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="camera-outline" size={40} color={Colors.colors.gray[300]} />
          <Text style={styles.placeholderText}>Añadir foto</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    backgroundColor: Colors.colors.gray[200],
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
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