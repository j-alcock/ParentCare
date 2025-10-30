import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// Sample image uses a bundled PNG; no SVG conversion at runtime

const MedicationListCaptureScreen = () => {
  const [imageUri, setImageUri] = React.useState<string | null>(null);

  const requestAndOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      await openLibrary();
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 1 });
      if (!result.canceled) {
        setImageUri(result.assets?.[0]?.uri ?? null);
        return;
      }
    } catch (e) {
      await openLibrary();
      return;
    }
  };

  const openLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Photo library permission is needed to select an image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: false, quality: 1 });
    if (!result.canceled) {
      setImageUri(result.assets?.[0]?.uri ?? null);
    }
  };

  // no SVG/bitmap conversion anymore

  const useBundledSamplePng = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const sample = require('../../assets/pill-bottle-sample.png');
      const resolved = (Image as any).resolveAssetSource(sample);
      if (resolved?.uri) setImageUri(resolved.uri);
      else throw new Error('No URI');
    } catch (e) {
      Alert.alert('Sample not found', 'Please add assets/pill-bottle-sample.png to use the bundled sample.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Capture Medication List</Text>
      <TouchableOpacity onPress={requestAndOpenCamera} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#111', alignSelf: 'flex-start' }}>
        <Text style={{ color: '#fff' }}>{imageUri ? 'Retake Photo' : 'Open Camera'}</Text>
      </TouchableOpacity>
      <View style={{ height: 8 }} />
      <TouchableOpacity onPress={openLibrary} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#eee', alignSelf: 'flex-start' }}>
        <Text>Use Photo Library (Simulator Stub)</Text>
      </TouchableOpacity>
      <View style={{ height: 8 }} />
      <TouchableOpacity onPress={useBundledSamplePng} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#eee', alignSelf: 'flex-start' }}>
        <Text>Use Sample Image (Bundled)</Text>
      </TouchableOpacity>
      {Platform.OS === 'ios' ? (
        <Text style={{ marginTop: 8, color: '#555' }}>Tip: On iOS Simulator, use the library option.</Text>
      ) : null}
      {imageUri ? (
        <View style={{ marginTop: 16 }}>
          <Image source={{ uri: imageUri }} style={{ width: '100%', height: 300, borderRadius: 8 }} />
          <Text style={{ marginTop: 8, color: '#555' }}>Image captured. Next step: extract medications and add to list.</Text>
        </View>
      ) : null}
    </View>
  );
};

export default MedicationListCaptureScreen;


