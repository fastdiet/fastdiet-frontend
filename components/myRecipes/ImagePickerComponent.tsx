import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';
import globalStyles from "@/styles/global";
import { Camera } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  imageUri: string | null;
  onImagePicked: (uri: string | null) => void;
}

const ImagePickerComponent = ({ imageUri, onImagePicked }: Props) => {
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const { t } = useTranslation();

  const handlePickImage = async () => {
    if (imageUri) {
      Alert.alert(
        t("imagePicker.title1Change"),
        t("imagePicker.title2"),
        [
          { text: t("imagePicker.takePhoto"), onPress: takePhoto },
          { text: t("imagePicker.selectGallery"), onPress: pickFromGallery },
          { text: t("imagePicker.deletePhoto"), onPress: () => onImagePicked(null), style: 'destructive' },
          { text: t("imagePicker.cancel"), style: 'cancel' },
        ]
      );
    } else {
      Alert.alert(
        t("imagePicker.title1Select"),
        '',
        [
          { text: t("imagePicker.takePhoto"), onPress: takePhoto },
          { text: t("imagePicker.selectGallery"), onPress: pickFromGallery },
          { text: t("imagePicker.cancel"), style: 'cancel' },
        ]
      );
    }
  };

  const pickFromGallery = async () => {
    const permission = await requestMediaPermission();
    if (!permission.granted) {
      alert(t("imagePicker.noGalleryPermissions"));
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
      alert(t("imagePicker.noCameraPermissions"));
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
          <Text style={styles.placeholderText}>{t("imagePicker.addPhoto")}</Text>
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