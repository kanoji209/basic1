import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';



function RegistrationScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleRegistration = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    } else {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          Alert.alert('Success', 'Registration successful', [
            { text: 'OK' },
          ]);
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            Alert.alert('That email address is invalid!');
          }

          console.error(error);
        });
      
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registration</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={[styles.input, { flex: 4, marginRight: 10 }]}
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={secureTextEntry}
        />
        <View style={{ flex: 1, height: 40, }}>
          <Button color={'green'} title={secureTextEntry ? 'Show' : 'Hide'}
            onPress={() => setSecureTextEntry(!secureTextEntry)} />
        </View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={text => setConfirmPassword(text)}
        value={confirmPassword}
        secureTextEntry
      />
      <Button color='green' title='Sign Up' onPress={handleRegistration} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: 390,
  },
});

export default RegistrationScreen;