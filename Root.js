import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, AsyncStorage, PushNotificationIOS} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator,createDrawerNavigator, NavigationActions} from "react-navigation";
import {Provider} from 'react-redux'
import LoginScreen from "./src/screens/LoginScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import OTPScreen from "./src/screens/OTPScreen";
import LoaderSplash from "./src/screens/LoaderSplash";
import HomeScreen from './src/screens/HomeScreen';
import DrawerScreen from './src/screens/DrawerScreen';
import DrawerScreenNew from './src/screens/DrawerScreen';
import NavigatorService from './src/services/navigator';
import ProfileScreen from './src/screens/ProfileScreen';
import MyCaseScreen from './src/screens/MyCaseScreen';
import HelpScreen from './src/screens/HelpScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import SubmitCaseScreen from './src/screens/SubmitCaseScreen';
import SubmitCaseDetailScreen from './src/screens/SubmitCaseDetailScreen';
import CaseDetailScreen from './src/screens/CaseDetailScreen';
import HealerAns from './src/screens/HealerAns';
import AllCaseTab from './src/screens/TabScreen/AllCaseTab';
import MyCaseTab from './src/screens/TabScreen/MyCaseTab';
import EditCaseScreen from './src/screens/EditCaseScreen';
import HelpCaselistScreen from './src/screens/HelpCaselistScreen';
import MenuContentScreen from './src/screens/MenuContentScreen';
import SubmitCaseHelpScreen from './src/screens/SubmitCaseHelpScreen';
import SettingScreen from './src/screens/SettingScreen';
import MyPointScreen from './src/screens/MyPoints';
import UserCaselistScreen from "./src/screens/UserCaselistScreen";
import configureStore from './configureStore'
import firebase, {Notification} from "react-native-firebase";
// import NotificationPopup from 'react-native-push-notification-popup';
import { InAppNotificationProvider } from 'react-native-in-app-notification';


