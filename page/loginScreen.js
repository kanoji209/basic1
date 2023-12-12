import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    Button,
} from 'react-native';
import auth from "@react-native-firebase/auth";


function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const handleLogin = () => {
        if(!email | !password){
            Alert.alert("Alert!", "Enter E-mail and password")
        }
        else{
            auth()
        .signInWithEmailAndPassword(email,password)
        Alert.alert('Success', 'Login successful', [
            { text: 'OK',  },
        ]);
        }
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={text => setEmail(text)}
                value={email}
            />
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    style={[styles.input,{flex:4,marginRight:10} ]}
                    placeholder="Password"
                    onChangeText={text => setPassword(text)}
                    value={password}
                    secureTextEntry={secureTextEntry}
                />
                <View style={{flex:1,height:40,}}>
                <Button color={'green'}title={secureTextEntry ? 'Show' : 'Hide'}
                    onPress={() => setSecureTextEntry(!secureTextEntry)} />
                </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <View style={{ paddingRight: 10 }}>
                    <Button color={'green'} title={'Log In'} onPress={handleLogin} />
                </View>

                <Button color={'green'} title={'Sign Up'} onPress={() => navigation.navigate('Sign Up')} />
            </View>

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

export default LoginScreen;