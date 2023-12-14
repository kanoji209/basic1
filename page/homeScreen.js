import React, { useState ,useEffect,useRef} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  PermissionsAndroid,
  Text
} from 'react-native';
import WelcomeMsg from '../components/welcom';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const user = auth().currentUser;



const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === 'granted') {

      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};




function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(false);
  const[buttonEnabled,setButton]=useState(true)
  const isWithinAreaRef = useRef(false);
  
  var l = location ? location.coords.latitude : null
  var l2 = location ? location.coords.longitude : null
  const username = user.displayName || user.email; 
  

  
  useEffect(() => {
    if (location) {
      const isWithinArea = l >= 25 && l <= 27 && l2 >= 78 && l2 <= 81;

      // Update the ref value without triggering re-renders
      isWithinAreaRef.current = isWithinArea;

      // You can perform other side effects here if needed
    }
  }, [location, l, l2]);

  useEffect(() => {
    // Update the state only if the ref value changes
    if (isWithinAreaRef.current !== Button) {
      setButton(isWithinAreaRef.current);
    }
  }, [isWithinAreaRef.current]);

  const result = requestLocationPermission();
  result.then(res => {
    if (res) {
      Geolocation.getCurrentPosition(
        position => {
          setLocation(position);
        },
        error => {
          console.log(error.code, error.message);
          setLocation(false);
        },
        { enableHighAccuracy: true, timeout: 1500, maximumAge: 2000 },
      );
    }
  });

  function HandleSubmit(){
    console.log("hello")
    firestore().collection(username).add(
      {
        name: name,
        age: age,
        gender: gender,
        phoneNumber: phone,
        latitude: l,
        longitude: l2,
      }
    ).then(() => {
      Alert.alert('Successful','Mark Present')
    });
  }

  return (
    <View style={styles.container}>
      <WelcomeMsg />
      <Text>{username}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.inputField}
        />
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={text => setAge(text)}
          style={styles.inputField}
        />
        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={text => setGender(text)}
          style={styles.inputField}
        />
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            placeholder="Phone"
            value={phone}
            onChangeText={text => setPhone(text)}
            style={[styles.inputField, { flex: 3 }]}
          />
        </View>
      </View>
      <Button color={'green'} title="Submit" onPress={HandleSubmit} disabled={!buttonEnabled} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    height: 40,
    width: 390,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'green',
  },
  inputContainer: {
    marginTop: 20,
  },
  inputField: {
    height: 40,
    borderColor: 'green',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',

  },
  showHideButton: {
    height: 50,
    marginBottom: 10,
    flex: 1
  },
});

export default HomeScreen