const store = configureStore()
var gref ;
const drawerStack = createStackNavigator({
        Home: { screen: HomeScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},

        CaseDetailScreen:{screen: CaseDetailScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SubmitCaseDetailScreen:{
            screen: SubmitCaseDetailScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        LoginScreen : {screen: LoginScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }}
    },

    {
        initialRouteName: 'Home',
    })

const mycaseStack = createStackNavigator({
        MyCaseScreen:{ screen: MyCaseScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},

        CaseDetailScreen:{screen: CaseDetailScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
    },

    {
        initialRouteName: 'MyCaseScreen',
    })


export const DrawerNavigator = createDrawerNavigator(
    {
        Home: { screen: drawerStack, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        ProfileScreen:{ screen: ProfileScreen, navigationOptions: {
                header: null,gesturesEnabled: false,drawerLockMode: "locked-closed",
            }},
        SettingScreen:{ screen: SettingScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        MyPointScreen:{ screen: MyPointScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        UserCaselistScreen:{ screen: UserCaselistScreen, navigationOptions: {
                header: null,gesturesEnabled: false,drawerLockMode: "locked-closed",
            }},
        HelpScreen:{ screen: HelpScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        MyCaseScreen:{ screen: mycaseStack, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        ChangePasswordScreen:{ screen: ChangePasswordScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SubmitCaseScreen:{
            screen: SubmitCaseScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        CaseDetailScreen:{screen: CaseDetailScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        EditCaseScreen:{screen: EditCaseScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SubmitCaseDetailScreen:{
            screen: SubmitCaseDetailScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        AllCaseTab:{
            screen: AllCaseTab, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        MyCaseTab:{
            screen: MyCaseTab, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        MenuContentScreen:{
            screen: MenuContentScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
        SubmitCaseHelpScreen:{
            screen: SubmitCaseHelpScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
    },
    {
        initialRouteName:  "Home",
        contentComponent: props => <DrawerScreen {...props} />,
    },
);


export const DrawerNavigator1 = createDrawerNavigator(
    {
        Home: { screen: drawerStack, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        ProfileScreen:{ screen: ProfileScreen, navigationOptions: {
                header: null,gesturesEnabled: false,drawerLockMode: "locked-closed",
            }},
        SettingScreen:{ screen: SettingScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        MyPointScreen:{ screen: MyPointScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        UserCaselistScreen:{ screen: UserCaselistScreen, navigationOptions: {
                header: null,gesturesEnabled: false,drawerLockMode: "locked-closed",
            }},
        HelpScreen:{ screen: HelpScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        MyCaseScreen:{ screen: mycaseStack, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        ChangePasswordScreen:{ screen: ChangePasswordScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SubmitCaseScreen:{
            screen: SubmitCaseScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        CaseDetailScreen:{screen: CaseDetailScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        EditCaseScreen:{screen: EditCaseScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SubmitCaseDetailScreen:{
            screen: SubmitCaseDetailScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        AllCaseTab:{
            screen: AllCaseTab, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        MyCaseTab:{
            screen: MyCaseTab, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        MenuContentScreen:{
            screen: MenuContentScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
        SubmitCaseHelpScreen:{
            screen: SubmitCaseHelpScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
    },
    {
        initialRouteName:  "SubmitCaseScreen",
        contentComponent: props => <DrawerScreen {...props} />,
    },
);


export const AppNavigator = createStackNavigator(
    {
        LoginScreen : {screen: LoginScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SignInScreen : {screen: SignInScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SignupScreen : {screen: SignupScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        ForgotPasswordScreen : {screen: ForgotPasswordScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        OTPScreen : {screen: OTPScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        LoaderSplash : {screen: LoaderSplash,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        DrawerScreen:{screen: DrawerNavigator,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        DrawerScreenNew:{screen: DrawerNavigator1,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SubmitCaseScreen:{
            screen: SubmitCaseScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        EditCaseScreen:{screen: EditCaseScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SubmitCaseDetailScreen:{
            screen: SubmitCaseDetailScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        HealerAnsScreen:{
            screen: HealerAns, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
        HelpCaselistScreen:{
            screen: HelpCaselistScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
        MenuContentScreen:{
            screen: MenuContentScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
        SubmitCaseHelpScreen:{
            screen: SubmitCaseHelpScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
    },
    {
        initialRouteName: Platform.OS == 'ios' ? 'LoginScreen' : 'LoaderSplash',
    }
);

export const AppNavigator1 = createStackNavigator(
    {
        LoginScreen : {screen: LoginScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SignInScreen : {screen: SignInScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SignupScreen : {screen: SignupScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        ForgotPasswordScreen : {screen: ForgotPasswordScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        OTPScreen : {screen: OTPScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        LoaderSplash : {screen: LoaderSplash,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        DrawerScreen:{screen: DrawerNavigator,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        DrawerScreenNew:{screen: DrawerNavigator1,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SubmitCaseScreen:{
            screen: SubmitCaseScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        EditCaseScreen:{screen: EditCaseScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SubmitCaseDetailScreen:{
            screen: SubmitCaseDetailScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        HealerAnsScreen:{
            screen: HealerAns, navigationOptions:{
                header:null,gesturesEnabled: false,
            }
        },
        HelpCaselistScreen:{
            screen: HelpCaselistScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
        MenuContentScreen:{
            screen: MenuContentScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
        SubmitCaseHelpScreen:{
            screen: SubmitCaseHelpScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
    },
    {
        initialRouteName: 'DrawerScreen',
    }
);

export const AppNavigator2 = createStackNavigator(
    {
        LoginScreen : {screen: LoginScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SignInScreen : {screen: SignInScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SignupScreen : {screen: SignupScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        ForgotPasswordScreen : {screen: ForgotPasswordScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        OTPScreen : {screen: OTPScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        LoaderSplash : {screen: LoaderSplash,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        DrawerScreen:{screen: DrawerNavigator,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        DrawerScreenNew:{screen: DrawerNavigator1,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SubmitCaseScreen:{
            screen: SubmitCaseScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        EditCaseScreen:{screen: EditCaseScreen,navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        SubmitCaseDetailScreen:{
            screen: SubmitCaseDetailScreen, navigationOptions: {
                header: null,gesturesEnabled: false,
            }},
        HealerAnsScreen:{
            screen: HealerAns, navigationOptions:{
                header:null,gesturesEnabled: false,
            }
        },
        HelpCaselistScreen:{
            screen: HelpCaselistScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
        MenuContentScreen:{
            screen: MenuContentScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
        SubmitCaseHelpScreen:{
            screen: SubmitCaseHelpScreen, navigationOptions:{
                header:null,gesturesEnabled: false,
            },
        },
    },
    {
        initialRouteName: 'SubmitCaseHelpScreen',
    }
);

//const AppContainer = createAppContainer(AppNavigator)
//const AppContainer1 = createAppContainer(AppNavigator1)

export default class Root extends Component {
    constructor(props){
        super(props);
        this.state={token:"fetching",ref:'',isHelpScreen:true};

    }

    componentWillMount(){
        AsyncStorage.getItem('isHelpScreen').then((value) => {console.log("dsfdsf",value);
            if(value == "true"){
                this.setState({isHelpScreen:true})
            }else{
                this.setState({isHelpScreen:false})
            }
        })
    }

    componentDidMount() {
        AsyncStorage.getItem('token').then((value) => {console.log(value);
            SplashScreen.hide();
            global.token=value;this.setState({ 'token': value })})

        if(Platform.OS === 'ios'){
            PushNotificationIOS.requestPermissions();
            this.iosNotificationListner();
        }else{
            this.createNotificationListeners();
        }
        this.checkPermission();
    }

    componentWillUnmount() {
        this.notificationOpenedListener();
    }

    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
    }

    createNotificationListeners = () => {
        /*
             * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
             * */
        const notificationOpen = firebase.notifications().getInitialNotification()
            .then((notificationOpen) => {
                if (notificationOpen) {
                    const notification: Notification = notificationOpen.notification;
                    console.log('NOTIFICATION New==== ', notification);
                    this.handleNotification(notification);
                }
            })
            .catch((error) => {
                console.log('Notification Error', error);
            });


        /*
             * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
             * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            this.handleNotification(notificationOpen.notification);
        });

        /*
             * Triggered for data only payload in foreground
             * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            console.log(JSON.stringify(message));
        });
    };

    handleNotification(notification) {
        const case_token = notification._data.case_token
        console.log('NOTIFICATION TOKEN==== ', case_token);
        AsyncStorage.setItem('casetokenNew', case_token);
    };

    iosNotificationListner = () => {
        PushNotificationIOS.addEventListener('notification', function(notification){
            const case_token = notification._data.case_token
            console.log('NOTIFICATION TOKEN==== ', case_token);
            AsyncStorage.setItem('casetokenNew', case_token);
        });
    }

    render() {

        if(Platform.OS == 'ios'){
            if (this.state.token === 'fetching')
                return null;
            else {
                return this.state.token?

                    <Provider store={store}>
                        <InAppNotificationProvider backgroundColour={'#EE6B9A'}>
                            <AppNavigator1 ref={navigatorRef => {
                                NavigatorService.setContainer(navigatorRef);
                            }} />
                        </InAppNotificationProvider>
                    </Provider> :
                    this.state.isHelpScreen ?
                        <Provider store={store}>
                            <InAppNotificationProvider backgroundColour={'#EE6B9A'}>
                                <AppNavigator ref={navigatorRef => {
                                    NavigatorService.setContainer(navigatorRef);
                                }} />
                            </InAppNotificationProvider>
                        </Provider>
            :
                        <Provider store={store}>
                            <InAppNotificationProvider backgroundColour={'#EE6B9A'}>
                                <AppNavigator2 ref={navigatorRef => {
                                    NavigatorService.setContainer(navigatorRef);
                                }} />
                            </InAppNotificationProvider>
                        </Provider>

            }
        }else{
            return(
                <Provider store={store}>
                    <InAppNotificationProvider backgroundColour={'#EE6B9A'}>
                        <AppNavigator ref={navigatorRef => {
                            NavigatorService.setContainer(navigatorRef);
                        }} />
                    </InAppNotificationProvider>
                </Provider>
            )
        }
    }
}





