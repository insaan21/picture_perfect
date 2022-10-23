import React from 'react'
import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCameraRotate } from '@fortawesome/free-solid-svg-icons';
import { Camera } from 'react-native-vision-camera';

export function ReturnOther({device, active, setFlip, flip}: any) {
  return (      
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={active}
      />

      <View style={styles.settingsContainer}>
        <TouchableOpacity onPress={() => {setFlip(!flip)}}>
          <FontAwesomeIcon icon={ faCameraRotate } size={30} style={{color: "#fff", marginTop: 10}}/>
        </TouchableOpacity>
      </View>

      <View style={styles.captureContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={() => {}}/>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  captureContainer: {
    position: 'absolute', 
    left: 0, 
    bottom: 40, 
    width: "100%", 
    alignItems: 'center'
  },
  captureButton: {
    borderColor: '#fff', 
    borderWidth: 10, 
    height: 100, 
    width: 100, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignContent: 'center',
    alignItems: 'center'
  },
  settingsContainer: {
    position: 'absolute', 
    right: 5, 
    top: 50, 
    height: 50,
    width: "15%", 
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#000',
    opacity: 0.4,
  },
})