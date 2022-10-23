import React, { useEffect, useState } from 'react'
import { Modal, TouchableOpacity, View, Text, Image, FlatList, Linking } from "react-native";
import { StyleSheet } from "react-native";

export function SettingsModal({ navigation, modal, setModal, pictureData }: any) {
  const exifData = [{
    label: 'ISO',
    value: '32',
  },
  {
    label: 'FNumber',
    value: '1.6',
  },
  {
    label: 'ExposureTime',
    value: '1/2398',
  },
  {
    label: 'ExposureMode',
    value: 'Auto',
  }]
  
  return (
    <View>
      <Modal
        animationType="slide"
        visible={modal}
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setModal(false);
        }}
      >
        <View style={styles.container}>
          <FlatList
            data={exifData}
            keyExtractor={(_item, index) => index.toString()}
            style={{height: '100%'}}
            renderItem={({ item, index }: any) =>
              <View style={{
                justifyContent: 'space-between',
                padding: 10,
                borderBottomColor: '#000',
                borderBottomWidth: 1,
                backgroundColor: 'rgb(18, 18, 18)',
                marginHorizontal: 10,
                borderTopLeftRadius: index == 0 ? 10 : 0,
                borderTopRightRadius: index == 0 ? 10 : 0,
                borderBottomLeftRadius: index == exifData.length - 1 ? 10 : 0,
                borderBottomRightRadius: index == exifData.length - 1 ? 10 : 0,
              }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{ fontWeight: '700', color: '#E5E5E7', fontSize: 16}}>{item.label}</Text>
                </View>
                <View style={{height: 16, width: 16}}/>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{color: '#E5E5E7'}}>{item.value}</Text>
                </View>
              </View>
            }
            ListEmptyComponent={() => (
              <View style={{alignItems: 'center', justifyContent: 'center', margin: 15}}>
                <Text style={{color: '#fff', fontSize: 16, fontWeight: '700', opacity: 0.9}}>Exif data is restricted by author</Text>
              </View>
            )}
            ListHeaderComponent={() => (
              <>
                <Text style={{color: '#fff', marginHorizontal: 15, marginTop: 15, fontSize: 25, fontWeight: '700', marginBottom: 20}}>
                  Update Camera Settings
                </Text>
              </>
            )}
          />
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  infoContainer: {
    borderColor: '#fff', 
    borderWidth: 1,
    width: '43%',
    margin: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#000', 
    paddingBottom: 40, 
    position: 'relative'
  },
  picture: {
    width: "100%", 
    height: "100%", 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16
  },
  input: {
    flex: 1,
    fontSize: 15
  },
  icon: {
    zIndex: 1,
    position: 'absolute',
    top: 10,
    right: 10,
    color: '#fff',
  },
  searchSection: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    padding: 5,
    borderRadius: 20,
  },
  searchIcon: {
    padding: 10,
  },
  pictureContainer: {
    width: "100%",
    height: "40%",
    justifyContent: 'center',
    backgroundColor: '#000',
    marginBottom: 15
  },
  infoText: {
    color: '#fff',
    margin: 15,
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1976D2',
    borderRadius: 8,
    height: 48,
    width: '95%',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
});