import React, { useEffect, useState } from 'react'
import { Modal, TouchableOpacity, View, Text, Image, FlatList, Linking } from "react-native";
import { StyleSheet } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark'
import axios from 'axios';

export function PictureModal({ navigation, modal, setModal, pictureData }: any) {
  const FLICKR_API_KEY = '5d1b29b5a9c367dfcbe7ac194e9bee83'
  const EXIF_BASE_URL = `https://api.flickr.com/services/rest/?method=flickr.photos.getExif&api_key=${FLICKR_API_KEY}&format=json&nojsoncallback=1`;
  const INFO_BASE_URL = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${FLICKR_API_KEY}&format=json&nojsoncallback=1`;
  const GEO_BASE_URL = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${FLICKR_API_KEY}&format=json&nojsoncallback=1`;

  const [ exifData, setExifData ] = useState([]);
  const [ infoData, setInfoData ] = useState<any>({});
  const [ locationString, setLocationString ] = useState('');

  function closeModal() {
    setModal(false)
    setExifData([]);
    setInfoData({});
  }

  useEffect(() => {
    if (pictureData.id) {
      axios.get(`${EXIF_BASE_URL}&photo_id=${pictureData.id}`)
      .then((res) => {
        if (res.data.code) {
          setExifData([]);
        } else {
          const dataArray = res.data.photo.exif;
          const blacklisted: any = []
          var newArray: any = []

          for (var item of dataArray) {
            if (!blacklisted.includes(item.tag)) {
              newArray.push({
                'label': item.tag,
                'value': item.raw._content,
                'order': item.tag.toLowerCase().includes('iso') ? 0 
                  : item.tag.toLowerCase().includes('fnumber') ? 2
                  : item.tag.toLowerCase() === 'focallength' ? 3 
                  : item.tag.toLowerCase().includes('lensinfo') ? 4 
                  : item.tag.toLowerCase().includes('exposure') ? 5 
                  : 6
              })
            }
          }

          newArray = newArray.sort((a : any, b: any) => {
            return a.order - b.order;
          })

          setExifData(newArray)
        }
      })

      axios.get(`${INFO_BASE_URL}&photo_id=${pictureData.id}`)
      .then((res) => {
        setInfoData({
          'title': res.data.photo.title._content,
          'username': res.data.photo.owner.username,
          'date': res.data.photo.dates.taken,
        })
      })

      axios.get(`${GEO_BASE_URL}&photo_id=${pictureData.id}`)
      .then((res) => {
        if (res.data.photo.location) {
          setLocationString(`${res.data.photo.location.latitude}, ${res.data.photo.location.longitude}`)
        }
      })     
    }
  }, [pictureData]);

  return (
    <View>
      <Modal
        animationType="slide"
        visible={modal}
        presentationStyle="pageSheet"
        onRequestClose={() => {
          closeModal();
        }}
      >
        <View style={styles.container}>
          <View style={styles.pictureContainer}>
            <Image
              style={styles.picture}
              source={{uri: pictureData.url}}
            />
            <TouchableOpacity style={styles.icon} onPress={() => closeModal()}>
              <FontAwesomeIcon icon={faCircleXmark} style={styles.icon} size={30} />
            </TouchableOpacity>
          </View>

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
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                  <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', width: '48%'}} onPress={() => {
                    setModal(!modal)
                    navigation.navigate('Camera', {imageURL: pictureData.url})
                  }}>
                    <View style={styles.button}>
                      <Text style={styles.buttonTitle}>Mimic</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', width: '48%'}} onPress={() => {
                    Linking.openURL(`https://maps.apple.com/?daddr=${locationString}`)
                  }}>
                    <View style={styles.button}>
                      <Text style={styles.buttonTitle}>Navigate</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <Text style={{color: '#fff', marginHorizontal: 15, marginTop: 15, fontSize: 25, fontWeight: '700'}}>
                  {infoData.title}
                </Text>
                <Text style={{color: '#fff', marginLeft: 15, marginTop: 5, fontSize: 15, fontWeight: '500', marginBottom: 15}}>@{infoData.username}</Text>
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
    // borderTopEndRadius: 16,
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