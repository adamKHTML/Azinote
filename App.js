import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from './Dashboard';
import Note from './Note';
import FormScreen from './FormScreen';
import Header from './Header';
import EditMode from './EditMode';
import ScreenOne from './Waves';


export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard" screenOptions={{
        headerShown: false
      }}
      >
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Note" component={Note} />
        <Stack.Screen name="FormScreen" component={FormScreen} />
        <Stack.Screen name="Header" component={Header} />
        <Stack.Screen name="EditMode" component={EditMode} />
        <Stack.Screen name="ScreenOne" component={ScreenOne} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}