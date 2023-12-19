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
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

//  Function for getting location permission
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
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime,setCurrentTime]= useState('');
  const [name, setName] = useState('');
  const [gender,setGender] = useState('');
  const [post, setPost] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState(false);
  const[buttonEnabled,setButton]=useState(true)
  const isWithinAreaRef = useRef(false);
  const [username, setUsername] = useState(null);

  var l = location ? location.coords.latitude : null
  var l2 = location ? location.coords.longitude : null

  
// To fetch current user email login
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userEmail = user.email;
        setUsername(userEmail);
      } else {
        setUsername(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUsername(null);
    }
  };

  fetchUserData();
}, []);

// Fetch user personal details
useEffect(() => {
  const fetchName = async () => {
    try {
      if (username) {
        const userDoc = await firestore().collection(username).doc("Personal Detail").get();


        if (!userDoc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', userDoc.data());
          setName(userDoc.data().Name);
          setGender(userDoc.data().Gender);
          setPost(userDoc.data().Post);
          setDob(userDoc.data().DoB)
        }
      }
    } catch (error) {
      console.log('Error getting document:', error);
    }
  };

  fetchName();
}, [username]);

// Date and time
  useEffect(() => {
    const updateDateTime = () => {
      const date = moment()
        .format(' DD-MM-YYYY');
      const time = moment()
        .utcOffset('+05:30')
        .format(' hh:mm:ss a');
      setCurrentDate(date);
      setCurrentTime(time);
    };

    //Update the date-time every second (adjust the interval as needed)
    const intervalId = setInterval(updateDateTime, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
    
  }, []);

  

// After getting location permission fetching current location of the user
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
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 20000 },
      );
    }
  });


// Checking user is at location or not
  useEffect(() => {
    if (location) {
      const isWithinArea = l >= 25 && l <= 27 && l2 >= 78 && l2 <= 82;
      isWithinAreaRef.current = isWithinArea;      
    }
  }, [location, l, l2]);


// Set button enable or disable
  useEffect(() => {
    if (isWithinAreaRef.current !== Button) {
      setButton(isWithinAreaRef.current);
    }
  }, [isWithinAreaRef.current]);



//Actions of on clicking check in button 
  function HandleCheckIn(){
    console.log("hello")
    firestore().collection(username).doc(currentDate).set(
      {
        date:currentDate,
        checkIn: currentTime,
        attendance: 'Present',
        checkOut:''
      }
    ).then(() => {
      Alert.alert('Successful','Mark Present')
    });
    
  }

//Action of co clicking checkout button
function HandleCheckOut(){
  console.log("hello")
  firestore().collection(username).doc(currentDate).update(
    {
      checkOut: currentTime,
    }
  ).then(() => {
    Alert.alert('Successful','Check Out')
  });
  
}

  return (
    <View style={styles.container}>
      
      <Text style={{fontSize:40, textAlign:'center',color:'black'}}>Welcome to the Insyst Lab {[name]}</Text>
      <Text>{[currentDate,currentTime]}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          editable={false}
          value={name}
          // onChangeText={text => setName(text)}
          style={styles.inputField}
        />
        <TextInput
          placeholder="Age"
          value={post}
          onChangeText={text => setAge(text)}
          style={styles.inputField}
        />
        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={text => setGender(text)}
          style={styles.inputField}
        />
        <View >
          <TextInput
            placeholder="Dob"
            value={dob}
            onChangeText={text => setDob(text)}
            style={styles.inputField}
          />
        </View>
      </View>
      <View style={{flexDirection:'row', justifyContent:"space-evenly",marginBottom:10}}>
      <Button color={'green'} title="Check In" onPress={HandleCheckIn} disabled={!buttonEnabled} />
      <Button color={'green'} title="Check Out" onPress={HandleCheckOut} disabled={!buttonEnabled} />
      </View>
      <Button color={'green'} title="View Attandance" onPress={()=>navigation.navigate('Attendance')}  />
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
    color:'black'
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