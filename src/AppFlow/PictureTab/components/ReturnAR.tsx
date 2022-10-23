import React, { useEffect, useState } from 'react'
import { Modal, TouchableOpacity, View, Text, Image, FlatList, Linking, Share } from "react-native";
import { StyleSheet } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCameraRotate, faRobot, faPerson, faSnowman, faGear, faEyeSlash, faEye, faXmarkCircle, faArrowUpFromBracket, faCircleArrowRight, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { SettingsModal } from './SettingsModal';
import { ViroARScene, ViroSpinner, Viro3DObject, ViroARPlaneSelector, ViroARSceneNavigator, ViroARPlane, ViroNode, ViroText, ViroAnimations} from "@viro-community/react-viro";
var RNFS = require('react-native-fs');

export function ReturnAR({flip, setFlip, showMan, setShowMan, showImage, setShowImage, modal, setModal, ViroScene, ViroPlaneSelector, imageURL, preview, setPreview, previewURL, setPreviewURL}: any) {
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  const HelloWorldSceneAR = () => {
    const [loading, setLoading] = useState(true);
    
    return (
      <ViroARScene>
        <ViroARPlane ref={ViroPlaneSelector} minHeight={0.5} minWidth={0.5}>
          <ViroNode rotation={[0, 0, 0]}> 
            <Viro3DObject
              source={require("../assets/joel_model/Waving.vrx")}
              highAccuracyEvents={true}
              position={[0, 0, 0]}
              scale={[0.9, 0.9, 0.9]}
              style={{ opacity: 0.5 }}
              type="VRX"
              animation={{name:'mixamo.com', run:true, loop:true,}}
            />
            <ViroText
              text={'Stand Here'}
              scale={[0.4, 0.4, 0.4]}
              width={3}
              position={[-0.1, 1.7, 0]}
              style={styles.textStyle}
            />
          </ViroNode>
        </ViroARPlane>
      </ViroARScene>
    );
  };
  
  if (preview) {
    return (
      <>
        <View style={styles.previewImage}>
          {
            previewURL != '' && (
              <Image source={{uri: previewURL}} style={{width: "100%", height: "100%", borderRadius: 16}}/>
            )      
          }
        </View>

        <View style={styles.previewContainer}>
          <TouchableOpacity onPress={() => {
            setPreview(false);
            setPreviewURL('');
          }}>
            <FontAwesomeIcon icon={ faXmarkCircle } size={30} style={{color: "#fff", marginTop: 10}}/>
          </TouchableOpacity>
        </View>

        <View style={styles.captureContainer}>
          <TouchableOpacity style={styles.previewShareButton} onPress={() => {
            console.log(previewURL)
            RNFS.readFile(previewURL, 'base64').then((res: any) => { 
              Share.share({
                message: 'Check out this image that was taken using Augmented Reality to take the most perfect picture!',
                url: `data:image/png;base64,${res}`,
              })
            });
          }}>
            <Text style={{color: "#fff", fontSize: 20, fontWeight: '700'}}>
              <FontAwesomeIcon icon={faArrowUpFromBracket} size={20} style={{color: "#fff", marginRight: 15}}/>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

  return (      
    <>
      <SettingsModal modal={modal} setModal={setModal}/>
      <ViroARSceneNavigator
        ref={ViroScene}
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        style={{'flex': 1}}
      />

      <View style={styles.settingsContainer}>
        <TouchableOpacity onPress={() => {setFlip(!flip)}}>
          <FontAwesomeIcon icon={ faCameraRotate } size={30} style={{color: "#fff", marginTop: 10}}/>
        </TouchableOpacity>

        {showMan && (
          <TouchableOpacity onPress={() => {
            setShowMan(!showMan)
            if (ViroScene.current !== null) {
              ViroScene.current._resetARSession(true, true);
              ViroScene.current.pop();
            }
          }}>
            <FontAwesomeIcon icon={ faSnowman } size={30} style={{color: "#fff", marginTop: 20}}/>
          </TouchableOpacity>
        )}

        {!showMan && (
          <TouchableOpacity onPress={() => {setShowMan(!showMan)}}>
            <FontAwesomeIcon icon={ faPerson } size={30} style={{color: "#fff", marginTop: 20}}/>
          </TouchableOpacity>
        )}

        {showImage && (
          <TouchableOpacity onPress={() => {setShowImage(!showImage)}}>
            <FontAwesomeIcon icon={ faEye } size={30} style={{color: "#fff", marginTop: 20}}/>
          </TouchableOpacity>
        )}

        {!showImage && (
          <TouchableOpacity onPress={() => {setShowImage(!showImage)}}>
            <FontAwesomeIcon icon={ faEyeSlash } size={30} style={{color: "#fff", marginTop: 20}}/>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => {setModal(true)}}>
          <FontAwesomeIcon icon={ faGear } size={30} style={{color: "#fff", marginTop: 20}}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          setShowMessage(true);
          setMessageText("Pass to the next person!");
          setTimeout(() => {
            setShowMessage(false);
          }, 3000);
          if (ViroScene.current !== null) {
            ViroScene.current._resetARSession(true, true);
            ViroScene.current.pop();
          }
        }}>
          <FontAwesomeIcon icon={ faArrowCircleRight } size={30} style={{color: "#fff", marginTop: 20}}/>
        </TouchableOpacity>
      </View>

      <View style={styles.captureContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={() => {
            setPreviewURL("")
            setShowImage(false)
            if (ViroScene.current !== null) {
              ViroScene.current._resetARSession(true, true);
              // ViroScene.current.pop();

              setTimeout(() => {
                ViroScene.current?._takeScreenshot("WeAreRunningOnNoSleep", true).then((res: any) => {
                  setPreviewURL('file://' + res.url)
                  setPreview(true)
                })
              }, 500)
            }
        }}/>
      </View>

      {showImage && imageURL != "" &&
        <View style={styles.imageOverlayContainer}>
          <Image source={{uri: imageURL}} style={{width: "100%", height: "100%", borderRadius: 16}}/>
        </View>
      }

      {showMessage && messageText != "" && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{messageText}</Text>
        </View>
      )}
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
    height: 255,
    width: "15%", 
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#000',
    opacity: 0.6,
  },
  imageOverlayContainer: {
    position: 'absolute', 
    left: 20, 
    top: 50, 
    height: "20%",
    width: "60%", 
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#000',
    opacity: 0.6,
  },
  previewImage: {
    height: "100%",
    width: "100%",
  },
  previewContainer: {
    position: 'absolute', 
    right: 5, 
    top: 50, 
    height: 55,
    width: 55, 
    alignItems: 'center',
    borderRadius: 10,
    opacity: 1,
  },
  previewShareButton: {
    height: 70, 
    width: "90%", 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    opacity: 0.5,
  },
  textStyle: {
    fontSize: 30,
    color: '#fff',
    textAlignVertical: 'top',
    textAlign: 'center',
  },
  messageContainer: {
    position: 'absolute', 
    right: 30, 
    top: 350, 
    height: 100,
    width: 350, 
    alignItems: 'center',
    borderRadius: 10,
    opacity: 0.5,
    backgroundColor: '#000',
    alignContent: 'center',
    justifyContent: 'center'
  },
  messageText: {
    fontSize: 30,
    color: '#fff',
    textAlignVertical: 'top',
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
})

ViroAnimations.registerAnimations({
  wave: {
    properties: {},
    duration: 30000,
  },
});