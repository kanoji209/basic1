import React, { useState } from 'react';
import {
 View,
 StyleSheet,
 TextInput,
 Button,
 Alert,
} from 'react-native';
import WelcomeMsg from '../components/welcom';

function HomeScreen({ navigation }){
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
   
    const HandleSubmit = () => {
     return(
         Alert.alert(
             'Form Details',
             `Name: ${name}\nAge: ${age}\nGender: ${gender}\nPhone: ${phone}`,
             [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
             { cancelable: false }
           ) 
     )
     
   };
   
    return (
       <View style={styles.container}>
         <WelcomeMsg/>
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
           <View style={{flexDirection:'row'}}>
             <TextInput
               placeholder="Phone"
               value={phone}
               onChangeText={text => setPhone(text)}
               style={[styles.inputField,{flex:3}]}
             />
           </View>
         </View>
         <Button color={'green'} title="Submit" onPress={HandleSubmit} />
       </View>
    );
   };

   const styles = StyleSheet.create({
    container: {
     flex:1,
       backgroundColor: '#fff',
       paddingHorizontal: 10,
       paddingTop: 10,
    },
    title: {
       fontSize: 24,
       height:40,
       width:390,
       fontWeight: 'bold',
       textAlign: 'center',
       textAlignVertical:'center',
       backgroundColor:'green',
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
       flex:1
    },
   });

export default HomeScreen