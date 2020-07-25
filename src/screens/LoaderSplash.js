import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    ImageBackground,
    TouchableOpacity,
    AsyncStorage, PushNotificationIOS,AppState
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Height, Width, FontSize, isIphoneX, isIphone} from './../constants/dimensions'
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import { withInAppNotification } from 'react-native-in-app-notification';
import { connect } from 'react-redux';
import {setNotifiationPage} from "../Actions/setNotificationPage";
import { bindActionCreators } from 'redux';
import logo from '../../assets/icon_logo.png'


GoogleSignin.configure({
    webClientId: Platform.OS === 'ios' ? '279616741503-2clt91uj3he9f9okjhu1i8vv26ccjjpm.apps.googleusercontent.com' : '279616741503-nml95ck8lpr3bqsofp26pjsv7oq82mhg.apps.googleusercontent.com',
    offlineAccess: true,
});
import firebase, {Notification} from "react-native-firebase";

class LoginSCreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('token').then((value) => {
            if(value) {
                AsyncStorage.getItem('healer').then((value2) => {
                    if (Boolean(value2)) {
                        this.props.navigation.navigate('DrawerScreen',{isRegister:this.state.isMenu})
                        SplashScreen.hide();

                    } else {
                        this.props.navigation.navigate('ProfileScreen', {token: value})
                        SplashScreen.hide();

                    }
                })
            }else{
                AsyncStorage.getItem('isHelpScreen').then((value) => {console.log("dsfdsf",value);
                    if(value == "true"){
                        this.props.navigation.navigate('LoginScreen', {token: value})
                        SplashScreen.hide();
                    }else{
                        this.props.navigation.navigate('SubmitCaseHelpScreen', {token: value})
                        SplashScreen.hide();
                    }
                })
            }
        })
    }

    componentWillUnmount() {
        Platform.OS == "android" && this.notificationListener();
    }

    componentDidMount() {
        Platform.OS == "ios" ? this.iosNotificationListner() :  this.createNotificationListeners();
    }


    createNotificationListeners = () => {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            console.log("App Foreground===",notification)
            const case_token = notification._data.case_token
            this.props.showNotification({
                title: notification._title,
                message: notification._body,
                icon:logo,
                onPress: () => {
                    this.props.setNotifiationPage(true)
                    console.log('NOTIFICATION TOKEN==== ', case_token);
                    AsyncStorage.setItem('casetokenNew', case_token);
                }
            });
        });
    };

    _onNotification = (notification) => {
        const case_token = notification._data.case_token
        this.props.setNotifiationPage(true)
        console.log('NOTIFICATION TOKEN==== ', case_token);
        AsyncStorage.setItem('casetokenNew', case_token);
    }

    iosNotificationListner = () => {
        PushNotificationIOS.addEventListener('notification', this._onNotification);
    }

    render() {
        return (
            <View>
                <ImageBackground style={{height: '100%', width: '100%'}}
                                 source={require('./../../assets/Healing_splash.png')}>
                </ImageBackground>
            </View>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({setNotifiationPage}, dispatch)
    }
}

export default connect( null, mapDispatchToProps )(withInAppNotification(LoginSCreen))


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    box: {
        height: 50,
        backgroundColor: 'transparent',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 4,
        padding: 10,
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
