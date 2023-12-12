import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import auth from '@react-native-firebase/auth';
import HomeScreen from './page/homeScreen';
import LoginScreen from './page/loginScreen';
import RegistrationScreen from './page/registerScreen';
import { Button } from 'react-native';

const Stack=createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user){
    setUser(user);
    if(initializing) setInitializing(false);
  }

  function logOut(){
    auth().signOut()
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{
        headerShadowVisible:true,
        headerTintColor:'white',
        headerStyle:{
          backgroundColor:'green'
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name='Sign Up' component={RegistrationScreen}/>
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{
      headerShadowVisible:true,
      headerTintColor:'white',
      headerStyle:{
        backgroundColor:'green'
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen name="Home" component={HomeScreen} 
      options={{title: 'My home',
      headerRight: () => (
        <Button
          onPress={logOut}
          title="Log Out"
          color="green"
        />
      ),}}/>
    </Stack.Navigator>
  );
};

export default () =>{
  return (
    <NavigationContainer>
      <App/>
    </NavigationContainer>
  )
}


