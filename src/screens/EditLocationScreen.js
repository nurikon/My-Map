import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { selectedLocationContext, dbLocationsContext } from '../Store';
import Header from '../components/Header';
import CategoriesModal from '../components/CategoriesModal';
import DbManager from '../database/DbManager';
import DeleteModal from '../components/DeleteModal';
import colors from '../res/colors';


const { width, height } = Dimensions.get('window')
const { white, theme, inputUnderline, textBlack } = colors

const EditLocationScreen = ({ navigation }) => {
    const [dbLocations, setDbLocations] = useContext(dbLocationsContext);
    const [selectedLocation, setSelectedLocation] = useContext(selectedLocationContext);
    const [locationName, setLocationName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [comment, setComment] = useState("");
    const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
    const [commentBarHeight, setCommentBarHeight] = useState();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    useState(() => {
        setLocationName(selectedLocation.locationName)
        setCategoryName(selectedLocation.categoryName)
        setCategoryId(selectedLocation.categoryId)
        setComment(selectedLocation.comment)
    }, [])

    const updateCommentBarHeight = (val) => {
        const height = val.nativeEvent.contentSize.height
        if (height < 120) {
            setCommentBarHeight(height)
        } else {
            setCommentBarHeight(120)
        }
    }

    const saveLocation = async () => {
        if (locationName !== "") {
            await DbManager.updateLocation({
                locationName: locationName,
                categoryId: categoryId,
                categoryName: categoryName,
                comment: comment,
                id: selectedLocation.id
            })
            await DbManager.getAllLocations()
                .then(allLocations => setDbLocations(allLocations))
            navigation.goBack()
        } else {
            Alert.alert('', 'konum adı boş olamaz', [{ text: 'TAMAM' }]);
        }
    }

    const deleteLocation = async () => {
        // const id = selectedLocation.id
        DbManager.deleteLocation(selectedLocation.id)
        setDeleteModalVisible(false)
        await DbManager.getAllLocations()
            .then(allLocations => setDbLocations(allLocations))
        navigation.goBack()
    }

    const selectCategory = (item) => {
        setCategoryName(item.categoryName)
        setCategoryId(item.id)
        setCategoriesModalVisible(false)
    }

    return (
        <View style={{ flex: 1, backgroundColor: white }}>
            <Header
                leftIconOnPress={() => navigation.goBack()}
                leftIconName={'keyboard-backspace'}
                leftIconType={'material'}
                leftIconColor={white}
                headerTitle={'Bu Konumu Düzenle'}
            />
            <View style={{ flex: 1, padding: 30 }} >
                <Input
                    inputStyle={{ color: textBlack }}
                    inputContainerStyle={{ borderBottomColor: inputUnderline, }}
                    onChangeText={(value) => setLocationName(value)}
                    value={locationName}
                />
                <TouchableOpacity
                    style={styles.selectLocationContainer}
                    onPress={() => setCategoriesModalVisible(true)}
                >
                    <Text style={styles.categoryInputText} >{categoryName}</Text>
                    <Icon
                        style={{ marginLeft: 30 }}
                        name={'chevron-down'}
                        type='entypo'
                        color={theme}
                        size={23}
                    />
                </TouchableOpacity>
                <Input
                    inputStyle={{ color: textBlack, padding: 5, }}
                    inputContainerStyle={[styles.commentInputContainer, { height: commentBarHeight }]}
                    placeholder={'Açıklama Ekleyin'}
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                    editable={true}
                    multiline={true}
                    onContentSizeChange={(res) => updateCommentBarHeight(res)}
                />
                <View style={styles.buttonsContainer}>
                    <Button
                        buttonStyle={styles.saveButtonStyle}
                        onPress={() => saveLocation()}
                        titleStyle={{ color: theme }}
                        title="Kaydet"
                        type="outline"
                        icon={
                            <Icon
                                name='save'
                                type='font-awesome'
                                color={theme}
                                size={20}
                                style={{ marginRight: 10 }}
                            />
                        }
                    />
                    <Button
                        buttonStyle={styles.deleteButtonStyle}
                        onPress={() => setDeleteModalVisible(true)}
                        type="outline"
                        icon={
                            <Icon
                                name='delete'
                                type='ant-design'
                                color={theme}
                                size={20}
                            />
                        }
                    />
                </View>
            </View>
            <DeleteModal
                onCancel={() => setDeleteModalVisible(false)}
                onDelete={() => deleteLocation()}
                deleteModalVisible={deleteModalVisible}
                title={`${categoryName} Silisin mi?`}
            />
            <CategoriesModal
                onTouchOutside={() => setCategoriesModalVisible(false)}
                selectCategory={(item) => selectCategory(item)}
                visible={categoriesModalVisible}
            />
        </View>
    );
};

export default EditLocationScreen;

const styles = StyleSheet.create({
    selectLocationContainer: {
        height: 50,
        alignItems: 'center',
        borderBottomColor: inputUnderline,
        borderBottomWidth: 1,
        paddingHorizontal: 5,
        marginHorizontal: 10,
        marginBottom: 20,
        flexDirection: 'row'
    },
    categoryInputText: {
        fontSize: 19,
        color: textBlack
    },
    commentInputContainer: {
        borderWidth: 1,
        borderColor: inputUnderline,
        borderRadius: 8,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    deleteButtonStyle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: theme
    },
    saveButtonStyle: {
        width: 140,
        height: 40,
        borderRadius: 20,
        borderColor: theme
    },
});
