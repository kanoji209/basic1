import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, Button, Alert, PermissionsAndroid, Text, ScrollView } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {formatDuration, differenceInSeconds, intervalToDuration, format} from 'date-fns'


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




const HomeScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [post, setPost] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState(false);
  const [buttonText, setButtonText] = useState('Punch In');
  const [username, setUsername] = useState(null);
  const isWithinAreaRef = useRef(false);
  const[buttonEnabled,setButton]=useState(true)
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);

  var l = location ? location.coords.latitude : null;
  var l2 = location ? location.coords.longitude : null;

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
          const userDoc = await firestore().collection(username).doc('Personal Detail').get();

          if (!userDoc.exists) {
            console.log('No such document!');
          } else {
            console.log('Document data:', userDoc.data());
            setName(userDoc.data().Name);
            setGender(userDoc.data().Gender);
            setPost(userDoc.data().Post);
            setDob(userDoc.data().DoB);
          }
        }
      } catch (error) {
        console.log('Error getting document:', error);
      }
    };

    fetchName();
  }, [username]);

  // Date and time
  const currentDate=format(new Date(), 'dd-MM-u');
  const currentTime=format(new Date(), 'hh:mm bbb');
  
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



  // Action of clicking the button
  const handleButtonClick = () => {
    if (buttonText === 'Punch In') {
      handleCheckIn();
    } else {
      handleCheckOut();
    }
  };

  // Actions of on clicking check in button
  const handleCheckIn = () => {
    
    setPunchInTime(new Date());
    console.log('Punch In',{punchOutTime});
    firestore()
      .collection(username)
      .doc(currentDate)
      .set({
        date: currentDate,
        checkIn: currentTime,
        attendance: 'Present',
        workHour:'',
        checkOut: '',
      })
      .then(() => {
        Alert.alert('Successful', 'Mark Present:  ');
      });
      setButtonText('Punch Out')
  };

  // Action of on clicking checkout button
  const handleCheckOut = () => {
    setPunchOutTime(new Date());

    
      // .then(() => {
      //   Alert.alert('Successful', 'Punch Out');
      // });
      setButtonText('Punch In')
  };


// Calculate the time difference between punch in and punch out  
  useEffect(()=>{
          if (punchInTime && punchOutTime) {
            const d=intervalToDuration({start:punchInTime,end:punchOutTime})
            const formatted = formatDuration(d, { format: ["hours", "minutes"] });

            firestore()
      .collection(username)
      .doc(currentDate)
      .update({
        checkOut: currentTime,
        workHour:formatted,
      })
          
            Alert.alert('Total Work Time', `Total Time between Punch In and Punch Out: ${formatted} `);
          } 
          // else {
          //   // Handle the case when punch in time is not recorded
          //   Alert.alert('Error', 'Punch In time not recorded');
          // }
  }, [punchOutTime] );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={{ fontSize: 40, textAlign: 'center', color: 'black' }}>
        Welcome to the Insyst Lab {[name]}
      </Text>
      <Text>{currentDate}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          editable={false}
          value={name}
          style={styles.inputField}
        />
        <TextInput
          placeholder="Age"
          value={post}
          onChangeText={text => setPost(text)}
          style={styles.inputField}
        />
        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={text => setGender(text)}
          style={styles.inputField}
        />
        <View>
          <TextInput
            placeholder="Dob"
            value={dob}
            onChangeText={text => setDob(text)}
            style={styles.inputField}
          />
        </View>
      </View>
      <View style={{marginBottom:10}}>
        <Button
        color={'#633087'}
        title={buttonText}
        onPress={handleButtonClick}
        disabled={!buttonEnabled}
      />
      </View>
      
      <Button
        color={'#633087'}
        title="View Attendance"
        onPress={() => navigation.navigate('Attendance')}
      />
      </ScrollView>
      
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
    backgroundColor: '#633087',
  },
  inputContainer: {
    marginTop: 20,
  },
  inputField: {
    height: 40,
    borderColor: '#633087',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    color: 'black',
  },
 
});

export default HomeScreen;
