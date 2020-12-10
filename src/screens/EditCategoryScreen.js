import React, { useEffect, useState, useContext } from 'react';
import { View, Dimensions, StyleSheet, Alert } from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';
import { dbLocationsContext, dbCategoriesContext } from '../Store';
import DbManager from '../database/DbManager';
import DeleteModal from '../components/DeleteModal';
import colors from '../res/colors';
import Header from '../components/Header';

const { textBlack, white, theme, inputUnderline } = colors
const { width, height } = Dimensions.get('window')

const EditCategoryScreen = ({ route, navigation }) => {

    const [dbLocations, setDbLocations] = useContext(dbLocationsContext);
    const [dbCategories, setDbCategories] = useContext(dbCategoriesContext);
    const [category, setCategory] = useState({});
    const [categoryName, setCategoryName] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    useEffect(() => {
        setCategoryName(route.params.category.categoryName)
        setCategory(route.params.category)
    }, []);

    const deleteCategory = async () => {
        await DbManager.deleteCategory(category)
        await DbManager.getAllLocations()
            .then(res => setDbLocations(res))
        await DbManager.getCategories()
            .then(res => setDbCategories(res))
        setDeleteModalVisible(false)
        navigation.goBack()
    }

    const saveCategory = async () => {
        if (categoryName !== "") {
            await DbManager.updateCategory({
                categoryName: categoryName,
                id: category.id,
                visible: category.visible
            })
            await DbManager.getAllLocations()
                .then(res => setDbLocations(res))
            await DbManager.getCategories()
                .then(res => setDbCategories(res))
            navigation.goBack()
        } else {
            Alert.alert('', 'Kategori adı boş olamaz', [{ text: 'TAMAM' }]);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Header
                leftIconOnPress={() => navigation.goBack()}
                leftIconName={'keyboard-backspace'}
                leftIconType={'material'}
                leftIconColor={white}
                headerTitle={'kategoriyi Düzenle'}
            />
            <View style={{ flex: 1, padding: width * 0.09 }} >
                <Input
                    placeholder='kategori Adı'
                    inputStyle={{ color: textBlack }}
                    inputContainerStyle={{ borderBottomColor: inputUnderline }}
                    onChangeText={(value) => setCategoryName(value)}
                    value={categoryName}
                />
                <View style={styles.buttonsContainer}>
                    <Button
                        buttonStyle={styles.saveButtonStyle}
                        onPress={() => saveCategory()}
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
                deleteModalVisible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                onDelete={() => deleteCategory()}
                title={`DİKKAT Bu kategori ile birlikte altındaki konumlar da silinecektir. ${"\n" + "\n"} ${route.params.category.categoryName} silinsin mi?`}
            />
        </View>
    )
}


export default EditCategoryScreen;

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    deleteButtonStyle: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width * 0.05,
        borderColor: theme
    },
    saveButtonStyle: {
        width: 140,
        height: width * 0.1,
        borderRadius: width * 0.05,
        borderColor: theme
    },
})
