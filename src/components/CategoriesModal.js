import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, LayoutAnimation, Dimensions } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import DbManager from '../database/DbManager';
import colors from '../res/colors';
import { dbCategoriesContext } from '../Store';

const { inputUnderline, textBlack, white } = colors
const { width, height } = Dimensions.get('window')

const CategoriesModal = (props) => {

    const [dbCategories, setDbCategories] = useContext(dbCategoriesContext);
    const [categoryName, setCategoryName] = useState("");
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);


    const addCategory = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (categoryName !== "") {
            await DbManager.addCategory(categoryName)
            await DbManager.getCategories()
                .then((res) => {
                    setDbCategories(res)
                })
            setAddCategoryVisible(false);
            setCategoryName("")
            {props.type === 'draverMenü' ? props.onTouchOutside() :null}
        }
    }

    const selectCategory = (item) => {
        props.selectCategory(item)
        setAddCategoryVisible(false)
        setCategoryName("")
    }

    const onTouchOutside = () => {
        setAddCategoryVisible(false);
        setCategoryName("")
        props.onTouchOutside()
    }

    const addButton = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setAddCategoryVisible(true);
    }

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.visible}
                onRequestClose={() => onTouchOutside()}
            >
                <View style={{ flex: 1 }} >
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => onTouchOutside()} />
                    <View style={{ paddingTop: 10 }}>
                        <View style={styles.container}>
                            {props.type === 'draverMenü' ? null :
                                dbCategories.map((item) => {
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.itemContiner}
                                            onPress={() => selectCategory(item)}
                                        >
                                            <Text style={styles.itemText} > {item.categoryName} </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            {addCategoryVisible || props.type==='draverMenü' ?
                                <View style={styles.addCategoryInput}>
                                    <Input
                                        inputContainerStyle={{ borderBottomColor: inputUnderline }}
                                        containerStyle={{ width: '80%', }}
                                        placeholder='Kategori Adı'
                                        onChangeText={(value) => setCategoryName(value)}
                                        value={categoryName}
                                        onSubmitEditing={()=>addCategory()}
                                    />
                                    <Icon
                                        color={textBlack}
                                        name='add'
                                        type='material-icons'
                                        size={width * 0.08}
                                        onPress={() => addCategory()}
                                    />
                                </View>
                                :
                                <View style={styles.addButtonContainer}>
                                    <TouchableOpacity
                                        style={[styles.itemContiner, { width: '75%' }]}
                                        onPress={() => addButton()}
                                    >
                                        <Icon
                                            size={width * 0.06}
                                            name='add'
                                            type='material-icons'
                                            color={textBlack}
                                        />
                                        <Text style={styles.itemText} >Kategori ekle</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default CategoriesModal;

const styles = StyleSheet.create({
    container: {
        borderTopLeftRadius: width * 0.05,
        borderTopRightRadius: width * 0.05,
        backgroundColor: white,
        flexDirection: 'row',
        flexWrap: 'wrap',
        elevation: 10,
        padding: width * 0.025,
    },
    itemContiner: {
        borderRadius: width * 0.02,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
        padding: 4,
        elevation: 1
    },
    itemText: {
        fontSize: width * 0.036,
        color: textBlack
    },
    addCategoryInput: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    addButtonContainer: {
        width: '100%',
        alignItems: 'center'
    }
});