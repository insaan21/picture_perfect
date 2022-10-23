import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react'
import { View, Text } from "react-native";
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { ReturnAR } from './components/ReturnAR';
import { ReturnOther } from './components/ReturnOther';

export function Picture({ route }: any) {
  const [imageURL, setImageURL] = useState('');
  const [available, setAvailable] = useState(true);
  const [active, setActive] = useState(false);
  const devices = useCameraDevices()
  const device = devices.front
  const ViroScene = useRef<any>(null);
  const ViroPlaneSelector = useRef<any>(null);
  const [showImage, setShowImage] = useState(false);
  const [modal, setModal] = useState(false);
  const [showMan, setShowMan] = useState(true);
  const [preview, setPreview] = useState(false);
  const [previewURL, setPreviewURL] = useState('');

  useEffect(() => {
    if (route.params) {
      setImageURL(route.params.imageURL)
    }
  }, [route.params])

  useEffect(() => {
    if (imageURL != "") {
      setShowImage(true);
    }
  }, [imageURL])

  const [flip, setFlip] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setActive(true)
      setShowMan(true)
      return () => {
        setActive(false);
        setImageURL("");
        setPreviewURL("");
        setShowImage(false)
        setPreview(false)
        if (ViroScene.current !== null) {
          ViroScene.current._resetARSession(true, true);
        }
      };
    }, [])
  );

  useEffect(() => {
    Camera.getCameraPermissionStatus().then((status) => {
      if (status === 'not-determined') {
        Camera.requestCameraPermission()
      } else if (status == 'denied') {
        setAvailable(false)
      }
    })
  },[])

  if (device == null || !available) return ( 
    <View style={{flex:1, justifyContent: 'center', alignContent: 'center'}}>
      <Text style={{color: '#fff', textAlign: 'center'}}>This device does not support camera usage</Text>
    </View>
  )

  if (flip) {
    return (
      <ReturnOther 
        device={device}
        active={active}
        flip={flip}
        setFlip={setFlip}
      />
    )
  }

  return (
    <ReturnAR
      flip={flip} 
      setFlip={setFlip} 
      showMan={showMan} 
      setShowMan={setShowMan}
      showImage={showImage}
      setShowImage={setShowImage}
      modal={modal}
      setModal={setModal}
      ViroScene={ViroScene}
      ViroPlaneSelector={ViroPlaneSelector}
      imageURL={imageURL}
      setImageURL={setImageURL}
      preview={preview}
      setPreview={setPreview}
      previewURL={previewURL}
      setPreviewURL={setPreviewURL}
    />
  )
}