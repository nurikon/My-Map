import React from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import colors from '../res/colors';

const { modalOutside, textBlack, white, red } = colors
const { width, height } = Dimensions.get('window')

const DeleteModal = (props) => {
    return (
        <Modal
            transparent={true}
            visible={props.deleteModalVisible}
            onRequestClose={() => props.onCancel()}
        >
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <Text style={styles.titleText}>{props.title}</Text>
                    <View style={styles.buttonContainer}>
                        <Text onPress={() => props.onCancel()} style={[styles.buttonText, { color: textBlack }]}>İptal</Text>
                        <Text onPress={() => props.onDelete()} style={[styles.buttonText, { color: red }]}>Sil</Text>
                    </View>
                </View>
            </View>
        </Modal>
    )
}


export default DeleteModal;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: modalOutside
    },
    container: {
        padding:10,
        width: '70%',
        borderRadius: 10,
        backgroundColor: white,
        justifyContent: 'space-around'
    },
    titleText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: textBlack,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    buttonText: {
        marginTop:width*0.05,
        textAlign:'center',
        textAlignVertical:'center',
        width:width*0.1,
        height:width*0.1,
        fontWeight: 'bold',
        fontSize: 16
    }
})