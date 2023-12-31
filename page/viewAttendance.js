import React, {useState,useEffect} from "react";
import { View, ActivityIndicator ,FlatList,Text, StyleSheet, Button} from "react-native";
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
        <><View style={{flexDirection:'row',paddingTop:10,paddingBottom:10,backgroundColor:'#7F47A6' }}>
            <Text style={[styles.headerText,{flex:1,marginLeft:20}]}>Date</Text>
            <Text style={[styles.headerText,{flex:2}]}>Punch In</Text>
            <Text style={[styles.headerText,{flex:2}]}>Punch Out</Text>
            <Text style={[styles.headerText,{flex:2}]}>Work Hours</Text>
            <Text style={[styles.headerText,{flex:1,marginRight:10}]}>Status</Text>
            </View>
            <FlatList
            data={users}
            renderItem={({ item }) => (
                <View style={{ height: 30, flex:1,flexDirection:'row',alignItems: 'center', justifyContent:"space-around", backgroundColor:'#C3A4D9', marginBottom:10,fontSize:15}}>
                    <Text style={{borderWidth:1}}>{item.date}</Text>
                    <Text>{item.checkIn}</Text>
                    <Text>{item.checkOut}</Text>
                    <Text>{item.workHour}</Text>
                    <Text>{item.attendance}</Text>
                </View>
            )} />
            <Button title="Slip"/>
            </>
    )
}


const styles=StyleSheet.create({
  headerText:{
    fontSize:16,
    fontWeight:'bold',
    color:'white'
  }
})
export default Attendace