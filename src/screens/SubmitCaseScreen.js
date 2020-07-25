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
import Ionicons from 'react-native-vector-icons/Ionicons'
import Layout from './../constants/Layout'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import navigator from '../services/navigator';
import RequestService from './../services/RequestService';
import {setNotifiationPage} from '../Actions/setNotificationPage';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {shareAction} from "../Actions/shareAction";
import {SHARE_MESSAGE,SHARE_TITLE,SHARE_URL} from '../constants/config'
import redeem from "../../assets/Reward_Points_Icon.png";

class SubmitCaseScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            index: 0,
            routes: [
                { key: 'first', title: 'All Cases' },
                { key: 'second', title: "Cases I've Prayed for (5)" }
            ],
            healingIndex:0,
            caseIndex:0,
            healing_for:'someone else',
            categories:[],
            category_id:1,
            category_name:'',
            isGroup:"no"
        }
        this.user_token=''
    }

    componentWillMount() {
        AsyncStorage.getItem('token').then((value) => {
            this.user_token=value;
        })
    }

    componentDidMount(){
        SplashScreen.hide()
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigator.navigate('Home')
            return true
        });
        let self = this
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'categories', body: {user_token: value}}
            new RequestService(params).callCreate().then(res => {
                if (res.categories) {
                    console.log(res.categories)
                    self.setState({categories: res.categories, category_id: res.categories[0].id,category_name:res.categories[0].category})
                } else {
                    self.setState({categories: []})
                }
            }).catch(err => {
            })
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

    _handleToggleMenu=()=>{
        this.props.navigation.openDrawer();
    }

    onSelect(index, value){
        this.setState({
            text: `Selected index: ${index} , value: ${value.id}`,healingIndex:index,category_id:value.id,category_name:value.category,
            isGroup:value.isGroup
        })
    }

    onSelectCaseIndex(index, value){
        this.setState({
            text: `Selected index: ${index} , value: ${value}`,caseIndex:index,healing_for:value
        })
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

                            <Text>Submit a Healing Request</Text>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <TouchableHighlight onPress={() => this.setState({search: true, autofocus: true})}
                                    underlayColor='transparent'
                                    style={styles.navigationBarRightButton}>
                    <Image source={redeem} style={{height:30,width:30}} />

                </TouchableHighlight>
                <TouchableOpacity style={styles.navigationBarRightButton} onPress={() => navigator.navigate('MyPointScreen')}>
                    <Text style={{fontSize:12,color:'pink',fontWeight:'bold'}}>{this.props.points}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.__renderNavigationBar()}
                <Text style={{marginTop:Height(8),marginHorizontal:Width(6)}}>Healing needed for</Text>
                <View style={{height:'auto',backgroundColor:'#FFF',marginHorizontal:Width(5),borderRadius:10,marginTop:Height(1)}}>
                    <RadioGroup
                        size={24}
                        thickness={2}
                        color='#000'
                        selectedIndex={this.state.healingIndex}
                        onSelect = {(index, value) => this.onSelect(index, value)}
                    >

                        {this.state.categories.map((category,index)=>{
                            return <RadioButton key={index} color="#EE6B9A" style={{alignItems:'center'}} value={category} >
                                <Text style={[this.state.healingIndex==index?{color:'#EE6B9A'}:{}]}>{category.category}</Text>
                            </RadioButton>
                        })}

                    </RadioGroup>
                </View>
                {this.state.category_id == 1 && <Text style={{marginTop:Height(5),marginHorizontal:Width(6)}}>This request is for</Text>}
                {this.state.category_id == 1 &&
                <View style={{height:'auto',backgroundColor:'#FFF',marginHorizontal:Width(5),borderRadius:10,marginTop:Height(1)}}>
                    <RadioGroup
                        size={24}
                        thickness={2}
                        color='#000'
                        style={{flexDirection:'row'}}
                        selectedIndex={this.state.caseIndex}
                        onSelect = {(index, value) => this.onSelectCaseIndex(index, value)}
                    >
                        <RadioButton color="#EE6B9A" value={'someone else'}>
                            <Text style={[this.state.caseIndex==0?{color:'#EE6B9A'}:{}]}>Someone else</Text>
                        </RadioButton>
                        <RadioButton color="#EE6B9A" style={{alignItems:'center'}} value={'my self'} >
                            <Text style={[this.state.caseIndex==1?{color:'#EE6B9A'}:{}]}>Myself</Text>
                        </RadioButton>
                    </RadioGroup>
                </View> }

                <View style={{flex:1}}>
                    <TouchableOpacity onPress={()=>navigator.navigate('SubmitCaseDetailScreen',{healing_for:this.state.healing_for,category_id:this.state.category_id,category_name:this.state.category_name,isGroup:this.state.isGroup})} style={{position:'absolute',bottom:-10,width:'90%',alignSelf:'center',height: Height(9),backgroundColor:'#EE6B9A',justifyContent:'center',flex:1}}>
                        <Text  style={{fontSize:FontSize(16),color:'#FFF',alignSelf:'center'}}>Next</Text>
                    </TouchableOpacity>
                </View>

                <View style={{zIndex:-1,justifyContent:'flex-end',height:50,flex:1}}>

                    <View style={{flexDirection:'row',height:50}}>
                        <TouchableOpacity onPress={()=>navigator.navigate('Home')} style={{width:'50%',backgroundColor:'#CCC',justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:FontSize(16),color:'#EE6B9A'}}>Send Prayers</Text></TouchableOpacity>
                        <TouchableOpacity style={{width:'50%',backgroundColor:"#EE6B9A",justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:FontSize(16),color:'#FFF'}}>Request Healing</Text></TouchableOpacity>
                    </View>
                    <Image source={require('./../../assets/H_Logo_Bottom_Center.png')} style={{
                        position: 'absolute',
                        zIndex: 99,
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        backgroundColor: 'white',
                        alignSelf: 'center',
                        bottom: 5
                    }}/>
                </View>
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
        isShare: state.shareData.isShare,
        points:state.points.points
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (SubmitCaseScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F7F9',
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
        top: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/2.5 : 15,
        right: 15,
        height: 30,
        width: 30,
        alignItems:'center',
        justifyContent:'center'
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
