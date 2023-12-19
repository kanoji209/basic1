import React, {useState,useEffect} from "react";
import { View, ActivityIndicator ,FlatList,Text} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from '@react-native-firebase/auth';

const Attendace=()=>{
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users
  const [username, setUsername] = useState(null);


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
  

// Fetching user attendance
useEffect(()=>{
    const attendanceData=async()=>{
        try{
            if(username){
                const subscriber = firestore()
      .collection(username)
      .onSnapshot(querySnapshot => {
        const users = [];
  
        querySnapshot.forEach(documentSnapshot => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
  
        setUsers(users);
        setLoading(false);
      });
  
    // Unsubscribe from events when no longer in use
    return () => subscriber();
            }
        }
        catch (error) {
            console.log('Error getting document:', error);
          }
    };
    attendanceData();
},[username]
)


  if (loading) {
    return <ActivityIndicator />;
  }

  // ...


    return(
        <><View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
            <Text>Date</Text>
            <Text>Check In</Text>
            <Text>Check Out</Text>
            <Text>Satus</Text>
            </View>
            <FlatList
            data={users}
            renderItem={({ item }) => (
                <View style={{ height: 30, flex:1,flexDirection:'row',alignItems: 'center', justifyContent:"space-around", backgroundColor:'red', marginBottom:5,marginTop:10 }}>
                    <Text>{item.date}</Text>
                    <Text>{item.checkIn}</Text>
                    <Text>{item.checkOut}</Text>
                    <Text>{item.attendance}</Text>
                </View>
            )} /></>
    )
}

export default Attendace