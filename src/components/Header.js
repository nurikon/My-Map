import React from 'react'
import { Text, View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements';
import colors from '../res/colors';

// props => headerTitle
// props => leftIconOnPress >> leftIconName >> leftIconType >> leftIconColor 
// props => rightIconOnPress >> RightIconName >> rightIconType  >> rightIconColor 

const { width, height } = Dimensions.get('window');
const { theme, white } = colors
const Header = (props) => {

    return (
        <View style={[styles.container, { backgroundColor: theme }]}>
            <TouchableOpacity onPress={props.leftIconOnPress} >
                <Icon
                    name={props.leftIconName}
                    type={props.leftIconType}
                    color={props.leftIconColor}
                    size={width*0.075}
                />
            </TouchableOpacity>
            <View>
                <Text style={{ color: white }}> {props.headerTitle} </Text>
            </View>
            <TouchableOpacity onPress={props.rightIconOnPress}>
                <Icon
                    name={props.rightIconName}
                    type={props.rightIconType}
                    color={props.rightIconColor}
                    size={width*0.075}
                />
            </TouchableOpacity>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    container: {
        height: height * 0.08,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: width*0.05,
        elevation: 10,
    }
});
















// import React from 'react'
// import { Text, View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'
// import MenuIcon from 'react-native-vector-icons/MaterialCommunityIcons'
// import ListIcon from 'react-native-vector-icons/FontAwesome'
// import GoBackIcon from 'react-native-vector-icons/MaterialIcons'
// import { Icon } from 'react-native-elements'; //burada bu iconla düzenleme yapılacak

// // Header component's props >> LeftIconName >> RightIconName >> leftTabOnPress >> headerTitle >> rightTabOnPress

// const { width, height } = Dimensions.get('window');


// const Header = (props) => {

//     const LeftTab = () => {
//         switch (props.LeftIconName) {
//             case 'menu':
//                 return <MenuIcon color={'white'} name={'menu'} size={30} />
//                 break;
//             case 'backIcon':
//                 return <GoBackIcon color={'white'}  name={'keyboard-backspace'} size={30} />
//                 break;
//             default:
//                 return (
//                     <View style={{ width: 30, height: 30 }}>
//                     </View>
//                 )
//                 break;
//         }
//     }

//     const RightTab = () => {
//         switch (props.RightIconName) {
//             case 'list':
//                 return <ListIcon color={'white'}  name={'th-list'} size={20} />
//                 break;
//             default:
//                 return (
//                     <View style={{ width: 30, height: 30 }}>
//                     </View>
//                 )
//                 break;
//         }
//     }

//     return (
//         <View style={[styles.container, {backgroundColor: '#003da6',}]}>
//             <TouchableOpacity onPress={props.leftTabOnPress} >
//                 {LeftTab()}
//             </TouchableOpacity>
//             <View>
//                 <Text style={{color:'white'}}> {props.headerTitle} </Text>
//             </View>
//             <TouchableOpacity onPress={props.rightTabOnPress}>
//                 {RightTab()}
//             </TouchableOpacity>
//         </View>
//     )
// }

// export default Header;

// const styles = StyleSheet.create({
//     container: {
//         height: height * 0.08,
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         flexDirection: 'row',
//         paddingHorizontal: 20,
//     }

// });