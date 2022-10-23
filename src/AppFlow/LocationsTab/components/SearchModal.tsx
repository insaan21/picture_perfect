import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Modal, TouchableOpacity, View, Text,TextInput, Button, Keyboard,SectionList, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker'

export function SearchModal({ modal, setModal, setSearchQuery }: any) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const today = new Date();

  const textRef = useRef<any>();
  const locationRef = useRef<any>();

  return (
    <View>
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
      <Modal
        animationType="slide"
        visible={modal}
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setModal(!modal);
        }}
      >
        <View style={styles.container}>
          <Text style={styles.headerText}>Text</Text>

          <TouchableWithoutFeedback style={styles.searchSection} onPress={() => {textRef.current.focus()}}>
            <FontAwesomeIcon icon={faSearch} style={styles.icon} size={15} />
            <TextInput
              style={[styles.input, {
                color: '#E5E5E7',
                marginLeft: 10,
                fontWeight: '600',
              }]}
              ref={textRef}
              onChangeText={setSearch}
              value={search}
              placeholder="Search for something..."
              keyboardType="visible-password"
              autoCorrect={false}
              autoCapitalize='none'
              placeholderTextColor={'#f5f5f5'}
            />
          </TouchableWithoutFeedback>

          <View style={{height: 0, width: 0}} />
          <Text style={styles.headerText}>Location</Text>

          <TouchableWithoutFeedback style={styles.searchSection} onPress={() => {locationRef.current.focus()}}>
            <FontAwesomeIcon icon={faSearch} style={styles.icon} size={15} />
            <TextInput
              style={[styles.input, {
                color: '#E5E5E7',
                marginLeft: 10,
                fontWeight: '600',
              }]}
              ref={locationRef}
              onChangeText={setLocation}
              value={location}
              placeholder="Search for a location..."
              keyboardType="visible-password"
              autoCorrect={false}
              autoCapitalize='none'
              placeholderTextColor={'#f5f5f5'}
            />
          </TouchableWithoutFeedback>
          
          <Text style={styles.headerText}>Taken After</Text>

          <TouchableOpacity onPress={() => {setOpen(true)}} style={styles.searchSection}>
            <FontAwesomeIcon icon={faCalendarDays} style={styles.icon} size={15} />
            <Text style={styles.dateText}>
              {
                date.toLocaleDateString() == today.toLocaleDateString() 
                ? "Choose a Date"
                : date.toLocaleDateString() 
              }
            </Text>
          </TouchableOpacity>
        </View>


        <View style={styles.floater}>
          <TouchableOpacity style={styles.touchable} onPress={() => {
            setSearchQuery({search, location, date});
            setModal(!modal);
          }}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '700', opacity: 0.9}}>Search</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
    paddingBottom: 40, 
    position: 'relative',
    height: '100%',
  },
  input: {
    flex: 1,
    fontSize: 15
  },
  searchSection: {
    flexDirection: 'row',
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    padding: 10,
    borderRadius: 20,
    height: 55,
    alignItems: 'center',
    backgroundColor: 'rgb(18, 18, 18)'
  },
  searchIcon: {
    padding: 10,
    color: "#fff"
  },
  icon: {
    color: "#fff",
    marginLeft: 10,
    marginRight: 5
  },
  touchable: {
    position: 'absolute',
    width: "90%",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'rgb(93, 95, 222)',
    alignContent: 'center',
    borderRadius: 16,
  },
  floater: {
    position: 'absolute',
    width: "100%",
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    bottom: 50,
    alignContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 30,
    marginTop: 20,
  },
  dateText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },
  searchTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '700',
    marginLeft: 30,
    marginTop: 12,
  },
});