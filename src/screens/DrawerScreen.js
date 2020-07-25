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
    AsyncStorage, Alert
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Height, Width, FontSize, isIphoneX, isIphone} from './../constants/dimensions'
import {RotationGestureHandler, ScrollView} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo'
import NavigatorService from './../services/navigator';
import RequestService from './../services/RequestService'
import {DrawerActions} from 'react-navigation';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logoutAPP } from '../Actions/logout';
import { shareAction } from '../Actions/shareAction'

class DrawerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: [],
            name: ''
        }
        this.user_token=''
    }

    componentWillMount() {
        SplashScreen.hide();

    }

    async componentDidMount() {
        let self = this
        /*firebase.messaging().onMessage((message: RemoteMessage) => {
            // Process your message as required
            //`alert('push notification');
        })

       this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
           //According me it's calles when notification comes when app is in foreground
           // Process your notification as required
           //const action = notificationOpen.action;
           // Get information about the notification that was opened
           //const notification2: Notification = notificationOpen.notification;
           console.log(notification)
           Alert.alert(
               'Healing',
               `${notification.title}\n${notification._body}`, [{
                   text: 'Ok',
                   onPress: () => console.log('Cancel Pressed'),
                   style: 'cancel'
               },{
                   text: 'Open case',
                   onPress: () => {navigator.navigate('CaseDetailScreen', {token: notification._data.case_token, root: 'home'})},
                   style: 'cancel'
               }], {
                   cancelable: false
               })

           //alert('push notification');
       });
       const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
       if (notificationOpen) {
           // App was opened by a notification
           // Get the action triggered by the notification being opened
           const action = notificationOpen.action;
           // Get information about the notification that was opened
           const notification: Notification = notificationOpen.notification;
           const case_token = notification._data.case_token
           AsyncStorage.getItem('casetoken').then((value) => {
               if(value!==case_token){
                   //global.case_token=case_token;
                   navigator.navigate('CaseDetailScreen', {token: case_token, root: 'home'})
                   console.log(notification)

               }
           })

       }*/
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'staticpageslist', body: {user_token: value}}
            new RequestService(params).callCreate().then(res => {
                console.log("Drawer Res===",res)
                if (res.pages) {
                    self.setState({pages: res.pages})
                } else {

                }
            }).catch(err => {
            })

            let params1 = {url: 'viewcustomerprofile', body: {user_token: value}}
            new RequestService(params1).callCreate().then(res => {
                if (res.message == 'success') {
                    console.log('drawer succeess',res)
                    self.setState({name: res.name, gender: res.gender, age: res.age, email: res.email,photo: res.thumbnail ? res.thumbnail : res.photo || ''})
                } else {

                }
            }).catch(err => {
            })
        })
        // AsyncStorage.getItem('username').then((value) => {
        //     if(value) {
        //         this.setState({name: value})
        //     }
        // })
    }

    logout = () => {
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'customerlogout', body: {user_token: value}}
            new RequestService(params).callCreate().then().catch()
            AsyncStorage.removeItem('token')
            AsyncStorage.removeItem('hasProfileInfo')
            AsyncStorage.removeItem('username')
            AsyncStorage.removeItem('healer')
            NavigatorService.navigate('LoginScreen')
            this.props.logoutAPP()
        })

    }

    signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.setState({ user: null }); // Remember to remove the user from your app's state as well
        } catch (error) {
            console.error(error);
        }
    };

    goto_screen = (screen) => {
        if(screen == "Home" && this.props.items[0].routes.length > 1){
            this.props.navigation.navigate('Home')
        }else if(this.props.activeItemKey != screen){
            if(screen == "MenuContentScreen"){
                this.props.navigation.navigate(screen,{pages:this.state.pages})
            }else{
                if(this.props.activeItemKey == "Home" && this.props.items[0].routes.length > 1){
                    this.props.navigation.navigate('Home')
                    this.props.navigation.navigate(screen)
                }else{
                    this.props.navigation.navigate(screen)
                }
            }
        }else{
            this.closeDrawer()
        }
    }

    onShareClick = () => {
        this.props.shareAction(true)
        this.closeDrawer()
    }

    closeDrawer = () => {
        //this.props.navigation.closeDrawer()
        console.log('this.props.navigation',this.props.navigation)
        this.props.navigation.dispatch(DrawerActions.closeDrawer());
    }

    render() {
        console.log('tis.state.name drawer',this.props.navigation)
        const textName = this.state.name  ? this.state.name.split(" ") : ""
        const name =  textName[0]
        return (
            <View>
                <ScrollView>
                    <View style={{height: Height(15), backgroundColor: '#EE6B9A', marginTop: Width(0)}}>
                        <Text style={{color: '#FFF', fontSize: FontSize(15), marginLeft:Height(14),
                            marginTop: Width(10)}}>Hello, </Text>
                        <Text style={{
                            color: '#FFF',
                            fontSize: FontSize(18),
                            fontWeight: 'bold',
                            marginLeft:Height(14),
                            paddingRight:Height(5),
                        }}>{name}</Text>
                        <TouchableOpacity onPress={() => this.closeDrawer()}
                                          style={{zIndex: 99, position: 'absolute', right: Width(3),marginTop: Width(12)}}>
                            <Entypo name="cross" size={30} color="#FFF"/>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        position: 'absolute',
                        left: Width(5),
                        top: Height(10),
                        height: Height(10),
                        width: Height(10),
                        borderRadius: Height(10),
                        borderColor: '#EE6B9A',
                        borderWidth: 2,
                        backgroundColor: '#FFF',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>

                        <Image source={{uri:  this.state.photo }}
                               onError={(e) => this.setState({photo: 'https://s3.us-east-2.amazonaws.com/healinggimagestest/default.png'})}
                               style={{width: Height(9), height: Height(9), borderRadius: Height(9)/2}} resizeMode={'cover'} />
                    </View>
                    <View style={{paddingTop: Height(5)}}>
                        <TouchableOpacity onPress={() => {console.log('called');this.goto_screen('Home')}}>
                            <Text style={{marginVertical: Height(3), marginLeft: Width(10)}}>All Active Cases</Text>
                        </TouchableOpacity>
                        <View style={{width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1}}></View>
                        <TouchableOpacity onPress={() => this.goto_screen('MyCaseScreen')}>
                            <Text style={{marginVertical: Height(3), marginLeft: Width(10)}}>My Submitted Requests</Text>
                        </TouchableOpacity>
                        <View style={{width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1}}></View>
                        <TouchableOpacity onPress={() => this.goto_screen('MyPointScreen')}>
                            <Text style={{marginVertical: Height(3), marginLeft: Width(10)}}>My Points</Text>
                        </TouchableOpacity>
                        <View style={{width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1}}></View>
                        <TouchableOpacity onPress={() => this.goto_screen('SettingScreen')}>
                            <Text style={{marginVertical: Height(3), marginLeft: Width(10)}}>Settings</Text>
                        </TouchableOpacity>
                        <View style={{width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1}}></View>

                        <TouchableOpacity onPress={() => this.goto_screen('ChangePasswordScreen')}>
                            <Text style={{marginVertical: Height(3), marginLeft: Width(10)}}>Change Password</Text>
                        </TouchableOpacity>
                        <View style={{width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1}}></View>
                        {this.state.pages.map((page,index)=>{
                            return <View key={index}>
                                <TouchableOpacity onPress={()=>this.goto_screen('MenuContentScreen')} >
                                    <Text style={{marginVertical: Height(3), marginLeft: Width(10)}}>{page.pagetitle}</Text>
                                </TouchableOpacity>
                                <View style={{width:'95%',alignSelf:'center',backgroundColor:'#ccc',height:1}}></View>

                            </View>
                        })}
                        <TouchableOpacity onPress={()=>this.goto_screen('HelpScreen')} >
                            <Text style={{marginVertical: Height(3), marginLeft: Width(10)}}>Contact Us</Text>
                        </TouchableOpacity>
                        <View style={{width:'95%',alignSelf:'center',backgroundColor:'#ccc',height:1}}></View>

                        <TouchableOpacity onPress={() => this.onShareClick()}
                                          style={{marginVertical: Height(3), marginLeft: Width(10), flexDirection: 'row'}}>
                            <Image source={require('./../../assets/Share.png')}
                                   style={{width:15,height:15,alignSelf:'center'}}
                                   resizeMode={'contain'}/>
                            <Text style={{marginLeft:5,color:'#D4497B',alignSelf:'center'}}>Share App</Text>
                        </TouchableOpacity>
                        <View style={{width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1}}></View>

                        <TouchableOpacity onPress={() => this.logout()}>
                            <Text style={{marginVertical: Height(3), marginLeft: Width(10)}}>Logout</Text>
                        </TouchableOpacity>
                        <View style={{width: '95%', alignSelf: 'center', backgroundColor: '#ccc', height: 1}}></View>

                        <View style={{width: '95%', height:100,alignSelf: 'center',justifyContent: 'center'}}>
                            <Text style={{color:'gray',textAlign:'center'}}>V 2.2(2020)</Text>
                        </View>

                    </View>
                </ScrollView>
            </View>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({logoutAPP, shareAction}, dispatch)
    }
}

export default connect(null,mapDispatchToProps) (DrawerScreen)

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
