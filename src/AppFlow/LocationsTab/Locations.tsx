import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, RefreshControl, Image } from "react-native";
import { LocationsStackParamProps } from './LocationsParamList';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import axios from 'axios';

import { SearchModal } from './components/SearchModal';
import { PictureModal } from './components/PictureModal';

export function Locations({ navigation }: LocationsStackParamProps<"Locations">) {
  const FLICKR_API_KEY = '5d1b29b5a9c367dfcbe7ac194e9bee83'
  const BASE_URL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}`;
  
  const [ location, setLocation ] = useState('Searching...');
  const [ refresh, setRefresh ] = useState(false);
  const [ pictures, setPictures ] = useState([]);
  const [ searchQuery, setSearchQuery ] = useState<any>({});
  const [ searchModal, setSearchModal ] = useState(false);
  const [ pictureModal, setPictureModal ] = useState(false);
  const [ pictureData, setPictureData ] = useState({});
  const [ locString, setLocString ] = useState('');

  function getPictures() {
    setLocation(searchQuery.search)
    var lat: any = 0;
    var lon: any = 0;
    var url = `${BASE_URL}&format=json&nojsoncallback=1&per_page=40`;

    axios.get("https://nominatim.openstreetmap.org/search.php?q=" + searchQuery.location + "&format=jsonv2").then((res) => {
      lat = res.data[0].lat.toString()
      lon = res.data[0].lon.toString()
      setLocString(lat + "," + lon)
    }).then(() => {
      if (lat && lon) {
        url+=`&lat=${lat}&lon=${lon}`
      }

      if (searchQuery.search != undefined && searchQuery.search != '') {
        url += `&text=${searchQuery.search}`
      }
      
      axios.get(url)
      .then((res) => {
        const dataArray = res.data.photos.photo;
        if (dataArray.length > 0) {
          var imageArray = dataArray.map((item: any) => {
            return {
              id: item.id,
              'url': `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`
            }
          })
          setPictures(imageArray);
        } else {
          setPictures([]);
        }
      })
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setSearchModal(true)}>
          <FontAwesomeIcon icon={ faSearch } size={20} style={{
            marginRight: 16,
            color: '#E5E5E7'
          }}/>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getPictures();
  }, [searchQuery]);

  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    setLocation('Searching...');
    setTimeout(() => {
      getPictures();
      setRefresh(false);
    }, 1500);
  }, []);

  return (
    <View>
      <SearchModal modal={searchModal} setModal={setSearchModal} setSearchQuery={setSearchQuery}/>
      <PictureModal modal={pictureModal} setModal={setPictureModal} pictureData={pictureData} navigation={navigation}/>

      <View style={{height: 16, width: 16}}/>

      <View style={styles.currentLocHeader}>
        <Text style={{color: '#fff', fontSize: 16, fontWeight: '700', opacity: 0.9}}>Showing Images For</Text>
        <Text style={{color: '#fff', marginLeft: 'auto', fontSize: 16, opacity: 0.9}}>{location}</Text>
      </View>

      <View style={{height: 16, width: 16}}/>

      <FlatList
        data={pictures}
        numColumns={2}
        keyExtractor={(_item, index) => index.toString()}
        style={{height: '100%', borderRadius: 16}}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        renderItem={({ item }: any) =>
          <TouchableOpacity style={styles.holder} onPress={() => {
            setPictureModal(true)
            setPictureData({
              url: item.url,
              id: item.id,
              loc: locString
            })
          }}>
            <View style={styles.picture}>
              <Image
                style={{width: "100%", height: "100%", borderRadius: 16}}
                source={{uri: item.url}}
              />
            </View>
          </TouchableOpacity>
        }
        ListEmptyComponent={() => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '700', opacity: 0.9}}>No Pictures Found</Text>
          </View>
        )}
      />
    </View>
  )
}

export const styles = StyleSheet.create({
  currentLocHeader: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    backgroundColor: 'rgb(18, 18, 18)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 34,
    paddingHorizontal: 16,
  },
  holder: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%',
    height: '100%'
  },
  picture: {
    height: 175,
    width: "90%",
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#000',
    marginBottom: 16,
  }
});