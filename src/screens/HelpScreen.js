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
import { RotationGestureHandler, ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Layout from './../constants/Layout'
import { TabView, SceneMap } from 'react-native-tab-view';
import AllCaseTab from './TabScreen/AllCaseTab'
import MyCaseTab from './TabScreen/MyCaseTab'
import navigator from '../services/navigator';
import Toast from "react-native-simple-toast";
import {Spinner} from "../component/spinner";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {setNotifiationPage} from '../Actions/setNotificationPage'
import {shareAction} from "../Actions/shareAction";
import {SHARE_MESSAGE,SHARE_TITLE,SHARE_URL} from '../constants/config'

class HelpScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            loading:false,
            message:'',
            subject:''
        }
    }

    componentDidMount(){
        SplashScreen.hide()
    }

    _handleToggleMenu=()=>{
        //alert('j')
        this.props.navigation.openDrawer();
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigator.navigate('Home')
            return true
        });
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        console.log("Profile Screen",nextProps)
        if(nextProps.isShare == true ){
            this.props.shareAction(false)
            this.onShare()
        }
        if(nextProps.notificationPage){
            this.props.setNotifiationPage(false)
            navigator.navigate('Home')
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

    componentWillUnmount() {
        this.backHandler.remove();
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

                            <Text>Contact Us</Text>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <TouchableHighlight  underlayColor='transparent' style={styles.navigationBarRightButton}>
                    <View></View>
                </TouchableHighlight>
            </View>
        );
    }

    sendContactUs = () => {
        if(this.state.subject && this.state.message){
            AsyncStorage.getItem('token').then((value) => {
                    this.setState({loading: true})
                    let formdata = new FormData();
                    formdata.append("user_token", value);
                    formdata.append("subject", this.state.subject);
                    formdata.append("message", this.state.message);

                    console.log('formdata', formdata);

                    fetch('https://cms.healingg.com/api/contact_us', {
                        method: 'post',
                        body: formdata,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((responseData) => {
                        console.log('contact us==', responseData)
                        this.setState({loading: false,subject:'',message:''})
                        Toast.show('Thank you. If your message requires a response, we will revert to you soon via email.', Toast.LONG, Toast.BOTTOM)
                        // navigator.navigate('Home')
                    }).catch(err => {
                        this.setState({loading: false})
                        console.log(err)
                        Toast.show('Error while contact us', Toast.LONG, Toast.BOTTOM)
                    })
                }
            )
        }else{
            Toast.show('Please fill up all details', Toast.LONG, Toast.BOTTOM)
        }

    }

    render() {
        return (
            <View style={styles.container}>
                {this.__renderNavigationBar()}
                {this.state.loading ? <Spinner/> : null}
                <ScrollView keyboardShouldPersistTaps='always'>
                    <View style={{marginHorizontal:Width(10)}}>
                        <Text style={{color:'#969696',fontSize:FontSize(14),paddingTop:Height(4)}}>Please use this form for any feedback, feature requests, bug reporting, love, hugs and thanks 🙂 </Text>

                        <View style={{marginTop:Height(2),height:Height(8),backgroundColor:'#EBF0F0',justifyContent:'center'}}>
                            <TextInput value={this.state.subject} onChangeText={(subject) => this.setState({subject:subject})} style={{paddingLeft:Width(5)}} placeholder={"Subject"}/>
                        </View>

                        <View style={{marginTop:Height(2),height:Height(16),backgroundColor:'#EBF0F0'}}>
                            <TextInput value={this.state.message} onChangeText={(message) => this.setState({message:message})} multiline={true} style={{height:Height(16),paddingLeft:Width(5,),textAlignVertical: "top"}} placeholder={"Message"}/>
                        </View>

                        <TouchableOpacity onPress={() =>  this.sendContactUs()} style={{marginTop:Height(4),height:Height(9),backgroundColor:'#EE6A93',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'#FFF'}}>Send</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps) (HelpScreen)

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
        top: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/2.5 : 0,
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
