import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Modal,
    Switch,
    TouchableOpacity,
    FlatList,
    LayoutAnimation
} from 'react-native';
import { Icon } from 'react-native-elements';
import DbManager from '../database/DbManager';
import colors from '../res/colors';
import { dbCategoriesContext, dbLocationsContext } from '../Store';
import CategoriesModal from './CategoriesModal';

const { textBlack, theme, white } = colors
const { width, height } = Dimensions.get('window')

const SettingsModal = (props) => {

    const [dbCategories, setDbCategories] = useContext(dbCategoriesContext);
    const [dbLocations, setDbLocations] = useContext(dbLocationsContext);
    const [editVisible, setEditVisible] = useState(false);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const { visible, close, locItemOnPress } = props

    const getCategorLength = (categoryName) => {
        let data = dbLocations.filter(item => {
            return item.categoryName.match(categoryName)
        })
        return data.length;
    }

    const toggleSwitch = ({ index }) => {
        let newCategories = [...dbCategories]
        if (dbCategories[index].visible === 'true') {
            newCategories[index].visible = 'false'
        } else {
            newCategories[index].visible = 'true'
        }
        setDbCategories(newCategories)
        DbManager.updateCategoryVisible(newCategories[index])
    }

    const categoryItemOnPress = (category) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        if (selectedCategoryId === category.id) {
            screenEvents(false, false, null, false)
        } else { screenEvents(false, false, category.id, false) }
    }

    const screenEvents = (
        paramEditVisible,
        paramAddCategoryVisible,
        paramSelectedCategoryId,
        paramClose
    ) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setEditVisible(paramEditVisible)
        setAddCategoryVisible(paramAddCategoryVisible)
        setSelectedCategoryId(paramSelectedCategoryId)
        if (paramClose === true) { close() }
    }

    const Header = () => {
        return (
            <View style={styles.headerContainer}>
                <Text style={{ color: white }}>Kategoriler</Text>
                <Icon
                    containerStyle={{ position: 'absolute', right: 3 }}
                    name='close'
                    type='material-icons'
                    color={white}
                    size={width * 0.06}
                    onPress={() => screenEvents(false, false, null, true)}
                />
            </View>
        )
    }

    const CategoryItem = ({ item, index }) => {
        const category = item
        const categorLength= getCategorLength(category.categoryName)
        return (
            <>
                <TouchableOpacity
                    onPress={() => categoryItemOnPress(category)}
                    style={styles.categoryItemContainer}
                >
                    <Text style={styles.categoryItemText}>{category.categoryName}  ({categorLength})</Text>
                    {!editVisible ?
                        <View style={styles.categoryRightItemContainer}>
                            <Switch
                                trackColor={{ false: "#767577", true: "#1F618D" }}
                                thumbColor={dbCategories[index].visible === 'true' ? theme : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch({ index })}
                                value={dbCategories[index].visible === 'true' ? true : false}
                            />
                        </View> :
                        <TouchableOpacity
                            style={styles.categoryRightItemContainer}
                            onPress={() => {
                                screenEvents(false, false, null, true)
                                props.navigation.navigate('EditCategoryScreen', { category: category })
                            }}
                        >
                            <Icon
                                name='edit'
                                type='ant-design'
                                color={theme}
                                size={19}
                            />
                        </TouchableOpacity>

                    }
                </TouchableOpacity>
                <LocationItem category={category} />
            </>
        )
    }

    const LocationItem = ({ category }) => {
        return (
            selectedCategoryId === category.id ?
                dbLocations.map((location, i) => {
                    return (
                        location.categoryId === category.id ?
                            <TouchableOpacity
                                style={styles.locItemContainer}
                                key={i}
                                onPress={() => {
                                    screenEvents(false, false, null, false)
                                    locItemOnPress(location)
                                }}
                            >
                                <Text style={styles.locItemText}>{location.locationName}</Text>
                            </TouchableOpacity>
                            : null
                    )
                })
                : null
        )
    }

    const FooterCompenent = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Icon
                    onPress={() => { screenEvents(!editVisible, false, null, false) }}
                    containerStyle={styles.footerİcons}
                    reverse
                    name={editVisible ? 'close' : 'edit'}
                    type={editVisible ? 'material-İcon' : 'ant-design'}
                    color={theme}
                    size={width * 0.04}
                />
                <Icon
                    onPress={() => { screenEvents(false, true, null, false) }}
                    containerStyle={styles.footerİcons}
                    reverse
                    name={'add'}
                    type='material-İcon'
                    color={theme}
                    size={width * 0.04}
                />
            </View>
        )
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => screenEvents(false, false, null, true)}
        >
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={styles.modalContainer} >
                    <Header />
                    <FlatList
                        keyboardShouldPersistTaps="always"
                        data={dbCategories}
                        renderItem={CategoryItem}
                        keyExtractor={item => item.id.toString()}
                        ListFooterComponent={FooterCompenent}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => screenEvents(false, false, null, true)}
                    style={{ flex: 1 }}
                />
            </View>
            <CategoriesModal
                onTouchOutside={() => screenEvents(false, false, null, false)}
                visible={addCategoryVisible}
                type='draverMenü'
            />
        </Modal>
    );
};

export default SettingsModal;

const styles = StyleSheet.create({
    modalContainer: {
        width: width * 0.6,
        height: '100%',
        backgroundColor: white,
        elevation:10
    },
    headerContainer: {
        width: '100%',
        height: width * 0.12,
        backgroundColor: theme,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryItemContainer: {
        backgroundColor: '#BDC3C7',
        marginHorizontal: width * 0.02,
        paddingLeft: width * 0.02,
        marginVertical: 6,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4
    },
    categoryRightItemContainer: {
        height: width*0.07,
        width: width*0.14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryItemText: {
        color: textBlack,
        width: width * 0.40,
        marginVertical: 4,
        fontWeight: 'bold'
    },
    footerİcons: {
        marginLeft: width * 0.03,
        marginTop: width * 0.04,
        alignSelf: 'flex-start',
        elevation: 5
    },
    locItemContainer: {
        backgroundColor: '#E5E7E9',
        marginLeft: width * 0.05,
        marginRight: width * 0.02,
        paddingHorizontal: width * 0.02,
        paddingVertical: 2,
        marginVertical: 2,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locItemText: {
        marginVertical: 2,
        color: textBlack
    }
});
