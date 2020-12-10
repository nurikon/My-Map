import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {MapScreen, AddPlaceScreen, EditLocationScreen, EditCategoryScreen } from '../screens/index';



const Stack = createStackNavigator();

const AppNavigationContainer = () => {
    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName="MapScreen" >
                <Stack.Screen options={{ headerShown: false }} name="MapScreen" component={MapScreen} />
                <Stack.Screen options={{ headerShown: false }} name="AddPlaceScreen" component={AddPlaceScreen} />
                <Stack.Screen options={{ headerShown: false }} name="EditLocationScreen" component={EditLocationScreen} />
                <Stack.Screen options={{ headerShown: false }} name="EditCategoryScreen" component={EditCategoryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigationContainer;
