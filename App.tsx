import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import auth from '@react-native-firebase/auth';
import HomeScreen from './page/homeScreen';
import LoginScreen from './page/loginScreen';
import RegistrationScreen from './page/registerScreen';
import { Button, Image, View } from 'react-native';
import Attendace from './page/viewAttendance';

const Stack=createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();



//logo image function
function logo(){
  return(
    <Image source={require('./assets/logo.png')} style={{width:150, height:15}}/>
  )
}
// Handle user state changes
  function onAuthStateChanged(user){
    setUser(user);
    if(initializing) setInitializing(false);
  }

// logout function  
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
      <Stack.Navigator initialRouteName="Login" 
      // screenOptions={{
      //   headerShadowVisible:true,
      //   headerTintColor:'white',
      //   // headerStyle:{
      //   //   backgroundColor:'green'
      //   // },
      //   headerTitleStyle: {
      //     fontWeight: 'bold',
      //   },
      // }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{
          headerTransparent:true,
          title:''
        }}/>
        <Stack.Screen name='Sign Up' component={RegistrationScreen}/>
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{
      headerShadowVisible:true,
      headerTintColor:'white',
      headerStyle:{
        backgroundColor:'#633087'
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen name="Home" component={HomeScreen} 
      options={{headerTitle:() =>(
        <View style={{width:150, height:50,backgroundColor:'white',}}>
          <Image source={require('./assets/download.jpg')} style={{width:150,height:40, marginTop:7}} />
        </View>
        
      ),
      headerRight: () => (
        <Button
          onPress={logOut}
          title="Log Out"
          color="#633087"
        />
      ),}}/>
      <Stack.Screen name='Attendance' component={Attendace}/>
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


