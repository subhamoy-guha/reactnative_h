import React, { Component } from 'react';
import {
  Platform,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  PushNotificationIOS,
  BackHandler,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Height, Width, FontSize, isIphoneX, isIphone } from './../constants/dimensions'
import { RotationGestureHandler, ScrollView } from 'react-native-gesture-handler';
import RequestService from './../services/RequestService'
import {Spinner} from './../component/spinner'
import firebase from "react-native-firebase";
import Toast from "react-native-simple-toast";
import navigator from './../services/navigator';

let backHandlerClickCount = 0;

export default class SignInScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      loading:false
    };
    this._didFocusSubscription = props.navigation.addListener('willFocus', payload => {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.onBackButtonPressAndroid(payload))
    });
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


  SignIn = () => {
    if(this.state.email!='' && this.state.password!=''){
      if(!global.isActive){
        global.isActive=true
        this.setState({loading:true})

        let fcmToken= '' ;
        firebase.messaging().getToken().then((token) => {
          fcmToken=token;
          AsyncStorage.setItem('fcmtoken',Platform.OS == "ios" ? this.state.device_id : fcmToken)
          console.log('fcm token', token);
          let obj ={url:'login',body:{"email": this.state.email,"password":this.state.password,"device_token":Platform.OS == "ios" ? this.state.device_id : fcmToken,"device_type":Platform.OS == "ios" ? "ios" : "Android"}}
          console.log("Login Obj===",obj)
          new RequestService(obj).callCreate().then(res=>{
            console.log('login',res)
            global.isActive=false
            if(res.message=='Success'){
              if(res.profile_pending){
                if(res.profile_pending == "Yes"){
                  AsyncStorage.setItem('token',res.token,()=>{
                    AsyncStorage.setItem('healer', 'true',()=>{
                      navigator.navigate('ProfileScreen',{healer:'NON-HEALER',token:res.token || ''})
                    })
                  })

                }
              }else {
                AsyncStorage.setItem('token',res.token,()=>{
                  AsyncStorage.setItem('healer', 'true',()=>{
                    this.props.navigation.push('DrawerScreen')
                  })
                })
              }
              this.setState({loading:false})
            }
            else{
              Toast.show(
                  res.message,
                  Toast.SHORT,
                  Toast.BOTTOM
              );
              this.setState({loading:false})
              setTimeout(()=>{
                console.log("sign in alert==")
                // alert(res.message)
              },500)
            }
          }).catch(err=>{
            console.log("sign in alert==")
            //alert(JSON.stringify(err))
            this.setState({loading:false})
            global.isActive=false
          })
        }).catch((error) => {
          global.isActive=false
          this.setState({loading:false})
          alert('Please check your internet connection.')
          console.log('fcm erro', error);
        })
      }
    }
    else{
      alert('Please enter email and password')
    }
  }

  render() {
    return (
        <KeyboardAvoidingView>
          {this.state.loading?<Spinner />:null}
          <ScrollView contentContainerStyle={{minHeight:Dimensions.get('window').height}}>
            <ImageBackground style={{ height: '100%', width: '100%' }} source={require('./../../assets/Healing_Background.jpg')}>
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: Height(5), height: Height(25) }}>
                <Image style={{ height: Height(25), width: Height(25) }} resizeMode='contain' source={require('./../../assets/Healingg_whitelogo.png')} />
              </View>
              <View style={{ marginLeft: '8%', marginRight: '8%' }}>
                <View style={{ height: Height(1) }}></View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1, justifyContent: 'flex-start', color: 'black', fontSize: FontSize(16) }}>Sign In</Text>
                  <Text onPress={()=>this.props.navigation.navigate('ForgotPasswordScreen')} style={{ flex: 1, right: 0, position: 'absolute', color: 'black', fontSize: FontSize(16) }}>Forgot Password?</Text>
                </View>
                <View style={{ height: Height(2) }}></View>
                  <View style={{ height: Height(8),justifyContent:'center',borderWidth:1, borderColor:'#E9465F'}} >
                  <TextInput
                      style={{ marginLeft: '3%', color: 'black', backgroundColor:'rgba(0,0,0,0)' }}
                      underlineColorAndroid="transparent"
                      placeholder='Enter Email'
                      placeholderTextColor="black"
                      onChangeText={(email) => this.setState({ email })}
                  />
                </View>
                <View style={{ height: Height(2) }}></View>
                <View style={{ height: Height(8),justifyContent:'center',borderWidth:1, borderColor:'#E9465F'}} >
                  <TextInput
                      secureTextEntry={true}
                      style={{
                          marginLeft: '3%',
                          color: 'black',
                          backgroundColor:'rgba(0,0,0,0)',
                      }}
                      underlineColorAndroid="transparent"
                      placeholder='Enter Password'
                      placeholderTextColor="black"
                      onChangeText={(password) => this.setState({ password })}
                      secureTextEntry />
                </View>

                <View style={{ height: Height(2) }}></View>

                <TouchableOpacity onPress={()=>this.SignIn()}><ImageBackground style={{ height: Height(8), justifyContent: 'center', alignItems: 'center' }} source={require('./../../assets/Submit_Button_Box.png')}>
                  <Text style={{ fontSize: FontSize(20), color: '#fff' }}>Sign In</Text>
                </ImageBackground></TouchableOpacity>

                <View style={{ height: Height(2) }}></View>
                <View style={{ height: Height(0.2),backgroundColor:'#BE0055' }}></View>
                <Text style={{ textAlign: 'center', fontSize: FontSize(14), color: 'black' }}>Don't have a Healingg account?</Text>
                <View style={{ height: Height(1) }}></View>

                <Text onPress={()=>this.props.navigation.navigate('LoginScreen')} style={{ textAlign: 'center', fontSize: FontSize(14), color: '#E9465F' }}>Sign Up</Text>
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
  box: {
    height: 50,
    backgroundColor: '#eee',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    padding: 10,
  },
  box1: {
    height: 60,
    backgroundColor: '#eee',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
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
