import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Text, Alert } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { dbLocationsContext } from '../Store';
import Header from '../components/Header';
import DbManager from '../database/DbManager';
import CategoriesModal from '../components/CategoriesModal';
import colors from '../res/colors';

const { width, height } = Dimensions.get('window')
const { inputUnderline, theme, lightGreen, textBlack, white, placeholderGray } = colors

const AddPlaceScreen = ({ route, navigation }) => {

    const [dbLocations, setDbLocations] = useContext(dbLocationsContext);
    const [locationName, setLocationName] = useState("");
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [category, setCategory] = useState(null);
    const [locationComment, setLocationComment] = useState("");
    const [commentBarHeight, setCommentBarHeight] = useState();
    const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);

    useEffect(() => {
        setSelectedCoordinates(route.params.location)
    }, [])

    const updateCommentBarHeight = (val) => {
        const height = val.nativeEvent.contentSize.height
        if (height < 120) {
            setCommentBarHeight(height)
        }else{
            setCommentBarHeight(120)
        }
    }

    const addLocation = async () => {
        if (locationName && category) {
            await DbManager.addLocation({
                locationName: locationName,
                latitude: selectedCoordinates.latitude,
                longitude: selectedCoordinates.longitude,
                categoryId: category.id,
                categoryName: category.categoryName,
                comment: locationComment
            })
            await DbManager.getAllLocations()
                .then(val => setDbLocations(val))
            navigation.navigate('MapScreen')
        } else {
            Alert.alert('', 'Zorunlu alanları doldurunuz.', [{ text: 'TAMAM' }]);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: white }}>
            <Header
                leftIconOnPress={() => navigation.goBack()}
                leftIconName={'keyboard-backspace'}
                leftIconType={'material'}
                leftIconColor={white}
                headerTitle={'Bir Konum Ekle'}
            />
            <View style={{ flex: 1, padding: '8%' }} >
                <Input
                    inputContainerStyle={{ borderBottomColor: inputUnderline }}
                    onChangeText={(value) => setLocationName(value)}
                    inputStyle={styles.inputStyle}
                    placeholder='Konum Adı *'
                />
                <TouchableOpacity
                    style={styles.selectLocationContainer}
                    onPress={() => setCategoriesModalVisible(true)}
                >
                    <Text style={{ color: !category ? placeholderGray : textBlack, fontSize: 19 }}>
                        {!category ? 'Bir kategori belirle *' : category.categoryName}
                    </Text>
                    <Icon
                        style={{ marginLeft: width * 0.06 }}
                        name={!category ? 'chevron-down' : 'check'}
                        type='entypo'
                        color={!category ? theme : lightGreen}
                        size={width * 0.05}
                    />
                </TouchableOpacity>
                <Input
                    inputStyle={styles.inputStyle}
                    inputContainerStyle={[styles.commetInputContainer, { height: commentBarHeight }]}
                    placeholder='Bu konum hakkında birşeyler yaz..'
                    onChangeText={(value) => setLocationComment(value)}
                    onContentSizeChange={(res) => updateCommentBarHeight(res)}
                    editable={true}
                    multiline={true}
                />
                <View style={{ alignItems: 'center' }}>
                    <Button
                        onPress={() => addLocation()}
                        buttonStyle={[styles.saveButtonStyle, { borderColor: locationName && category ? lightGreen : theme }]}
                        titleStyle={{ color: locationName && category ? lightGreen : theme }}
                        title="Konumu Kaydet"
                        type="outline"
                        icon={
                            <Icon
                                name='add-circle-sharp'
                                type='ionicon'
                                color={locationName && category ? lightGreen : theme}
                                size={width * 0.06}
                            />
                        }
                    />
                </View>

            </View>
            <CategoriesModal
                onTouchOutside={() => setCategoriesModalVisible(false)}
                visible={categoriesModalVisible}
                selectCategory={(item) => {
                    setCategory(item)
                    setCategoriesModalVisible(false)
                }}
            />
        </View>
    );
};

export default AddPlaceScreen;

const styles = StyleSheet.create({
    selectLocationContainer: {
        height: width * 0.12,
        alignItems: 'center',
        borderBottomColor: inputUnderline,
        borderBottomWidth: 1,
        paddingHorizontal: 5,
        marginHorizontal: width * 0.024,
        marginBottom: width * 0.085,
        flexDirection: 'row'
    },
    commetInputContainer: {
        borderWidth: 1,
        borderColor: inputUnderline,
        borderRadius: 8,
    },
    inputStyle: {
        color: textBlack,
        fontSize: width * 0.046
    },
    saveButtonStyle: {
        width: width*0.44,
        height: width*0.1,
        borderRadius: width*0.05
    }
});











