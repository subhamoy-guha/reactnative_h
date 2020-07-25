import React, {Component} from 'react';
import {
    Platform,
    Animated,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    ScrollView,
    TouchableWithoutFeedback,
    View,
    Image,
    TextInput,
    Text,
    FlatList,
    Alert,
    BackHandler,StatusBar,
    AsyncStorage, ActivityIndicator, Share, PushNotificationIOS
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import {Height, Width, FontSize, isIphoneX, isIphone} from './../constants/dimensions'
import {RotationGestureHandler} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Layout from './../constants/Layout'
import {TabView, SceneMap,PagerPan} from 'react-native-tab-view';
import AllCaseTab from './TabScreen/AllCaseTab'
import MyCaseTab from './TabScreen/MyCaseTab'
import Navigator from './../services/navigator'
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import RequestService from './../services/RequestService';
import Toast from 'react-native-simple-toast';
import navigator from '../services/navigator';
import NavigatorService from './../services/navigator';
import _ from 'lodash';
import SimpleToast from 'react-native-simple-toast';
import firebase from 'react-native-firebase';;
import {Spinner} from "./../component/spinner";
import CaseListItem from "./CaseListItem";
import { connect } from 'react-redux';
import {setFollowStatus} from "../Actions/setFollow";
import {setNotifiationPage} from '../Actions/setNotificationPage';
import {setFilterStatus} from '../Actions/setFilter'
import {shareAction} from "../Actions/shareAction";
import {setPointsPage} from "../Actions/setPoint";
import { bindActionCreators } from 'redux';
import ImageModal from '../component/imageModal';
import PrayerModal from "../component/prayerModal";
import PrayerScreen from '../component/PrayerScreen';
import {SHARE_MESSAGE,SHARE_TITLE,SHARE_URL} from '../constants/config'
import redeem from "../../assets/Reward_Points_Icon.png";
import ReedemModal from '../component/ReedemPointsAlert';

let backHandlerClickCount = 0;

class HomeScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            routes: [
                {key: 'first', title: 'All Active Cases'},
                {key: 'second', title: "Cases I've Prayed for"}
            ],
            search: false,
            caselist: [],
            currentlist: [],
            case_filter: 'alltab',
            allcaselist: [],
            myFollowingCases: [],
            myFollowingCaseslength: 0,
            filterText: 'Active',
            filterSearchText:'',
            sortText: 'Sort',
            loading: false,
            autofocus: false,
            searchapi: '',
            offset: 0,
            isFlatStop: false,
            filterType: '',
            addMoreLoader: false,
            modalVisisble:false,
            imageProfile:[],
            modalPrayer: false,
            prayerList: {},
            isVisible: false,
            new_prays:0,
            new_comments:0,
            modalPrayerApi : false,
            cases:{},
            isVisiblePopup:false,
            casesPrayer:{},
            redeemModal:false,
            redeemPoints:0,
            name:"",
            myActiveCases:0
        }
        this._didFocusSubscription = props.navigation.addListener('willFocus', payload => {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.onBackButtonPressAndroid(payload))
        });
        props.navigation.addListener('willBlur', () => {
            this._didFocusSubscription.remove();
            //this.backHandler.remove()
        })
        this.user_token = ''
    }


    componentWillReceiveProps(nextProps) {
        console.log("Home screen Props new==",nextProps)
        if(nextProps.isPrayerClick){
            const{myFollowingCaseslength,myActiveCases} = this.state
            let newCount = parseInt(myFollowingCaseslength) + 1
            let newActiveCount = 0
            if(myActiveCases.includes("+")){
                newActiveCount = myActiveCases
            }else{
                newActiveCount = myActiveCases > 0 ? parseInt(myActiveCases) - 1 : 0
            }
            this.setState({
                routes: [
                    {key: 'first', title: `All Active Cases (${newActiveCount})`},
                    {key: 'second', title: `Cases I've Prayed for (${newCount})`}
                ],
                myFollowingCaseslength:newCount
            })
        }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        console.log("Home screen Props==",nextProps)
        if(nextProps.isFilter == true){
            this.props.setFollowStatus(false,false,'',false)
            if(nextProps.filterData) {
                if (nextProps.filterData.filter == 'sort') {
                    this.setState({sortText:nextProps.filterData.filterText})
                }
                if (nextProps.filterData.filter == 'filter') {
                    this.setState({filterText:nextProps.filterData.filterText})
                }
            }
        }
        if(nextProps.isShare == true ){
            this.props.shareAction(false)
            this.onShare()
        }
        if(nextProps.isSearch == true){
            this.props.setFollowStatus(false,false,'')
            this.setState({search: true, autofocus: true}, () => {
                this.searchCase(nextProps.searchWord)
            })
        }
        if(nextProps.notificationPage){
            this.props.setNotifiationPage(false)
            AsyncStorage.getItem('casetokenNew').then((value) => {
                console.log("token==",value)
                let token = value
                if(token.length > 0) {
                    AsyncStorage.setItem('casetokenNew','')
                    navigator.navigate('CaseDetailScreen', {token: token, root: 'home'})
                }
            })
        }
    }

    async componentWillMount() {
        SplashScreen.hide()
        firebase.messaging().getToken().then((token) => {
            console.log('fcm token', token);
        }).catch((error) => {
            console.log('fcm erro', error);
        })
        AsyncStorage.getItem('casetokenNew').then((value) => {
            console.log("token==",value)
            let token = value
            if(token.length > 0) {
                AsyncStorage.setItem('casetokenNew','')
                navigator.navigate('CaseDetailScreen', {token: token, root: 'home'})
            }
        })
        this.fetchPoints()
    }

    componentWillUnmount() {
        if (this._didFocusSubscription) {
            this._didFocusSubscription.remove();
        }
    }

    componentDidMount() {
        SplashScreen.hide()
        this.getNotificationSummary()
        firebase.analytics().logEvent("Home_Scree_12",{name:'Home Screen'})


        console.log("current index===",this.state.index)
        AsyncStorage.getItem('token').then((value) => {
            if (value) {
                AsyncStorage.getItem('healer').then((value2) => {
                    if (value2) {
                        let params = {url: 'my_following_cases', body: {user_token: value}};
                        new RequestService(params).callCreate().then(res => {
                            console.log('myFollowingCases===homescreen', res.myFollowingCases)
                            if (res.myFollowingCases) {
                                this.setState({
                                    routes: [
                                        {key: 'first', title: `All Active Cases (${this.state.myActiveCases})`},
                                        {key: 'second', title: `Cases I've Prayed for (${res.noOfFollowingCases})`}
                                    ],
                                    myFollowingCases: res.myFollowingCases,
                                    myFollowingCaseslength: res.noOfFollowingCases
                                })
                            } else {

                            }
                        }).catch(err => {
                            console.log('============', err)
                        })
                        let params2 = {url: 'caselist', body: {user_token: value, dataCount: 0}}
                        new RequestService(params2).callCreate().then(res => {
                            if (res.caselist) {
                                let filterCases = [];
                                if (Object.values(res.caselist).length !== 0) {
                                    Object.values(res.caselist).map((data, index) => {
                                        filterCases.push(data);
                                    });
                                }
                                this.setState({allcaselist: filterCases})
                            } else {

                            }
                        }).catch(err => {
                            console.log('============', err)
                        })
                    }
                    t
                })
            }
        })
        AsyncStorage.getItem('token').then((value) => {
            if (value) {
                let params = {url: 'total_active_cases', body: {user_token: value}};
                new RequestService(params).callCreate().then(res => {
                    console.log('activeCase===homescreen', res.total_active_cases)
                    if (res.total_active_cases) {
                        this.setState({
                            routes: [
                                {key: 'first', title: `All Active Cases (${res.total_active_cases})`},
                                {key: 'second', title: `Cases I've Prayed for (${this.state.myFollowingCaseslength})`}
                            ],
                            myActiveCases: res.total_active_cases
                        })
                    } else {

                    }
                }).catch(err => {
                    console.log('============', err)
                })
            }
        })
        AsyncStorage.getItem('fcmtoken').then((value) => {
            if(value == null){
                if(Platform.OS == "ios"){
                    PushNotificationIOS.addEventListener('register', token => {
                        AsyncStorage.setItem('fcmtoken',token)
                        this.sendFCMToken(token)
                    })
                    PushNotificationIOS.requestPermissions();
                }else{
                    firebase.messaging().getToken().then((token) => {
                        AsyncStorage.setItem('fcmtoken',token)
                        this.sendFCMToken(token)
                    })
                }
            }else{
                if(Platform.OS == "ios"){
                    PushNotificationIOS.addEventListener('register', token => {
                        if (value != token) {
                            AsyncStorage.setItem('fcmtoken',token)
                            this.sendFCMToken(token)
                        }
                    })
                    PushNotificationIOS.requestPermissions();
                }else {
                    firebase.messaging().getToken().then((token) => {
                        if (value != token) {
                            AsyncStorage.setItem('fcmtoken',token)
                            this.sendFCMToken(token)
                        }
                    })
                }
            }
        })
    }

    fetchPoints = () => {
        const {offset,records,totalPoints} = this.state
        AsyncStorage.getItem('token').then((value) => {
            if (value) {
                let params = {url: 'history/records', body: {user_token: value, dataCount : offset}}
                new RequestService(params).callCreate().then(res => {
                    this.props.setPointsPage(res.total_points)
                }).catch(err => {
                    console.log("history error==",err)
                })
            }
        })
    }

    sendFCMToken = (token) => {
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'update_device_token', body: {user_token: value,
                    device_type:Platform.OS == "ios" ? "ios" : "Android",
                    device_token: token}}
            console.log('Device token params', params)
            new RequestService(params).callCreate().then(res => {
                console.log('Device token response', res)
            }).catch(err => {
                console.log('Device token error', err)
            })
        })
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

    searchCase = (search_word) =>  {
        const bounced = _.debounce(() => {
            const{offset,caselist} = this.state
            AsyncStorage.getItem('token').then((value) => {
                var params = {}
                var url = this.state.index == 0 ? 'search_cases' : 'search_following_cases'
                if(this.state.filterType == 'filter') {
                    var filterName = this.state.filterSearchText
                    params = {url: url, body: {user_token: value, search_word: search_word, filter: filterName,dataCount:offset}}
                }else{
                    params = {url: url, body: {user_token: value, search_word: search_word, filter:'active',dataCount:offset}}
                }

                // let params =  {user_token: value, search_word: search_word}

                console.log('params', params)
                new RequestService(params).callCreate().then(res => {
                    console.log('search case', res)
                    if (res.caselist) {
                        if(res.caselist.length > 0){
                            let newOffset = offset + 1
                            console.log('new Offset:', newOffset)
                            const newArr = [...caselist,...res.caselist]
                            this.setState({caselist: res.caselist, case_filter: 'active',offset:newOffset})
                        }else{
                            this.setState({caselist: res.caselist, case_filter: 'active',isFlatStop: true})
                        }
                    } else {
                        //if (search_word == '') {
                        this.setState({caselist: [], case_filter: 'active',isFlatStop: true})
                        // }
                    }
                }).catch(err => {
                    console.log('errr search', err)
                })


            })
        }, 1000, {'maxWait': 1000});
        this.setState({searchapi: search_word})
        if (search_word.length > 3) {
            console.log('start')
            bounced();
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

    handleProps = () => {
        console.log('calling handle props');
        this.setState({
            myFollowingCaseslength: this.state.myFollowingCaseslength + 1,
            routes: [
                {key: 'first', title: `All Active Cases (${this.state.myActiveCases})`},
                {key: 'second', title: `Cases I've Prayed for (${this.state.myFollowingCaseslength + 1})`}
            ]
        });

        this.forceUpdate();
    }

    _handleToggleMenu = () => {
        console.log('navigate', this.props);
        this.props.navigation.toggleDrawer();
    }

    tabViewIndexChange = (index) => {
        console.log("index change===")
        this.setState({index:index});
    };

    renderTabBar = (props) => {
        console.log("===this.props===",this.props)
        const inputRange = props.navigationState.routes.map((x, i) => i);
        console.log('render tab bar',this.state.index)
        if(this.props.isFollowData == true){
            this.setState({index:1},() => {
                this.props.setFollowStatus(false,false,'')
                return (
                    <View style={[styles.tabBar]}>
                        {this.state.routes.map((route, i) => {
                            const color = props.position.interpolate({
                                inputRange,
                                outputRange: inputRange.map(inputIndex => (inputIndex === i ? '#333333' : '#767676'))
                            });
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.tabItem, this.state.index == i ? styles.selectedTab : {}]}
                                    onPress={() => {
                                        console.log("index Follow===",i)
                                        this.setState({index: i})
                                    }}
                                >
                                    <Animated.Text style={{color, fontSize: FontSize(12)}}>{route.title}</Animated.Text>
                                </TouchableOpacity>

                            );
                        })}
                    </View>
                );
            })
        }else{
            return (
                <View style={[styles.tabBar]}>
                    {this.state.routes.map((route, i) => {
                        const color = props.position.interpolate({
                            inputRange,
                            outputRange: inputRange.map(inputIndex => (inputIndex === i ? '#333333' : '#767676'))
                        });
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[styles.tabItem, this.state.index == i ? styles.selectedTab : {}]}
                                onPress={() => {
                                    console.log("index Selected===",i)
                                    this.setState({index: i})
                                }}
                            >
                                <Animated.Text style={{color, fontSize: FontSize(12)}}>{route.title}</Animated.Text>
                            </TouchableOpacity>

                        );
                    })}
                </View>
            );
        }

    };

    clearFilter = () => {
        this.props.setFilterStatus("alltab",'',this.state.index,'')
        this.setState({case_filter: 'alltab', sortText: 'Sort', filterText: 'Active'})
        this.ActionSheet1.hide()
        this.ActionSheet.hide()
    }

    renderTopText = () => {
        const {filterType,filterText} = this.state
        if(filterType != ''){
            if(filterType == 'filter'){
                switch(filterText){
                    case 'Active':
                        return "Cases that need your prayers"
                    case 'Inactive':
                        return "Inactive cases"
                    case 'Healed':
                        return "Cases marked as healed"
                    case 'Closed':
                        return "Closed cases"
                    default:
                        return "Following cases need your prayers"
                }
            }else{
                return "Following cases need your prayers"
            }
        }else{
            return "Following cases need your prayers"
        }
    }

    __renderNavigationBar() {

        return (
            <View key="navbar" style={[styles.navigationBarContainer]}>
                <TouchableHighlight underlayColor='transparent' onPress={this._handleToggleMenu}
                                    style={styles.navigationBarLeftButton}>
                    <Ionicons size={35} name="ios-menu" color="#EE6B9A"/>
                </TouchableHighlight>
                <View style={styles.navigationBarTitleContainer}>
                    <TouchableWithoutFeedback>
                        <View style={{flexDirection: 'row'}}>
                            <Text>{this.renderTopText()}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                {/*<View style={{position: 'absolute',*/}
                {/*    top:Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/5 : 0,*/}
                {/*    bottom:0,*/}
                {/*    right: 70,*/}
                {/*    width: 1,*/}
                {/*    height: '100%',*/}
                {/*    justifyContent: 'center',*/}
                {/*    alignItems:'center'}} >*/}
                {/*    <View style={{backgroundColor:'grey',*/}
                {/*        height: '50%',width:1}}/>*/}
                {/*</View>*/}
                <TouchableHighlight onPress={() => this.setState({search: true, autofocus: true})}
                                    underlayColor='transparent'
                                    style={styles.navigationBarRightButton}>
                    <EvilIcons name="search" size={25}/>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.setState({search: true, autofocus: true})}
                                    underlayColor='transparent'
                                    style={styles.navigationBarRightButton1}>
                    <Image source={redeem} style={{height:30,width:30}} />

                </TouchableHighlight>
                <TouchableOpacity style={styles.navigationBarRightButton1} onPress={() => navigator.navigate('MyPointScreen')}>
                    <Text style={{fontSize:12,color:'pink',fontWeight:'bold'}}>{this.props.points}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    __renderNavigationBar1() {
        return (
            <View key="navbar" style={[styles.navigationBarContainer]}>
                {this.state.searchapi.length == 0 &&
                <TouchableHighlight underlayColor='transparent' onPress={() => this.setState({search: false,offset:0})}
                                    style={styles.navigationBarLeftButton}>
                    <Ionicons size={25} name="md-arrow-back" color="#000"/>
                </TouchableHighlight> }
                <View style={[styles.navigationBarTitleContainer, {justifyContent: 'flex-start', left: Width(6)}]}>
                    <TextInput autoFocus={this.state.autofocus} placeholder="Search here" value={this.state.searchapi}
                               onChangeText={(value) => this.searchCase(value)}
                               placeholderTextColor="#000"/>
                </View>

            </View>
        );
    }

    sortcase = (index) => {
        let sortText = 'Sort'
        if (index == 3) {
            this.ActionSheet1.hide()
        } else {
            switch (index) {
                case 0:
                    sortText = "Latest"
                    this.props.setFilterStatus("sort",'latest',this.state.index,sortText)
                    break;
                case 1:
                    sortText = "Most Prayed";
                    this.props.setFilterStatus("sort",'mosthealed',this.state.index,sortText)
                    break;
                case 2:
                    sortText = "Least Prayed"
                    this.props.setFilterStatus("sort",'leasthealed',this.state.index,sortText)
                    break;
            }
            this.setState({
                sortText:sortText
            })
        }

    }

    filtercase = (index) => {
        console.log("==filter calling===")
        if (index == 4) {
            this.ActionSheet.hide()
        } else {
            let filterLabel = 'Active'
            switch (index) {
                case 0:
                    filterLabel = 'Active';
                    this.props.setFilterStatus("filter",'active',this.state.index,filterLabel)
                    break;
                case 1:
                    filterLabel = 'Healed'
                    this.props.setFilterStatus("filter",'healed',this.state.index,filterLabel)
                    break;
                case 2:
                    filterLabel = 'Closed'
                    this.props.setFilterStatus("filter",'closed',this.state.index,filterLabel)
                    break;
                case 3:
                    filterLabel = 'Inactive'
                    this.props.setFilterStatus("filter",'inactive',this.state.index,filterLabel)
                    break;
            }
            this.setState({
                filterText: filterLabel
            }, () => {

            })
        }
    }

    onPrayClick = (cases) => {
        if(cases.isPray == 0) {
            this.setState({cases: cases}, () => {
                this.setState({modalPrayerApi: true})
            })
        }
    }

    showActionSheet1 = () => {
        this.ActionSheet1.show()
    }

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    renderModalContent = () => (
        <TouchableOpacity style={{
            backgroundColor: "white",
            padding: 22,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)",
            zIndex: 10
        }} onClick={() => {
            alert('hello')
        }}>
            <Text>Hello!</Text>
        </TouchableOpacity>
    );

    renderListData = (cases) => {
        let item = cases.item
        const personImage = item.person_image ? item.person_image : item.photo;
        const personName = item.person_name ? item.person_name : item.name;
        return (
            <TouchableOpacity onPress={() => {
                global.case_token = item.token;
                navigator.navigate('CaseDetailScreen', {...item, root: 'home'})
            }} style={{flexDirection: 'row'}}>
                <View style={{width: Width(18), marginTop: Height(2), marginHorizontal: Width(2)}}>
                    <View style={{
                        height: Height(10.5),
                        overflow: 'hidden',
                    }}>
                        {personImage &&
                        <Image style={{
                            width: Height(9), height: Height(9), borderRadius: Height(9) / 2
                        }} resizeMode={'cover'}
                               source={{uri: personImage}}
                        /> ||
                        <Image style={{
                            width: Height(9),
                            height: Height(9), borderRadius: Height(9) / 2
                        }} resizeMode={'cover'}
                               source={require('../../assets/HEALINGG_Logo_Pink.png')}

                        />
                        }
                    </View>
                </View>

                <View style={{width: Width(52), marginTop: Height(2)}}>
                    <Text style={{fontSize: FontSize(14)}} numberOfLines={1}>{item.category}</Text>
                    <Text
                        style={{
                            fontSize: FontSize(14),
                            color: '#000'
                        }}>{item.gender && `${item.gender.charAt(0).toUpperCase() + item.gender.slice(1)}, `} {item.age && `${item.age} yrs `}
                        {item.user_country && `from ${item.user_country}`}</Text>
                    <Text style={{
                        fontSize: FontSize(16),
                        fontWeight: 'bold',
                        color: '#000'
                    }}>{personName}</Text>
                    <View style={{
                        height: Height(2),
                        width: Height(2),
                        borderRadius: Height(2),
                        borderColor: '#EE6A93',
                        borderWidth: 2,
                    }}/>

                    <Text style={{
                        fontSize: FontSize(14),
                        paddingLeft: 25,
                        marginTop: -17
                    }}>{item.title}</Text>
                    <View style={{height: Height(0.8)}}/>

                    <View style={{width: Width(100), height: 1, backgroundColor: '#ccc'}}></View>
                    <View style={{height: Height(0.5)}}/>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: Width(55),
                            alignItems: 'center'
                        }}>
                        <Text
                            style={{
                                fontSize: FontSize(14),
                                color: '#EE6B9A',
                                fontStyle: 'italic'
                            }}>{item.total_prays}</Text>
                        <Text
                            style={{fontSize: FontSize(13), fontStyle: 'italic'}}> prayers received</Text>
                        <Text style={{
                            fontSize: FontSize(14),
                            color: '#EE6B9A',
                            paddingLeft: Width(4),
                            fontStyle: 'italic'
                        }}>{item.total_comments}</Text><Text
                        style={{fontSize: FontSize(13), fontStyle: 'italic'}}> comment</Text>
                    </View>
                    {/* <View style={{height:Height(15),width:1,backgroundColor:'#ccc'}}></View> */}
                </View>
                <View style={{
                    height: Height(12),
                    width: 1,
                    backgroundColor: this.props.myFollow === 'follow' ? '#ffffff00' : item.status === 'active' ? '#ccc' : '#00000000'
                }}/>
                {this.props.myFollow === 'follow' ?
                    <View
                        style={{
                            width: Width(15),
                            marginTop: Height(2),
                            marginHorizontal: Width(4),
                            zIndex: 100
                        }}
                    >

                    </View> :
                    item.status === 'active' ? <TouchableOpacity
                        style={{
                            width: Width(15),
                            marginTop: Height(2),
                            marginHorizontal: Width(4),
                            zIndex: 100
                        }}
                        onPress={() => {
                            this.props.onPrayClick(cases)
                        }}>
                        {item.isPray ?
                            <Image style={{height: Height(10), width: Height(10)}}
                                   source={require('../../assets/not_Pray.jpeg')}
                                   resizeMode={'contain'}/>
                            :
                            <Image style={{height: Height(10), width: Height(10)}}
                                   source={require('../../assets/Pray_&_Follow_Button.png')}
                                   resizeMode={'contain'}/>
                        }
                    </TouchableOpacity> : <View
                        style={{
                            width: Width(15),
                            marginTop: Height(2),
                            marginHorizontal: Width(4),
                            zIndex: 100
                        }}
                    >

                    </View>
                }
            </TouchableOpacity>
        )
    }

    renderFooter = () => {
        console.log("==Footer Calling===", this.state.addMoreLoader)
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.addMoreLoader) return null;
        return (
            <ActivityIndicator
                style={{color: '#000'}}
            />
        );
    };

    noOfPrayerClick = (cases) => {
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'prayerlist', body: {case_token: cases.token, user_token: value,dataCount: 0}}
            new RequestService(params).callCreate().then(res => {
                console.log('pray response', res)
                if (res.message) {
                    Toast.show(res.message, Toast.LONG, Toast.BOTTOM)
                } else {
                    console.log("Prayer List===",res.users)
                    this.setState({prayerList:res.users,casesPrayer:cases} ,() => {
                        this.setState({modalPrayer:true})
                    })
                }
            }).catch(err => {
                console.log('pray error', err)
            })
        })
    }

    getNotificationSummary = () => {
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'notification/summary', body: {user_token: value}}
            new RequestService(params).callCreate().then(res => {
                console.log('notification response', res)
                this.setState({new_prays:res.new_prays,new_comments:res.new_comments,isVisiblePopup:true})
                setTimeout(() => {
                    this.setState({isVisiblePopup:false})
                }, 20000);
            }).catch(err => {
                console.log('notification error', err)
            })
        })

    }

    callPrayerApi = (cases) => {
        const personName = cases.person_name ? cases.person_name : cases.ownerName
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'casepray', body: {case_token: cases.token, user_token: value}}
            new RequestService(params).callCreate().then(res => {
                console.log('pray response', res)
                if (res.message === "Success") {
                    this.props.setPointsPage(res.new_balance)
                    let params = {url: 'caselist', body: {user_token: value}}
                    new RequestService(params).callCreate().then(res => {
                        if (res.caselist) {
                            let filterCases = [];
                            this.state.caselist.map((data, index) => {
                                if (data.token === cases.token) {
                                    data.isPray = true;
                                    data.total_prays = parseInt(cases.total_prays) + 1;
                                }
                                filterCases.push(data);
                            })
                            AsyncStorage.getItem('PrayerPointModal').then((value) => {
                                if(value == 'true') {
                                    this.setState({caselist: filterCases,modalPrayerApi:false,redeemPoints:res.points_awarded,
                                        name:personName})
                                }else{
                                    AsyncStorage.setItem('PrayerPointModal','true')
                                    this.setState({caselist: filterCases,modalPrayerApi:true,redeemPoints:res.points_awarded,
                                        redeemModal:true,
                                        name:personName})
                                }
                            })

                        } else {
                            this.setState({modalPrayerApi:false})
                        }
                    }).catch(err => {
                        this.setState({modalPrayerApi:false})
                    })
                } else {

                }
            }).catch(err => {
                console.log('pray error', err)
                this.setState({modalPrayerApi:false})
            })
        })
    }

    onCloseModal = () => {
        this.setState({redeemModal:false})
    }

    render() {
        const options = [
            <Text style={styles.casesActionSheet}>Active Cases</Text>,
            <Text style={styles.casesActionSheet}>Healed Cases</Text>,
            <Text style={styles.casesActionSheet}>Closed Cases</Text>,
            <Text style={styles.casesActionSheet}>Inactive Cases</Text>,
            <Text style={{color: '#000', fontSize: FontSize(16), alignSelf: 'center'}}>Cancel</Text>
        ]
        {/*<Text style={{color: '#000', fontSize: FontSize(16), alignSelf: 'center'}}>Cancel</Text>*/
        }

        const options1 = [
            <Text style={styles.casesActionSheet1}>Latest</Text>,
            <Text style={styles.casesActionSheet1}>Most Prayed</Text>,
            <Text style={styles.casesActionSheet1}>Least Prayed</Text>,
            <Text style={{color: '#000', fontSize: FontSize(16), alignSelf: 'center'}}>Cancel</Text>
        ]

        return (
            <View style={styles.container}>

                <ImageModal visible={this.state.modalVisisble} imageProfile={this.state.imageProfile} onSwipeDown={()=> {
                    this.setState({modalVisisble:false})
                }} onCloseModal={() => {
                    this.setState({modalVisisble:false})
                }}/>
                <PrayerModal visible={this.state.modalPrayer} indexCount={[1]} cases={this.state.casesPrayer} prayerList={this.state.prayerList} onCloseModal={() => {
                    this.setState({modalPrayer:false})
                }}/>
                <PrayerScreen visible={this.state.modalPrayerApi} cases={this.state.cases} onCloseModal={() => {
                    this.setState({modalPrayerApi:false})
                }} onPrayerApiClick={(cases) => {
                    this.callPrayerApi(cases)
                }} casedetail={false}/>
                <ReedemModal isOpen={this.state.redeemModal} onCloseModal={() => this.onCloseModal()}
                             points={this.state.redeemPoints} name={this.state.name}
                />
                <View style={{marginBottom: 90, flex: 1}}>
                    {this.state.search ? this.__renderNavigationBar1() : this.__renderNavigationBar()}
                    {this.state.case_filter !== 'alltab' ?
                        this.state.loading ? <Spinner/> :

                            <View style={{flex: 1}}>
                                <View key="navbar" style={{flexDirection: 'row', height: 40, alignItems: 'center'}}>
                                    <TouchableHighlight underlayColor='transparent' onPress={() => this.setState({
                                        case_filter: 'alltab',
                                        searchapi: '',
                                        sortText: 'Sort',
                                        filterText: 'Active',
                                        isFlatStop: false,
                                        offset: 0,
                                        caselist: [],
                                        filterType: '',
                                        search: false
                                    })}
                                                        style={{height: 25, width: 25, paddingLeft: 10}}>
                                        <Ionicons size={25} name="md-arrow-back" color="#000"/>
                                    </TouchableHighlight>
                                    <Text style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 15,
                                        paddingLeft: 15
                                    }}>Go back</Text>

                                </View>

                                {this.state.caselist.length > 0 &&
                                <FlatList
                                    style={{flex: 1}}
                                    data={this.state.caselist}
                                    ListFooterComponent={
                                        this.renderFooter()
                                    }
                                    onEndReachedThreshold={0.1}
                                    onEndReached={() => {
                                        if (!this.state.isFlatStop && !this.state.search && this.state.addMoreLoader == false) {
                                            console.log('reacEnd==', this.state.filterType)
                                            if (this.state.filterType == 'sort') {
                                                this.sortcases(this.state.case_filter)
                                            } else {
                                                this.filterCases(this.state.case_filter)
                                            }
                                        }
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={(item, index) => {
                                        return <CaseListItem cases={item} onNoofPrayerClick={this.noOfPrayerClick} onPrayClick={this.onPrayClick} isSearch={this.state.search}
                                                             searchWord={this.state.searchapi} onImageClick={(arrImages) => {
                                            this.setState({imageProfile:arrImages,modalVisisble:true})
                                        }
                                        }/>
                                    }
                                    }
                                />
                                }
                            </View> :
                        <TabView
                            navigationState={this.state}
                            onIndexChange={(index) => {
                                console.log("indexChnages ===")
                                this.tabViewIndexChange(index)}
                            }
                            onTabPress={(e) => {
                                console.log('tab presses=====', e)
                            }}
                            renderScene={SceneMap({
                                first: AllCaseTab,
                                second: MyCaseTab
                            })}
                            renderTabBar={this.state.loading ? '' : this.renderTabBar}
                            renderPager={(props) => <PagerPan {...props}/>}
                        />
                    }
                </View>
                <View style={{justifyContent: 'flex-end', height: 90, bottom: 0, position: 'absolute'}}>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={<View style={{flexDirection: 'row'}}><View style={{flexDirection: 'row', flex: 1}}><Text
                            style={{
                                flex: 1,
                                color: '#000',
                                fontSize: FontSize(14),
                                alignSelf: 'flex-start',
                                left: Width(6)
                            }}>Filter By</Text></View><TouchableOpacity onPress={() => this.clearFilter()} style={{
                            position: 'absolute',
                            zIndex: 99,
                            right: Width(6),
                            flexDirection: 'row',
                            flex: 1,
                            justifyContent: 'flex-end'
                        }}><Text style={{
                            flex: 1,
                            color: '#000',
                            fontSize: FontSize(14),
                            right: 0
                        }}>Clear</Text></TouchableOpacity></View>}
                        options={options}
                        destructiveButtonIndex={4}
                        onPress={(index) => {
                            if (index != undefined) {
                                this.filtercase(index)
                            }
                        }}
                        styles={{backgroundColor: '#FAFFFF'}}
                        optionHeight={180}
                        // cancelButtonIndex={4}
                    />
                    <ActionSheet
                        ref={o => this.ActionSheet1 = o}
                        title={<View style={{flexDirection: 'row'}}><View style={{flexDirection: 'row', flex: 1}}><Text
                            style={{
                                flex: 1,
                                color: '#000',
                                fontSize: FontSize(14),
                                alignSelf: 'flex-start',
                                left: Width(6)
                            }}>Sort By</Text></View><TouchableOpacity onPress={() => this.clearFilter()} style={{
                            position: 'absolute',
                            zIndex: 99,
                            right: Width(6),
                            flexDirection: 'row',
                            flex: 1,
                            justifyContent: 'flex-end'
                        }}><Text style={{
                            flex: 1,
                            color: '#000',
                            fontSize: FontSize(14),
                            right: 0
                        }}>Clear</Text></TouchableOpacity></View>}
                        options={options1}
                        destructiveButtonIndex={4}
                        onPress={(index) => {
                            if (index != undefined) {
                                this.sortcase(index)
                            }
                        }}
                        styles={{backgroundColor: '#FAFFFF'}}
                        optionHeight={150}
                    />
                    <View style={{flexDirection: 'row', height: 40}}>
                        <TouchableOpacity onPress={() => this.showActionSheet1()} style={{
                            width: '49.8%',
                            backgroundColor: '#FFF',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <Image source={require('../../assets/sort.png')}
                                   style={{height: 15, width: 15, marginRight: 10}}/>
                            <Text style={{fontSize: FontSize(16), color: '#000'}}>{this.state.sortText}</Text>
                        </TouchableOpacity>
                        <View style={{height: 40, width: 1, backgroundColor: '#ccc'}}></View>
                        <TouchableOpacity onPress={() => this.showActionSheet()} style={{
                            width: '49.8%',
                            backgroundColor: "#FFF",
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <Image source={require('../../assets/filter.png')}
                                   style={{height: 15, width: 15, marginRight: 10}}/>

                            <Text style={{fontSize: FontSize(16), color: '#000'}}>{this.state.filterText} Cases</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', height: 50}}>
                        <TouchableOpacity style={{
                            width: '50%',
                            backgroundColor: '#EE6B9A',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                                          onPress={() => {
                                              this.setState({index: 0, case_filter: 'alltab'})
                                          }}
                        ><Text style={{fontSize: FontSize(16), color: '#FFF'}}>Send Prayers</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SubmitCaseScreen')} style={{
                            width: '50%',
                            backgroundColor: "#CCC",
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}><Text style={{fontSize: FontSize(16), color: '#EE6B9A'}}>Request Healing</Text></TouchableOpacity>
                    </View>
                    <View style={{
                        position: 'absolute',
                        zIndex: 99,
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        backgroundColor: 'white',
                        alignSelf:'center',
                        bottom: 5
                    }}>
                        <TouchableOpacity onPress={() => navigator.navigate('MyCaseScreen')}>
                            <Image source={require('./../../assets/H_Logo_Bottom_Center.png')} style={{height: 40,
                                width: 40,}}/>
                        </TouchableOpacity>
                    </View>
                    {((this.state.new_prays > 0 || this.state.new_comments > 0) && this.state.isVisiblePopup )&&
                    <View style={{
                        position: 'absolute',
                        zIndex: 99,
                        height: 60,
                        width: (this.state.new_prays > 0 && this.state.new_comments > 0) ? (this.state.new_prays < 10 && this.state.new_comments < 10) ? 135 : 152 : 85,
                        borderRadius: 20,
                        backgroundColor: 'transparent',
                        alignSelf:'center',
                        bottom: 47,
                    }}>
                        <TouchableOpacity>
                            <Image source={require('./../../assets/Notification_Bubble.png')} style={{height: 60,
                                width: (this.state.new_prays > 0 && this.state.new_comments > 0) ? (this.state.new_prays < 10 && this.state.new_comments < 10) ? 135 : 152  : 85}} resizeMode={'stretch'}/>
                            <View style={{flex:1,flexDirection:'row',position:'absolute',top:9}}>
                                {this.state.new_prays > 0 &&
                                <TouchableOpacity style={{height:'100%',flexDirection:'row',marginLeft:12}}
                                                  onPress={() => { this.props.navigation.navigate('MyCaseScreen')}}>
                                    <Image source={require('./../../assets/PrayerSummary.png')} style={{height:30,width:30}} resizeMode={'contain'}/>
                                    <Text style={{fontSize:25,color:'white',marginLeft: 5,marginTop:-2}}>{this.state.new_prays}</Text>
                                </TouchableOpacity> }
                                {this.state.new_comments > 0 &&
                                <TouchableOpacity style={{height:'100%',flexDirection:'row', marginLeft:15}}
                                                  onPress={() => { this.props.navigation.navigate('MyCaseScreen')}}>
                                    <Image source={require('./../../assets/NotificationSummary.png')} style={{height:28,width:28}} />
                                    <Text style={{fontSize:25,color:'white',marginLeft: 5,marginTop:-2}}>{this.state.new_comments}</Text>
                                </TouchableOpacity> }
                            </View>
                        </TouchableOpacity>
                    </View>}

                </View>
            </View>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({setFollowStatus,setNotifiationPage,shareAction,setFilterStatus,setPointsPage}, dispatch)
    }
}

function mapStateToProps(state) {
    console.log("===mamadasd",state)
    return{
        isFollowData: state.followClick.isFollowTab,
        isPrayerClick: state.prayerclick.isPrayerClick,
        isSearch:state.followClick.isSearch,
        isFilter:state.followClick.isFilter,
        searchWord:state.followClick.searchWord,
        notificationPage: state.notificationPageManage.isCaseToken,
        isShare: state.shareData.isShare,
        filterData:state.filterData,
        points:state.points.points
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomeScreen)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        right: Width(5),
        bottom: 0,
        height: Layout.HEADER_HEIGHT,
        width: Layout.HEADER_HEIGHT,
        justifyContent: 'center',
        zIndex: 10,
    },
    navigationBarRightButton1: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/ 2.5 : 15,
        right: 15,
        height: 30,
        width: 30,
        alignItems:'center',
        justifyContent:'center'
        // bottom: 0,
        // height: Layout.HEADER_HEIGHT,
        // width: Layout.HEADER_HEIGHT,
        // justifyContent: 'center',
        // zIndex: 10,
    },
    navigationBarLeftButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/5 : 0,
        left: Width(4),
        bottom: 0,
        height: Layout.HEADER_HEIGHT,
        width: Layout.HEADER_HEIGHT,
        justifyContent: 'center',
        zIndex: 2,
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
    casesActionSheet: {color: '#000', fontSize: FontSize(16), alignSelf: 'flex-end', right: Width(6)},
    casesActionSheet1: {color: '#000', fontSize: FontSize(16), alignSelf: 'flex-start', left: Width(6)},
});
