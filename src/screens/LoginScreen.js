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
    AsyncStorage, BackHandler, Alert,PushNotificationIOS
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Height, Width, FontSize, isIphoneX, isIphone} from './../constants/dimensions'
import {
    AccessToken, LoginManager, GraphRequest,
    GraphRequestManager
} from 'react-native-fbsdk';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import google from './../../assets/google.png'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DrawerNavigator from '../../App'
import Toast from 'react-native-simple-toast';
import {SafeAreaView} from 'react-navigation'

GoogleSignin.configure({
    webClientId: Platform.OS === 'ios' ? '279616741503-2clt91uj3he9f9okjhu1i8vv26ccjjpm.apps.googleusercontent.com' : '279616741503-nml95ck8lpr3bqsofp26pjsv7oq82mhg.apps.googleusercontent.com',
    offlineAccess: true,
});
import RequestService from './../services/RequestService'
import NavigatorService from './../services/navigator';
import {Spinner} from './../component/spinner'
import SimpleToast from 'react-native-simple-toast';
import firebase from "react-native-firebase";
import navigator from "../services/navigator";

let backHandlerClickCount = 0;

export default class LoginSCreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
        this._didFocusSubscription = props.navigation.addListener('willFocus', payload => {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.onBackButtonPressAndroid(payload))
        });
    }

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
                shortToast('Press again to quit the application!');
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


    componentWillMount() {
        // AsyncStorage.getItem('token').then((value) => {
        //     if(value){
        //         AsyncStorage.getItem('healer').then((value2) => {
        //             //alert(value2)
        //             if(Boolean(value2)) {
        //                 this.props.navigation.navigate('DrawerScreen')
        //                 SplashScreen.hide();
        //
        //             } else {
        //                 this.props.navigation.navigate('HealerAnsScreen',{token:value})
        //                 SplashScreen.hide();
        //
        //             }
        //         })
        //     }else{
        //         SplashScreen.hide();
        //
        //         this.props.navigation.navigate('LoginScreen')
        //
        //     }
        // })
        // AsyncStorage.getItem('token').then((value) => {
        //     if(value){
        //         AsyncStorage.getItem('healer').then((value2) => {
        //             if(value2) {
        //                 alert('called')
        //                 this.props.navigation.navigate('Home')
        //             } else {
        //
        //                 this.props.navigation.push('HealerAnsScreen',{token:value})
        //             }
        //         })
        //
        //     }else{
        //         this.props.navigation.navigate('')
        //     }
        // })
        if(Platform.OS === 'ios'){
            PushNotificationIOS.addEventListener('register', token => {
                console.log(token);
                this.setState({device_id: token});
            })
            PushNotificationIOS.requestPermissions();
        }
    }

    _gotoSignIN = () => {
        this.props.navigation.navigate('SignInScreen')
    }
    _gotoSignUp = () => {
        //alert('under development')
        this.props.navigation.navigate('SignupScreen')
    }
    loginWithFacebook = (props: any) => {
        LoginManager.logInWithPermissions(["public_profile","email"]).then((result: any) => {
            console.log('result facebook', result)
            if (result.isCancelled) {
                throw null;
            }
            this.FBGraphRequest('id, email, picture.type(large),name', this.FBLoginCallback);
        }).catch((error: any) => {
            console.log(error)
        })
    }

    async FBGraphRequest(fields, callback) {
        const accessData = await AccessToken.getCurrentAccessToken();
        // Create a graph request asking for user information
        const infoRequest = new GraphRequest('/me', {
            accessToken: accessData.accessToken,
            parameters: {
                fields: {
                    string: fields
                }
            }
        }, callback.bind(this));
        // Execute the graph request created above
        new GraphRequestManager().addRequest(infoRequest).start();
    }

    async FBLoginCallback(error, result) {
        if (error) {
            console.log('callbak', error)
        } else {
            // Retrieve and save user details in state. In our case with
            // Redux and custom action saveUser
            this.setState({loading: true})
            let fcmToken= '' ;
            console.log('Facebook result===',result)
            firebase.messaging().getToken().then((token) => {
                fcmToken=token;
                AsyncStorage.setItem('fcmtoken', Platform.OS == "ios" ? this.state.device_id : fcmToken)
                let obj = {
                    url: 'facebook_login_api',
                    body: {
                        email: result.email,
                        name: result.name,
                        photo: result.picture.data.url,
                        facebook_token: result.id,
                        status: 'active',
                        "device_token":Platform.OS == "ios" ? this.state.device_id : fcmToken,
                        device_type:Platform.OS == "ios" ? "ios" : "Android"
                    }
                }
                new RequestService(obj).callCreate().then(res => {
                    console.log('api res', res)

                    if (res.message == 'Success') {
                        AsyncStorage.setItem('token', res.token)
                        let params1 = {url: 'viewcustomerprofile', body: {user_token: res.token}}
                        new RequestService(params1).callCreate().then(profile => {
                            console.log("Facebbok profile", profile)
                            this.setState({loading: false})
                            let paramsNew = {url: 'imageUpload', body: {user_token: res.token, email:profile.email, url:profile.photo}}
                            new RequestService(paramsNew).callCreate().then((abc => {
                                console.log("Profile facebook image res", abc)
                            })).catch(err => {
                                console.log(err)
                            })
                            if(res.profile_pending){
                                if(res.profile_pending == "Yes"){
                                    AsyncStorage.setItem('healer', 'true')
                                    console.log('profile.usertype',this.props.navigation)
                                    navigator.navigate('ProfileScreen',{healer:'NON-HEALER',token:res.token || ''})
                                }
                            }else if(Boolean(profile.usertype)){
                                console.log('profile.usertype',profile.usertype)
                                AsyncStorage.setItem('healer', 'true')
                                this.props.navigation.push('DrawerScreen',{navigation:this.props.navigation})
                            } else{
                                if(res.new_user == 1){
                                    this.props.navigation.navigate('HelpCaselistScreen', {token: res.token})
                                }else{
                                    this.props.navigation.push('ProfileScreen',{token:res.token})
                                }
                            }
                        }).catch(err => {
                            this.setState({loading: false})
                            alert(JSON.stringify(err))
                        })
                    } else {
                        this.setState({loading: false})
                        setTimeout(() => {
                            SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                        }, 500)
                    }
                }).catch(err => {
                    console.log('api error', err)

                    this.setState({loading: false})
                    setTimeout(() => {
                        SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                    }, 500)
                })
            }).catch((error) => {
                this.setState({loading:false})
                alert('Please check your internet connection.')
                console.log('fcm erro', error);
            })
        }

    };


    loginWithGoogle = () => {
        let current = this;
        GoogleSignin.hasPlayServices().then(() => {
            GoogleSignin.signIn()
                .then((user) => {
                    console.log('user', user)
                    current.setState({loading: true})
                    let fcmToken= '' ;
                    debugger;
                    firebase.messaging().getToken().then((token) => {
                        fcmToken=token;

                        AsyncStorage.setItem('fcmtoken',Platform.OS == "ios" ? this.state.device_id : fcmToken)
                        console.log('fcm token', token);
                        debugger;
                        let obj = {
                            url: 'google_login_api',
                            body: {
                                email: user.user.email,
                                name: user.user.name,
                                photo: user.user.photo,
                                google_token: user.user.id,
                                status: 'active',
                                "device_token":Platform.OS == "ios" ? this.state.device_id : fcmToken,
                                device_type:Platform.OS == "ios" ? "ios" : "Android"
                            }
                        }
                        debugger;
                        new RequestService(obj).callCreate().then(res => {
                            console.log('google login api res',res)
                            if (res.message == 'Success') {
                                AsyncStorage.setItem('token', res.token)
                                let params1 = {url: 'viewcustomerprofile', body: {user_token: res.token}}
                                new RequestService(params1).callCreate().then(profile => {
                                    console.log(profile)
                                    this.setState({loading: false})
                                    if(res.profile_pending){
                                        if(res.profile_pending == "Yes"){
                                            AsyncStorage.setItem('healer', 'true')
                                            console.log('profile.usertype',this.props.navigation)
                                            navigator.navigate('ProfileScreen',{healer:'NON-HEALER',token:res.token || ''})
                                        }
                                    }else if(Boolean(profile.usertype)){
                                        AsyncStorage.setItem('healer', 'true')
                                        console.log('profile.usertype',this.props.navigation)
                                        this.props.navigation.push('DrawerScreen',{navigation:this.props.navigation})
                                    }
                                    else{
                                        if(res.new_user == 1){
                                            this.props.navigation.navigate('HelpCaselistScreen', {token: res.token})
                                        }else{
                                            this.props.navigation.push('ProfileScreen',{token:res.token})
                                        }
                                    }
                                }).catch(err => {
                                    this.setState({loading: false})
                                    alert(JSON.stringify(err))
                                })
                            } else {
                                current.setState({loading: false})
                                setTimeout(() => {
                                    SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                                }, 500)
                            }
                        }).catch(err => {
                            console.log('err', err)
                            current.setState({loading: false})
                            setTimeout(() => {
                                SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                            }, 500)
                        })
                    }).catch((error) => {
                        this.setState({loading:false})
                        alert(error)
                        console.log('fcm erro', error);
                    })                    // console.log(user);{}

                    //  axios.post(config.loginWithSocialMedia,{'name':user.user.name,'email':user.user.email})
                    //  .then(function(response){
                    //  try{
                    //      AsyncStorage.setItem('id',response.data[0]._id);
                    //      current.props.handleChange(2)

                    //  } catch(error){
                    //      console.log('error in setting id is: ',err);
                    //  }
                    //  })
                })
                .catch((err) => {
                    //alert(err.code)
                    console.log('WRONG SIGNIN', err);
                })
                .done();
        }).catch((err) => {
            console.log(err)
        })
    }

    async setupGoogleSignin() {
        try {
            await GoogleSignin.hasPlayServices({autoResolve: true});
            await GoogleSignin.configure(
                //   {

                // iosClientId: settings.iOSClientId,
                // webClientId: "387806309906-sgptqkf8ti6sgrs1j1h2vpubks43kam7.apps.googleusercontent.com",
                // offlineAccess: false,

                //   }
            );

            const user = await GoogleSignin.currentUserAsync();
            console.log(user);
        } catch (err) {
            console.log("Google signin error", err.code, err.message);
        }
    }

    render() {
        return (
            <View>
                {this.state.loading ? <Spinner/> : null}
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
                    <View style={{marginLeft: '5%', marginRight: '5%'}}>
                        <View style={{height: Height(6)}}></View>
                        <View style={{
                            width: '100%',
                            height: Height(8),
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: '#173A73',
                            flexDirection: 'row'
                        }}>
                            <TouchableOpacity style={{
                                height: '100%',
                                width: '15%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#122E5C'
                            }}>
                                <FontAwesome name="facebook" color="#FFF" size={25}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.loginWithFacebook}
                                              style={{height: '100%', width: '85%', justifyContent: 'center'}}>
                                <Text style={{fontSize: FontSize(20), color: '#fff', paddingLeft: Width(4)}}>Sign In
                                    With Facebook</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: Height(3)}}></View>
                        <View style={{
                            width: '100%',
                            height: Height(8),
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#3268C7',
                            flexDirection: 'row'
                        }}>
                            <TouchableOpacity style={{
                                height: '100%',
                                width: '15%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#275098'
                            }}>
                                <Image style={{height: Height(4)}} resizeMode='contain' source={google}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.loginWithGoogle}
                                              style={{height: '100%', width: '85%', justifyContent: 'center'}}>
                                <Text style={{fontSize: FontSize(20), color: '#fff', paddingLeft: Width(4)}}>Sign In
                                    With Google</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height: Height(3)}}></View>

                        {/* <View style={{flexDirection:'row'}}>
                     <TouchableOpacity style={{flex:1}} onPress={this._gotoSignUp}>
                     <ImageBackground style={{height:55,justifyContent:'center',alignItems:'center'}}  source={require('./../../assets/Sign_In_Box.png')}>
                        <Text style={{fontSize:FontSize(20),marginLeft:Width(4),color:'#fff'}}>Sign Up</Text><Text style={{marginLeft:Width(4),color:'#fff'}}>with Email</Text>
                     </ImageBackground>
                     </TouchableOpacity>

                     <View style={{width:Height(3)}}></View>

                     <TouchableOpacity style={{flex:1}} onPress={this._gotoSignIN}>
                     <ImageBackground style={{height:55,justifyContent:'center',alignItems:'center'}}  source={require('./../../assets/Sign_In_Box.png')}>
                        <Text style={{fontSize:FontSize(20),marginLeft:20,color:'#fff'}}>Sign In</Text><Text style={{marginLeft:20,color:'#fff'}}>with Email</Text>
                     </ImageBackground>
                     </TouchableOpacity>
                     </View> */}
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={{flex: 1, height: Height(8), flexDirection: 'row'}}
                                              onPress={this._gotoSignUp}>

                                <View style={{
                                    height: '100%',
                                    width: '32%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#c83b6a'
                                }}>
                                    <MaterialCommunityIcons name="email-outline" color="#FFF" size={25}/>
                                </View>
                                <View style={{
                                    height: '100%',
                                    justifyContent: 'center',
                                    backgroundColor: '#ff4b87',
                                    width: '68%'
                                }}>
                                    <Text style={{fontSize: FontSize(18), color: '#fff', paddingLeft: Width(4)}}>Sign
                                        Up</Text><Text
                                    style={{fontSize: FontSize(14), color: '#fff', paddingLeft: Width(4)}}>With
                                    Email</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={{width: Height(3)}}></View>

                            <TouchableOpacity style={{flex: 1, height: Height(8), flexDirection: 'row'}}
                                              onPress={this._gotoSignIN}>
                                <View style={{
                                    height: '100%',
                                    width: '32%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#4d5052'
                                }}>
                                    <MaterialCommunityIcons name="email-outline" color="#FFF" size={25}/>
                                </View>
                                <View style={{
                                    height: '100%',
                                    justifyContent: 'center',
                                    backgroundColor: '#64676b',
                                    width: '68%'
                                }}>
                                    <Text style={{fontSize: FontSize(18), color: '#fff', paddingLeft: Width(4)}}>Sign
                                        In</Text><Text
                                    style={{fontSize: FontSize(14), color: '#fff', paddingLeft: Width(4)}}>With
                                    Email</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ImageBackground>
            </View>
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
