import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    ImageBackground,
    Image,
    TextInput,
    Text,
    Alert, KeyboardAvoidingView, Dimensions
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Height, Width, FontSize, isIphoneX, isIphone} from './../constants/dimensions'
import {RotationGestureHandler, ScrollView} from 'react-native-gesture-handler';
import SimpleToast from "react-native-simple-toast";
import NavigatorService from "../services/navigator";
import Ionicons from "react-native-vector-icons/Ionicons";


export default class OTPScreen extends Component {
    componentDidMount() {
        SplashScreen.hide()
    }

    resetPassword = () => {
        if(this.state.pin && this.state.newpassword && this.state.confirmPassword) {
            if (this.state.newpassword === this.state.confirmPassword) {

                let formdata = new FormData();
                formdata.append("email", this.props.navigation.state.params.email);
                formdata.append("pin", this.state.pin);
                formdata.append("new-password", this.state.newpassword);
                formdata.append("new-password-confirm", this.state.confirmPassword);

                fetch('https://cms.healingg.com/api/password_reset/reset', {
                    method: 'post',
                    body: formdata,
                    headers: {
                        //'Content-Type': 'application/x-www-form-urlencoded',
                        // 'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => response.json())
                    .then((responseData) => {
                        console.log('password_reset res', responseData);
                        if (responseData.message === 'Success') {
                            Alert.alert(
                                'Healing',
                                'Your password is changed successfully', [{
                                    text: 'Ok',
                                    onPress: () => console.log('Ok Pressed'),
                                    style: 'cancel'
                                }], {
                                    cancelable: true
                                })
                            NavigatorService.navigate('SignInScreen')
                        } else {
                            Alert.alert(
                                'Healing',
                                responseData.message, [{
                                    text: 'Ok',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel'
                                }], {
                                    cancelable: false
                                })

                        }

                    }).catch(err => {
                    console.log('password_reset err', err);
                    SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                })
            } else {
                Alert.alert(
                    'Healing',
                    'Your password and confirm password does not match.\nplease check your password', [{
                        text: 'Ok',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                    }], {
                        cancelable: false
                    })
            }
        } else{
            Alert.alert(
                'Healing',
                'Please fill all fields', [{
                    text: 'Ok',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                }], {
                    cancelable: false
                })
        }
    }

    render() {
        return (
            <KeyboardAvoidingView>
            <View>
                <ScrollView contentContainerStyle={{minHeight:Dimensions.get('window').height}}>

                <ImageBackground style={{height: '100%', width: '100%'}}
                                 source={require('./../../assets/Healing_Background.jpg')}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{flexDirection:'row',height:40,alignItems:'center',marginTop:Height(2)}}>
                        <View
                            style={{height:30,width:30,paddingLeft:15}}>
                            <Ionicons size={30} name="ios-arrow-round-back" color="black"/>
                        </View>
                        <Text style={{alignItems:'center',color:'black',justifyContent:'center',fontSize:15,paddingLeft:15}}>Back</Text>

                    </TouchableOpacity>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: Height(5),
                        height: Height(25)
                    }}>
                        <Image style={{height: Height(25), width: Height(25)}} resizeMode='contain'
                               source={require('./../../assets/Healingg_whitelogo.png')}/>
                    </View>
                    <View style={{marginLeft: '8%', marginRight: '8%'}}>
                        <View style={{height: Height(2)}}></View>
                        <View style={{
                            height: Height(8),
                            justifyContent: 'center',borderWidth:1, borderColor:'#E9465F'
                        }} >
                            <TextInput
                                style={{marginLeft: '3%', color: 'black',backgroundColor:'rgba(0,0,0,0)'}} underlineColorAndroid="transparent"
                                placeholder='Enter your PIN' placeholderTextColor="black"
                                onChangeText={(pin) => this.setState({pin})}/>
                        </View>
                        <View style={{height: Height(2)}}></View>
                       <View style={{
                            height: Height(8),
                            justifyContent: 'center',borderWidth:1, borderColor:'#E9465F'
                        }} >
                            <TextInput
                                secureTextEntry={true}
                                style={{marginLeft: '3%', color: 'black',backgroundColor:'rgba(0,0,0,0)'}} underlineColorAndroid="transparent"
                                placeholder='Enter your New Password' placeholderTextColor="black"
                                onChangeText={(newpassword) => this.setState({newpassword})}/>
                        </View>
                        <View style={{height: Height(2)}}></View>
                       <View style={{
                            height: Height(8),
                            justifyContent: 'center',borderWidth:1, borderColor:'#E9465F'
                        }} >
                            <TextInput
                                secureTextEntry={true}
                                style={{marginLeft: '3%', color: 'black',backgroundColor:'rgba(0,0,0,0)'}} underlineColorAndroid="transparent"
                                placeholder='Enter your Confirm Password' placeholderTextColor="black"
                                onChangeText={(confirmPassword) => this.setState({confirmPassword})}/>
                        </View>
                        <View style={{height: Height(2)}}></View>
                        <TouchableOpacity onPress={() => {
                            this.resetPassword()
                        }}>
                            <ImageBackground
                                style={{height: Height(8), justifyContent: 'center', alignItems: 'center'}}
                                source={require('./../../assets/Submit_Button_Box.png')}>
                                <Text
                                    style={{fontSize: FontSize(20), color: '#fff'}}>
                                    Reset Password
                                </Text>
                            </ImageBackground>
                        </TouchableOpacity>

                    </View>
                </ImageBackground>
                </ScrollView>

            </View>
            </KeyboardAvoidingView>
        )
            ;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
