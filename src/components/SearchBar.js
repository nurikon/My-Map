import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, TextInput, Text, ScrollView, UIManager } from 'react-native';
import { Icon } from 'react-native-elements';
import colors from '../res/colors';

const { theme, white, textBlack } = colors
const { width, height } = Dimensions.get('window')
UIManager.setLayoutAnimationEnabledExperimental(true);


const SearchBar = (props) => {

    const {
        searchBarVisible,
        onChangeText,
        closeOnPress,
        searchIconOnPress,
        searchData,
        searchItemOnPress
    } = props

    return (
        <>
            <View style={[styles.searchBarContainer, { width: searchBarVisible ? width * 0.96 : width * 0.12 }]}>
                {searchBarVisible ?
                    <View style={styles.inputContainer} >
                        <TextInput
                            onChangeText={text => { onChangeText(text) }}
                            placeholder="Konumlarınızda arayın"
                            style={styles.input}
                        />
                        <Icon
                            name='close'
                            type='material-icons'
                            color={theme}
                            size={width * 0.06}
                            onPress={closeOnPress}
                        />
                    </View>
                    :
                    <Icon
                        name='search'
                        type='material-icons'
                        color={theme}
                        size={width * 0.06}
                        onPress={searchIconOnPress}
                    />
                }
            </View>
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={styles.itemContainer}>
                {searchData.map((item) => {
                    return (
                        <TouchableOpacity
                            onPress={() => searchItemOnPress(item)}
                            key={item.id}
                            style={styles.item}
                        >
                            <Text style={styles.itemText}>{item.locationName}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </>
    );
}

export default SearchBar;

const styles = StyleSheet.create({
    searchBarContainer: {
        height: width * 0.12,
        borderRadius: width * 0.06,
        right: width * 0.02,
        top: width * 0.01,
        backgroundColor: white,
        position: 'absolute',
        elevation: 10,
        justifyContent: 'center',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.04
    },
    input: {
        color: textBlack,
        padding: 0,
        fontSize: width * 0.043,
        width: width * 0.75
    },
    itemContainer: {
        position: 'absolute',
        top: width * 0.14,
        paddingLeft: width * 0.01
    },
    item: {
        height: width * 0.08,
        borderRadius: width * 0.04,
        marginVertical: width * 0.02,
        marginHorizontal: width * 0.01,
        paddingHorizontal: width * 0.02,
        backgroundColor: white,
        justifyContent: 'center',
        elevation: 5
    },
    itemText: {
        fontSize:width*0.034,
        color: textBlack
    }
});
