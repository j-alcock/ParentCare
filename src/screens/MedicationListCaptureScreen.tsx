import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SvgUri } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';

const MedicationListCaptureScreen = () => {
  const [imageUri, setImageUri] = React.useState<string | null>(null);

  const requestAndOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to capture the medication list.');
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 1 });
      if (!result.canceled) {
        setImageUri(result.assets?.[0]?.uri ?? null);
        return;
      }
    } catch (e) {
      // fallthrough to library
    }
    Alert.alert(
      'Camera unavailable',
      'Falling back to photo library (simulator stub).',
      [
        {
          text: 'OK',
          onPress: () => openLibrary(),
        },
      ]
    );
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

  const svgContainerRef = React.useRef<View>(null);

  const createBitmapFromSvgSample = async () => {
    try {
      const resolved = (Image as any).resolveAssetSource(
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('../../assets/pill-bottle-sample.svg')
      );
      if (!resolved?.uri) {
        Alert.alert('Sample not found', 'Could not resolve sample SVG asset.');
        return;
      }
      await new Promise((r) => setTimeout(r, 50));
      const uri = await captureRef(svgContainerRef, { format: 'png', quality: 1 });
      setImageUri(uri);
    } catch (e) {
      Alert.alert('Sample failed', 'Unable to generate sample image.');
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
      <TouchableOpacity onPress={createBitmapFromSvgSample} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: '#eee', alignSelf: 'flex-start' }}>
        <Text>Use Sample Image (Bundled)</Text>
      </TouchableOpacity>
      {Platform.OS === 'ios' ? (
        <Text style={{ marginTop: 8, color: '#555' }}>Tip: On iOS Simulator, use the library option.</Text>
      ) : null}
      {/* Hidden SVG render target for view-shot capture */}
      <View ref={svgContainerRef} style={{ position: 'absolute', left: -10000, top: -10000, width: 1000, height: 650, backgroundColor: '#fff' }}>
        <SvgUri width="1000" height="650" uri={(Image as any).resolveAssetSource(require('../../assets/pill-bottle-sample.svg')).uri} />
      </View>
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


