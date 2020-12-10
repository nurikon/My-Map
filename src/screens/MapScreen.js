import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Dimensions, LayoutAnimation, Text, Alert, BackHandler } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { dbLocationsContext, dbCategoriesContext, selectedLocationContext } from '../Store';
import DbManager from '../database/DbManager';
import SearchBar from '../components/SearchBar';
import LocationContent from '../components/LocationContent';
import colors from '../res/colors';
import SettingsModal from '../components/SettingsModal';

const { width, height } = Dimensions.get('window')
const { theme, green, white } = colors
let mapView

const MapScreen = ({ navigation }) => {
  const [dbLocations, setDbLocations] = useContext(dbLocationsContext);
  const [dbCategories, setDbCategories] = useContext(dbCategoriesContext);
  const [selectedLocation, setSelectedLocation] = useContext(selectedLocationContext);
  const [mapViewRegion, setMapViewRegion] = useState(null);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [onLongPressCoordinate, setOnLongPressCoordinate] = useState(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  useEffect(() => {
    onLaunch()
  }, [])

  useEffect(() => {
    const backAction = () => {
      if (searchBarVisible || onLongPressCoordinate || selectedLocation) {
        screenEvents('', false, null, null, false)
      } else { BackHandler.exitApp() }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  });

  useFocusEffect(
    React.useCallback(() => {
      setOnLongPressCoordinate(null)
      screenEvents('', false, null, null, false)
    }, [])
  );

  const onLaunch = async () => {
    getDeviceCoordinate()
      .then(res => setMapViewRegion(res))
    await DbManager.getCategories()
      .then((res) => setDbCategories(res))
    await DbManager.getAllLocations()
      .then(res => setDbLocations(res))
  }
  
  const getDeviceCoordinate = () => {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (geoSuccess) => {
          const region = {
            latitude: geoSuccess.coords.latitude,
            longitude: geoSuccess.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }
          resolve(region)
        },
        (geoError) => Alert.alert('', 'Konum Verinizi açınıp Uygulamayı yeniden başlatınız', [{ text: 'TAMAM' }])
        // { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
      )
    })
  }

  const setSearchText = (text) => {
    if (text === '') {
      setSearchData([])
    } else {
      let searchText = text.trim().toLowerCase();
      let data = dbLocations.filter(item => {
        return item.locationName.toLowerCase().match(searchText)
      });
      setSearchData(data)
    }
  }

  const showMyLocation = () => {
    screenEvents('', false, null, null, false)
    getDeviceCoordinate()
      .then((region) => mapView.animateToRegion(region, 1000))
  }

  const animateToLocation = async (item) => {
    await mapView.animateToRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    }, 1000)
    setSettingsModalVisible(false)
    setSelectedLocation(item)
    setSearchText('')
    setSearchBarVisible(false)
  }

  const screenEvents = (
    paramSearchText,
    paramSearchBarVisible,
    paramOnLongPressCoordinate,
    paramSelectedLocation,
    paramSettingsModalVisible
  ) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setSearchText(paramSearchText)
    setSearchBarVisible(paramSearchBarVisible)
    setOnLongPressCoordinate(paramOnLongPressCoordinate)
    setSelectedLocation(paramSelectedLocation)
    setSettingsModalVisible(paramSettingsModalVisible)
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        loadingEnabled={true}
        toolbarEnabled={false}
        region={mapViewRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        ref={(ref) => { mapView = ref }}
        onPress={() => screenEvents('', false, null, null, false)}
        onRegionChangeComplete={(res) => setMapViewRegion(res)}
        onLongPress={(res) => screenEvents('', false, res.nativeEvent.coordinate, null, false)}
      >
        {dbLocations.map((item) => {
          const filtered = dbCategories.find(x => x.id === item.categoryId)
          const coordinate = { latitude: item.latitude, longitude: item.longitude }
          if (filtered.visible === 'true') {
            return (
              <Marker
                pinColor={theme}
                key={item.id}
                coordinate={coordinate}
                onPress={() => screenEvents('', false, null, item, false)}
              />
            )
          }
        })}
        {onLongPressCoordinate ?
          <Marker
            onPress={() => navigation.navigate('AddPlaceScreen', { location: onLongPressCoordinate })}
            coordinate={onLongPressCoordinate}
          >
            <Text style={styles.addMarkerText}>Ekle</Text>
            <Icon
              name='add-location'
              type='material-icons'
              color={green}
              size={45}
            />
          </Marker> :
          null
        }
      </MapView>
      {selectedLocation ?
        <LocationContent
          close={() => screenEvents('', false, null, null, false)}
          navigation={navigation}
        />
        :
        <>
          <Icon
            containerStyle={[styles.iconContainer, { left: '2%' }]}
            onPress={() => setSettingsModalVisible(true)}
            type='font-awesome'
            size={width * 0.06}
            name='sliders'
            color={theme}
            reverse
          />
          <Icon
            containerStyle={[styles.iconContainer, { right: '2%' }]}
            onPress={() => showMyLocation()}
            type='material-icons'
            size={width * 0.06}
            name='my-location'
            color={theme}
            reverse
          />
        </>
      }
      <SearchBar
        searchIconOnPress={() => screenEvents('', true, null, null, false)}
        closeOnPress={() => screenEvents('', false, null, null, false)}
        searchItemOnPress={(item) => animateToLocation(item)}
        onChangeText={text => setSearchText(text)}
        searchBarVisible={searchBarVisible}
        searchData={searchData}
      />
      <SettingsModal
        close={() => screenEvents('', false, null, null, false)}
        locItemOnPress={(item) => animateToLocation(item)}
        visible={settingsModalVisible}
        navigation={navigation}
      />
    </View>
  );
};
export default MapScreen;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  iconContainer: {
    position: 'absolute',
    bottom: '2%',
    margin: 0,
    elevation: 10
  },
  addMarkerText: {
    width: width * 0.13,
    height: width * 0.09,
    borderRadius: width * 0.045,
    backgroundColor: green,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    color: white
  }
});
