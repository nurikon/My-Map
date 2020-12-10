import React, { useEffect, useState } from 'react';
import { View, Dimensions, LayoutAnimation} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Image } from 'react-native-elements';
import AppNavigationContainer from './src/navigation/Navigation'
import DbManager from './src/database/DbManager';
import Store from './src/Store'

const { width, height } = Dimensions.get('window')

const App = () => {
  const [firstLaunch, setFirstLaunch] = useState(false);

  useEffect(() => {
    onLaunch()
  }, [])

  const onLaunch = async () => {
    const _firstLaunch = await AsyncStorage.getItem("firstLaunch")
    if (_firstLaunch === null) {
      await DbManager.createTableLocations()
      await DbManager.createTableCategories()
      await DbManager.addCategory('Favoriler')
      await AsyncStorage.setItem('firstLaunch', 'true')
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      setTimeout(() => { setFirstLaunch(true) }, 2000)
    } else if (_firstLaunch == 'true') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      setTimeout(() => { setFirstLaunch(true) }, 2000)
    }
  }

  return (
    <>
      {firstLaunch ?
        <Store>
          <AppNavigationContainer />
        </Store>
        :
        <View style={{ flex: 1, backgroundColor: 'red' }}>
          <Image
            source={require('./src/res/opening.jpg')}
            style={{ width: width, height: height }}
          />
        </View>
      }

    </>
  );
};

export default App;

      
