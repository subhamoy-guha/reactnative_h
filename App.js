import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,AsyncStorage} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator,createDrawerNavigator, createBottomTabNavigator} from "react-navigation";
import LoginScreen from "./src/screens/LoginScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import HomeScreen from './src/screens/HomeScreen';
import DrawerScreen from './src/screens/DrawerScreen';
import NavigatorService from './src/services/navigator';
import ProfileScreen from './src/screens/ProfileScreen';
import MyCaseScreen from './src/screens/MyCaseScreen';
import HelpScreen from './src/screens/HelpScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import SubmitCaseScreen from './src/screens/SubmitCaseScreen';
import SubmitCaseDetailScreen from './src/screens/SubmitCaseDetailScreen';
import CaseDetailScreen from './src/screens/CaseDetailScreen'
import HealerAns from './src/screens/HealerAns'


const drawerStack = createStackNavigator({
    Home: { screen: HomeScreen, navigationOptions: {
            header: null,
        }},
    LoginScreen : {screen: LoginScreen,navigationOptions: {
            header: null,
        }},
    CaseDetailScreen:{screen: CaseDetailScreen,navigationOptions: {
            header: null,
        }},
    SubmitCaseDetailScreen:{
        screen: SubmitCaseDetailScreen, navigationOptions: {
            header: null,
        }},

})

export const DrawerNavigator = createDrawerNavigator(
    {
        Home: { screen: HomeScreen, navigationOptions: {
                header: null,
            }},
        ProfileScreen:{ screen: ProfileScreen, navigationOptions: {
                header: null,
            }},
        HelpScreen:{ screen: HelpScreen, navigationOptions: {
                header: null,
            }},
        MyCaseScreen:{ screen: MyCaseScreen, navigationOptions: {
                header: null,
            }},
        ChangePasswordScreen:{ screen: ChangePasswordScreen, navigationOptions: {
                header: null,
            }},
        DrawerStack:{screen:drawerStack,navigationOptions: {
                header: null,
            }},
        SubmitCaseScreen:{
            screen: SubmitCaseScreen, navigationOptions: {
                header: null,
            }},

    },
    {
        initialRouteName:'DrawerStack',

        contentComponent: props => <DrawerScreen {...props} />
    })

export const DrawerNavigator1 = createDrawerNavigator(
    {
        Home: { screen: HomeScreen, navigationOptions: {
                header: null,
            }},
        ProfileScreen:{ screen: ProfileScreen, navigationOptions: {
                header: null,
            }},
        HelpScreen:{ screen: HelpScreen, navigationOptions: {
                header: null,
            }},
        MyCaseScreen:{ screen: MyCaseScreen, navigationOptions: {
                header: null,
            }},
        ChangePasswordScreen:{ screen: ChangePasswordScreen, navigationOptions: {
                header: null,
            }},
        DrawerStack:{screen:drawerStack,navigationOptions: {
                header: null,
            }}

    },
    {
        initialRouteName: 'ProfileScreen',

        contentComponent: props => <DrawerScreen {...props} />
    })
//const DrawerContainer = createAppContainer(DrawerNavigator);
const AppNavigator = createStackNavigator(
    {

        LoginScreen : {screen: LoginScreen,navigationOptions: {
                header: null,
            }},
        SignInScreen : {screen: SignInScreen,navigationOptions: {
                header: null,
            }},
        SignupScreen : {screen: SignupScreen,navigationOptions: {
                header: null,
            }},
        ForgotPasswordScreen : {screen: ForgotPasswordScreen,navigationOptions: {
                header: null,
            }},
        DrawerScreen:{screen: DrawerNavigator,navigationOptions: {
                header: null,
            }},
        DrawerScreen1:{screen:DrawerNavigator1,navigationOptions:{
                header:null
            }},
        SubmitCaseScreen:{
            screen: SubmitCaseScreen, navigationOptions: {
                header: null,
            }},
        SubmitCaseDetailScreen:{
            screen: SubmitCaseDetailScreen, navigationOptions: {
                header: null,
            }},
        HealerAnsScreen:{
            screen: HealerAns, navigationOptions:{
                header:null,
            }
        }
    },

    {
        initialRouteName: 'LoginScreen',


    }
);

const AppNavigator1 = createStackNavigator(
    {

        LoginScreen : {screen: LoginScreen,navigationOptions: {
                header: null,
            }},
        SignInScreen : {screen: SignInScreen,navigationOptions: {
                header: null,
            }},
        SignupScreen : {screen: SignupScreen,navigationOptions: {
                header: null,
            }},
        ForgotPasswordScreen : {screen: ForgotPasswordScreen,navigationOptions: {
                header: null,
            }},
        DrawerScreen:{screen: DrawerNavigator,navigationOptions: {
                header: null,
            }},
        DrawerScreen1:{screen:DrawerNavigator1,navigationOptions:{
                header:null
            }},
        SubmitCaseScreen:{
            screen: SubmitCaseScreen, navigationOptions: {
                header: null,
            }},
        SubmitCaseDetailScreen:{
            screen: SubmitCaseDetailScreen, navigationOptions: {
                header: null,
            }},
        HealerAnsScreen:{
            screen: HealerAns, navigationOptions:{
                header:null,
            }
        }
    },

    {
        initialRouteName: 'DrawerScreen',


    }
);
//const AppContainer = createAppContainer(AppNavigator)
//const AppContainer1 = createAppContainer(AppNavigator1)

export default class App extends Component {
    constructor(props){
        super(props);
        this.state={token:"fetching"};

    }
    componentDidMount() {
        AsyncStorage.getItem('token').then((value) => {console.log(value);SplashScreen.hide();global.token=value;this.setState({ 'token': value })})
    }
    render() {
        if (this.state.token === 'fetching')
            return null;
        else {
            return this.state.token?
                <Provider store={store}><AppNavigator1 ref={navigatorRef => {
                NavigatorService.setContainer(navigatorRef);
            }}/></Provider>:<Provider store={store}><AppNavigator ref={navigatorRef => {
                NavigatorService.setContainer(navigatorRef);
            }}/></Provider>

        }
    }
}

