import React, { useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Share } from 'react-native';
import { Icon } from 'react-native-elements';
import { showLocation } from 'react-native-map-link';
import colors from '../res/colors';
import { selectedLocationContext } from '../Store';

const { placeholderGray, textBlack, theme, white } = colors
const { width, height } = Dimensions.get('window')

const LocationContent = (props) => {

    const [selectedLocation, setSelectedLocation] = useContext(selectedLocationContext)
    const { navigation, close } = props


    const onShare = () => {
        Share.share({
            message: `http://www.google.com/maps/place/${selectedLocation.latitude},${selectedLocation.longitude}`
        });
    };
    const openNavigationApp = () => {
        showLocation({
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude
        })
    }
    return (
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <Text style={styles.headerText}>{selectedLocation.categoryName} </Text>
                <Text style={{ fontWeight: 'bold' }}>{selectedLocation.locationName} </Text>
                <Text style={{ color: placeholderGray }}>{selectedLocation.comment}</Text>
                <Icon
                    containerStyle={{ position: 'absolute', right: 3, top: 3 }}
                    onPress={() => close()}
                    name='close-circle-outline'
                    type='ionicon'
                    color={theme}
                    size={width * 0.06}
                />
                <View style={styles.iconContainer}>
                    <Icon
                        containerStyle={styles.bottomİconsetContainer}
                        onPress={() => openNavigationApp()}
                        reverse
                        name='directions'
                        type='font-awesome-5'
                        color={theme}
                        size={width * 0.04}
                    />
                    <Icon
                        containerStyle={styles.bottomİconsetContainer}
                        onPress={() => onPress = onShare()}
                        reverse
                        name='share'
                        type='entypo'
                        color={theme}
                        size={width * 0.04}
                    />
                    <Icon
                        containerStyle={styles.bottomİconsetContainer}
                        onPress={() => { navigation.navigate('EditLocationScreen') }}
                        reverse
                        name='edit'
                        type='material-İcon'
                        color={theme}
                        size={width * 0.04}
                    />
                </View>
            </View>
        </View>
    );
};

export default LocationContent;

const styles = StyleSheet.create({
    mainContainer: {
        position: 'absolute',
        bottom: 0,
        paddingTop:15
    },
    container:{
        borderRadius: 20,
        padding: 10,
        width: width,
        backgroundColor: white,
        elevation:15
    },
    headerText: {
        color: textBlack,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    bottomİconsetContainer: {
        marginVertical: 0,
        elevation: 3
    }

});

