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
    AsyncStorage,
    KeyboardAvoidingView,
    PushNotificationIOS,
    Dimensions, BackHandler, Alert
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Height, Width, FontSize, isIphoneX, isIphone} from './../constants/dimensions'
import {RotationGestureHandler, ScrollView} from 'react-native-gesture-handler';
import RequestService from './../services/RequestService'
import {Spinner} from './../component/spinner'
import firebase from "react-native-firebase";
import Toast from "react-native-simple-toast";

let backHandlerClickCount = 0;

export default class SignupScreen extends Component {
    onBackButtonPressAndroid = () => {
        const shortToast = message =>
            Toast.show(
                message,
                Toast.SHORT,
                Toast.BOTTOM
            );

        const {
            clickedPosition
        } = this.state;
        backHandlerClickCount += 1;
        if ((clickedPosition !== 1)) {
            if ((backHandlerClickCount < 2)) {
                this.props.navigation.navigate('LoginScreen')
            } else {
                BackHandler.exitApp();
            }
        }

        // timeout for fade and exit
        setTimeout(() => {
            backHandlerClickCount = 0;
        }, 2000);

        if (((clickedPosition === 1) &&
            (this.props.navigation.isFocused()))) {
            Alert.alert(
                'Exit Application',
                'Do you want to quit application?', [{
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                }, {
                    text: 'OK',
                    onPress: () => BackHandler.exitApp()
                }], {
                    cancelable: false
                }
            );
        } else {
            // this.props.navigation.dispatch(StackActions.pop({
            //   n: 1
            // }));
        }
        return true;


    }
    componentDidMount() {
        SplashScreen.hide()
        if(Platform.OS === 'ios'){
            PushNotificationIOS.addEventListener('register', token => {
                console.log(token);
                this.setState({device_id: token});
            })
            PushNotificationIOS.requestPermissions();
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            new_password: '',
            loading: false
        }

        this._didFocusSubscription = props.navigation.addListener('willFocus', payload => {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.onBackButtonPressAndroid(payload))
        });
    }

    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    singUp = () => {

        if (this.state.email === '') {
            alert('Please enter email')
        } else {
            if (!this.validateEmail(this.state.email)) {
                alert('Please enter valid email')
            } else {
                if (this.state.password === '') {
                    alert('Please enter password')
                } else {
                    if (this.state.password.length < 6) {
                        alert('Password should be at least 6 characters long')
                    } else {
                        if (this.state.new_password === '') {
                            alert('Please enter confirm password')
                        } else if (this.state.password !== this.state.new_password) {
                            alert('Confirm password should match')
                        } else {
                            let fcmToken = '';
                            firebase.messaging().getToken().then((token) => {
                                fcmToken = token;
                                AsyncStorage.setItem('fcmtoken',Platform.OS == "ios" ? this.state.device_id : fcmToken)
                                this.setState({loading: true})
                                let obj = {
                                    url: 'create_customer',
                                    body: {
                                        email: this.state.email,
                                        password: this.state.password,
                                        new_password: this.state.new_password,
                                        device_token: Platform.OS == "ios" ? this.state.device_id : fcmToken,
                                        device_type: Platform.OS == "ios" ? "ios" : "Android"
                                    }
                                }
                                new RequestService(obj).callCreate()
                                    .then(res => {
                                        if (res.message == 'Success') {
                                            AsyncStorage.setItem('token', res.token)
                                            this.setState({loading: false})
                                            this.props.navigation.navigate('HelpCaselistScreen', {token: res.token})
                                        } else {
                                            this.setState({loading: false})
                                            setTimeout(() => {
                                                alert(res.message)
                                            }, 500)
                                        }
                                    })
                                    .catch(err => {
                                        this.setState({loading: false})
                                        setTimeout(() => {
                                            alert(res.message)
                                        }, 500)
                                    })
                                console.log('fcm token', token);
                            }).catch((error) => {
                                this.setState({loading:false})
                                alert('Please check your internet connection.')
                                console.log('fcm erro', error);
                            })
                        }
                    }
                }
            }
        }

    }

    render() {
        return (
            <KeyboardAvoidingView>
                {this.state.loading ? <Spinner/> : null}
                <ScrollView contentContainerStyle={{minHeight: Dimensions.get('window').height}}>
                    <ImageBackground style={{height: '100%', width: '100%'}}
                                     source={require('./../../assets/Healing_Background.jpg')}>
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
                            <View style={{height: Height(1)}}></View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{
                                    flex: 1,
                                    justifyContent: 'flex-start',
                                    color: 'black',
                                    fontSize: FontSize(16)
                                }}>Sign Up</Text>
                            </View>
                            <View style={{height: Height(2)}}></View>
                            <View style={{height: Height(8), justifyContent: 'center',borderWidth:1, borderColor:'#E9465F'}}>
                                <TextInput
                                    style={{marginLeft: '3%', color: 'black',backgroundColor:'rgba(0,0,0,0)' }}
                                    underlineColorAndroid="transparent"
                                    placeholder='Enter Email'
                                    placeholderTextColor="black"
                                    onChangeText={(email) => this.setState({email})}
                                />
                            </View>
                            <View style={{height: Height(2)}}></View>
                            <View style={{height: Height(8), justifyContent: 'center',borderWidth:1, borderColor:'#E9465F'}}>
                                <TextInput
                                    secureTextEntry={true}
                                    style={{marginLeft: '3%', color: 'black',backgroundColor:'rgba(0,0,0,0)'}}
                                    underlineColorAndroid="transparent"
                                    placeholder='Enter Password'
                                    placeholderTextColor="black"
                                    onChangeText={(password) => this.setState({password})}
                                    secureTextEntry/>
                            </View>
                            <View style={{height: Height(2)}}></View>
                            <View style={{height: Height(8), justifyContent: 'center',borderWidth:1, borderColor:'#E9465F'}}>
                                <TextInput
                                    secureTextEntry={true}
                                    style={{marginLeft: '3%', color: 'black',backgroundColor:'rgba(0,0,0,0)'}}
                                    underlineColorAndroid="transparent"
                                    placeholder='Confirm Password'
                                    placeholderTextColor="black"
                                    onChangeText={(new_password) => this.setState({new_password})}
                                    secureTextEntry/>
                            </View>
                            <View style={{height: Height(2)}}></View>

                            <TouchableOpacity onPress={() => this.singUp()}><ImageBackground
                                style={{height: Height(8), justifyContent: 'center', alignItems: 'center'}}
                                source={require('./../../assets/Submit_Button_Box.png')}>
                                <Text style={{fontSize: FontSize(20), color: '#fff'}}>Sign Up</Text>
                            </ImageBackground></TouchableOpacity>

                            <View style={{height: Height(2)}}></View>
                            <View style={{height: Height(0.2), backgroundColor: '#BE0055'}}></View>
                            <Text style={{textAlign: 'center', fontSize: FontSize(15), color: 'black'}}>Already have a
                                Healingg account?</Text>
                            <View style={{height: Height(1)}}></View>

                            <Text onPress={() => this.props.navigation.navigate('LoginScreen')}
                                  style={{textAlign: 'center', fontSize: FontSize(15), color: '#E9465F'}}>Sign In</Text>

                        </View>
                    </ImageBackground>


                </ScrollView>
            </KeyboardAvoidingView>
        );
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
