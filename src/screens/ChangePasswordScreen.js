import React, {Component} from 'react';
import {
    Platform,
    Animated,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
    TouchableHighlight,
    Dimensions,
    TouchableWithoutFeedback,
    View,
    ImageBackground,
    Image,
    TextInput,
    Text,
    AsyncStorage, Share
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Height, Width, FontSize, isIphoneX, isIphone } from './../constants/dimensions'
import { RotationGestureHandler } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Layout from './../constants/Layout'
import { TabView, SceneMap } from 'react-native-tab-view';
import AllCaseTab from './TabScreen/AllCaseTab'
import MyCaseTab from './TabScreen/MyCaseTab'
import RequestService from './../services/RequestService'
import {Spinner} from './../component/spinner'
import navigator from '../services/navigator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {setNotifiationPage} from '../Actions/setNotificationPage';
import {shareAction} from "../Actions/shareAction";
import {SHARE_MESSAGE,SHARE_TITLE,SHARE_URL} from '../constants/config'

class ChangePasswordScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            index: 0,
            routes: [
                { key: 'first', title: 'All Cases' },
                { key: 'second', title: "Cases I've Prayed for (5)" }
            ],
            current_password:'',
            confirm_password:'',
            new_password:'',
            loading:false
        }
        this.user_token=''
    }

    componentWillMount() {
        AsyncStorage.getItem('token').then((value) => {
            this.user_token=value;
        })
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        console.log("Profile Screen",nextProps)
        if(nextProps.notificationPage){
            this.props.setNotifiationPage(false)
            navigator.navigate('Home')
        }
        if(nextProps.isShare == true ){
            this.props.shareAction(false)
            this.onShare()
        }
    }

    onShare() {
        Share.share({
            message: SHARE_MESSAGE,
            url: SHARE_URL,
            title: SHARE_TITLE
        }, {
            // Android only:
            dialogTitle: SHARE_TITLE,
            // iOS only:
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToFacebook'
            ]
        })
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigator.navigate('Home')
            return true
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    _handleToggleMenu=()=>{
        //alert('j')
        this.props.navigation.openDrawer();
    }

    changePassword=()=>{
        if(this.state.new_password=='' || this.state.current_password==''){
            alert("Password shoudn't blank")
        }
        else if(this.state.new_password!=this.state.confirm_password){
            alert("Confirm password doesn't match")
        }
        else if(this.state.new_password.length<6){
            alert("Password has to be minimum 6 characters")
        }
        else{
            this.setState({loading:true})
            AsyncStorage.getItem('token').then((value) => {
                let obj = {
                    url: 'changecustomerpass',
                    body: {
                        user_token: value,
                        "current-password": this.state.current_password,
                        "new-password": this.state.new_password,
                        "new-password-confirm": this.state.confirm_password
                    }
                }
                new RequestService(obj).callCreate().then(res => {

                    if (res.message == 'Success') {
                        this.setState({loading: false, password_change_flag: true})
                        setTimeout(() => {

                        }, 500)
                    } else {
                        this.setState({loading: false})
                        setTimeout(() => {
                            alert(res.message)
                        }, 500)
                    }
                }).catch(err => {
                    this.setState({loading: false})
                    setTimeout(() => {
                        alert(res.message)
                    }, 500)
                })
            })
        }
    }

    __renderNavigationBar() {

        return (
            <View key="navbar" style={styles.navigationBarContainer}>
                <TouchableHighlight underlayColor='transparent' onPress={this._handleToggleMenu} style={styles.navigationBarLeftButton}>
                    <Ionicons  size={35} name="ios-menu" color="#EE6B9A"/>
                </TouchableHighlight>
                <View style={styles.navigationBarTitleContainer}>
                    <TouchableWithoutFeedback

                    >
                        <View style={{ flexDirection: 'row' }}>

                            <Text>Change Password</Text>

                        </View>
                    </TouchableWithoutFeedback>
                </View>

            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading?<Spinner />:null}
                {this.__renderNavigationBar()}

                <View style={{marginTop:Height(8),height:Height(8),backgroundColor:'#F9D7E0',marginHorizontal:Width(7),justifyContent:'center'}}>
                    <TextInput  secureTextEntry={true} onChangeText={(current_password)=>this.setState({current_password})} value={this.state.current_password} style={{paddingLeft:Width(5)}} placeholder={"Current Password"}/>
                </View>

                <View style={{marginTop:Height(2),height:Height(8),backgroundColor:'#EBF0F0',marginHorizontal:Width(7),justifyContent:'center'}}>
                    <TextInput secureTextEntry={true} onChangeText={(new_password)=>this.setState({new_password})} value={this.state.new_password} style={{paddingLeft:Width(5)}} placeholder={"New Password"}/>
                </View>

                <View style={{marginTop:Height(2),height:Height(8),backgroundColor:'#EBF0F0',marginHorizontal:Width(7),justifyContent:'center'}}>
                    <TextInput  secureTextEntry={true} onChangeText={(confirm_password)=>this.setState({confirm_password})} value={this.state.confirm_password} style={{paddingLeft:Width(5)}} placeholder={"Confirm New Password"}/>
                </View>

                <TouchableOpacity onPress={()=>this.changePassword()} style={{marginTop:Height(4),height:Height(9),backgroundColor:'#EE6A93',marginHorizontal:Width(15),justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#FFF'}}>Update Password</Text>
                </TouchableOpacity>

                {this.state.password_change_flag?<Text style={{color:'#EE6A93',fontSize:FontSize(16),paddingTop:Height(10),alignSelf:'center'}}>Password successfully changed!</Text>:null}

            </View>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({setNotifiationPage,shareAction}, dispatch)
    }
}

function mapStateToProps(state) {
    return{
        notificationPage: state.notificationPageManage.isCaseToken,
        isShare: state.shareData.isShare
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (ChangePasswordScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    navigationBarContainer: {
        backgroundColor: '#fff',
        height: Layout.HEADER_HEIGHT,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',

        overflow: 'hidden',

        top: 0,
        left: 0,
        right: 0,
    },
    navigationBarTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop:Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/3 : 0,
        alignItems: 'center',
        justifyContent: Platform.OS === 'ios' ? 'center' : 'center',
    },
    navigationBarTitle: {
        fontSize: 17,
        letterSpacing: -0.5,
    },
    navigationBarRightButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/5 : 0,
        right: 15,
        bottom: 0,
        height:Layout.HEADER_HEIGHT,
        width:Layout.HEADER_HEIGHT,
        justifyContent: 'center',
        zIndex:2,
    },
    navigationBarLeftButton:{
        position: 'absolute',
        top: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/5 : 0,
        left:Width(4),
        bottom: 0,
        height:Layout.HEADER_HEIGHT,
        width:Layout.HEADER_HEIGHT,
        justifyContent: 'center',
        zIndex:2,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#f5f7f9'
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16
    },
    selectedTab: {
        borderBottomColor: '#000',
        borderBottomWidth: 2
    },
    scene: {
        flex: 1,
    },

});
