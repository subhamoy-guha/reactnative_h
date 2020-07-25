import React, {Component} from 'react';
import {
    Platform,
    Animated,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    TouchableWithoutFeedback,
    View,
    ImageBackground,
    Image,
    TextInput,
    Text,
    Switch, AsyncStorage,
    BackHandler, Alert, KeyboardAvoidingView, Modal, Share
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Height, Width, FontSize, isIphoneX, isIphone} from './../constants/dimensions'
import {RotationGestureHandler, ScrollView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Layout from './../constants/Layout'
import {Collapse, CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ToggleSwitch from 'toggle-switch-react-native'
import RequestService from './../services/RequestService';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleToast from 'react-native-simple-toast';
import {Spinner} from "./../component/spinner";
import navigator from "../services/navigator";
import Moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setFollowStatus } from '../Actions/setFollow';
import { setMyCaselistTab } from '../Actions/setMyCaselistTab';
import {setNotifiationPage} from '../Actions/setNotificationPage';
import {shareAction} from "../Actions/shareAction";
import {setPointsPage} from "../Actions/setPoint";
import {fetchPrayClick} from '../Actions/fetchPrayClick'
import ImageViewer from 'react-native-image-zoom-viewer';
import Toast from "react-native-simple-toast";
import PrayerModal from '../component/prayerModal';
import PrayerScreen from '../component/PrayerScreen';
import PointsModal from '../component/PointsModal';
import ReedemModal from '../component/ReedemPointsAlert';
import {SHARE_MESSAGE,SHARE_TITLE,SHARE_URL} from '../constants/config'
import redeem from "../../assets/Reward_Points_Icon.png";
import PointImageModal from "../component/pointsImageModal";

class ProfileScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            routes: [
                {key: 'first', title: 'All Cases'},
                {key: 'second', title: "Cases I've Prayed for (5)"}
            ],
            casedetails: {},
            caseImages: [],
            commentlist: [],
            isPray:false,
            poststatus_list: [],
            isOwner: false,
            case_closed: false,
            case_healed: false,
            loading: true,
            comment:'',
            postStatus:'',
            isMySelf:false,
            offset:0,
            offsetUpdate:0,
            isEndComment:false,
            isEndUpdate:false,
            modalVisisble:false,
            imageProfile:[],
            isProfile:false,
            images:[],
            indexImage:0,
            modalPrayer: false,
            prayerList: {},
            modalPrayerApi : false,
            pointsModal: false,
            redeemModal:false,
            cases:{},
            casesPrayer:{},
            redeemPoints:0,
            points:[],
            pointImageModal:false,
            opacity: new Animated.Value(0),
            isComment:false,
        };
        this.user_token = ''
        console.log('navigation', this.props.navigation.state.params)
    }

    componentWillMount() {
        AsyncStorage.getItem('token').then((value) => {
            this.user_token = value;
        })
        this.getPoints()
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

    renderModal = () => {
        return(
            <Modal animationType = {"none"} transparent = {true}
                   visible = {this.state.modalVisisble}
                   onRequestClose = {() => {
                       this.setState({modalVisisble:false})
                   } }>
                {this.state.isProfile ?
                    <ImageViewer index={this.state.indexImage} imageUrls={this.state.imageProfile} enableImageZoom={true} enableSwipeDown={true} onSwipeDown={() => this.setState({modalVisisble:false,isProfile:false})}/>
                    :
                    <ImageViewer index={this.state.indexImage} imageUrls={this.state.images} enableImageZoom={true} enableSwipeDown={true} onSwipeDown={() => this.setState({modalVisisble:false})}/>
                }

            </Modal>
        )

    }

    getCommentList = () => {
        let self = this
        const {offset,commentlist} = this.state
        AsyncStorage.getItem('token').then((value) => {
            let params1 = {url: 'commentlist', body: {user_token: value, case_token: this.state.casedetails.token, dataCount:offset}}
            new RequestService(params1).callCreate().then(res => {
                console.log('commentlist', res)
                if (res.comment) {
                    let newoffset = offset +  1
                    self.setState({commentlist: [...commentlist,...res.comment], offset:newoffset})
                } else {

                }
            }).catch(err => {
                console.log('commentlist', err)
                //alert(JSON.stringify(err))
            })
        })
    }

    getPostStatusList = () => {
        let self = this
        const {offsetUpdate,poststatus_list} = this.state
        AsyncStorage.getItem('token').then((value) => {
            let params1 = {url: 'poststatus_list', body: {user_token: value, case_token: this.state.casedetails.token, dataCount:offsetUpdate}}
            new RequestService(params1).callCreate().then(res => {
                console.log('posttttttt', res)
                if (res.post_status_list.length > 0) {
                    let newoffset = offsetUpdate +  1
                    self.setState({poststatus_list: [...poststatus_list,...res.post_status_list],offsetUpdate:newoffset})
                    this.getPostStatusList()
                } else {

                }
            }).catch(err => {
                console.log('postttt', err)
                //alert(JSON.stringify(err))
            })
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.backToNavigate()
        return true;
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        AsyncStorage.setItem('casetoken', this.props.navigation.state.params.token)
        this.getCaseDetails()
    }

    getCaseDetails = () => {
        let self = this
        AsyncStorage.getItem('token').then((value) => {
            const obj = {user_token: value, case_token: global.case_token};
            console.log("case detail==",obj);
            let params = {
                url: 'casedetails',
                body: {user_token: value, case_token: this.props.navigation.state.params.token}
            }
            new RequestService(params).callCreate().then(res => {
                console.log('case detail', res)
                if (res.status == false) {
                    this.setState({
                        loading:false
                    })
                    SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                } else{
                    if (res.caseImages) {
                        //alert(JSON.stringify(res.casedetails))
                        console.log("All case Images",res.caseImages)
                        let healstatus = false;
                        let closestatus = false;
                        if (res.casedetails[0].status === 'healed') {
                            healstatus = true;
                        } else if (res.casedetails[0].status === 'closed') {
                            closestatus = true;
                        }
                        var newArrImages = []
                        const caseImages = res.caseImages
                        if(caseImages.length > 0 && caseImages[0].case_images != "NULL"){
                            const dict = {url:caseImages[0].case_images}
                            newArrImages.push(dict)
                        }
                        if(caseImages.length > 1 && caseImages[1].case_images != "NULL"){
                            const dict = {url:caseImages[1].case_images}
                            newArrImages.push(dict)
                        }
                        if(caseImages.length > 2 && caseImages[2].case_images != "NULL"){
                            const dict = {url:caseImages[2].case_images}
                            newArrImages.push(dict)
                        }
                        if(caseImages.length > 3 && caseImages[3].case_images != "NULL"){
                            const dict = {url:caseImages[3].case_images}
                            newArrImages.push(dict)
                        }

                        const personImage =  res.healing_for == "myself" ? res.casedetails[0].ownerPhoto ? res.casedetails[0].ownerPhoto : res.casedetails[0].person_image :  res.casedetails[0].person_image ? res.casedetails[0].person_image : res.casedetails[0].ownerPhoto
                        var profileImage = []
                        if(personImage){
                            const dict = {url:personImage}
                            profileImage.push(dict)
                        }else{
                            const dict = {url:'http://profilepicturesdp.com/wp-content/uploads/2018/07/mustache-dp-2-1.jpg'}
                            profileImage.push(dict)
                        }

                        console.log("new Arr====",newArrImages)
                        self.setState({
                            casedetails: res.casedetails[0],
                            isMySelf:res.casedetails[0].healing_for == "myself" ? true : false,
                            caseImages: res.caseImages,
                            isOwner: res.caseOwner === "Yes" && true,
                            case_closed: closestatus,
                            case_healed: healstatus,
                            loading: false,
                            caseStatus: res.casedetails[0].status === 'healed' ? 'healed!' : res.casedetails[0].status,
                            isPray:res.casePrayed == "Yes" && true,
                            images: newArrImages,
                            imageProfile:profileImage
                        }, () => {
                            this.getCommentList()
                            this.getPostStatusList()
                        })

                    }
                }
            }).catch(err => {
                this.setState({loading: false})
            })
        })
    }

    comment = (comment) => {

        if (comment.length > 0){
            AsyncStorage.getItem('token').then((value) => {
                let self = this
                let params1 = {
                    url: 'comment',
                    body: {user_token: value, case_token: global.case_token, comment: comment}
                }
                new RequestService(params1).callCreate().then(res => {
                    console.log("Comment res==",res)
                    if (res.message == 'Success') {
                        this.props.setPointsPage(res.new_balance)
                        AsyncStorage.getItem('commentModal').then((value) => {
                            if(value == 'true') {
                                this.onLoad()
                                AsyncStorage.setItem('commentModal','true')
                                this.setState({redeemPoints:res.points_awarded,redeemModal:false,offset:0,commentlist: []}, () => {
                                    self.getCommentList()
                                })
                                // this.setState({redeemPoints:res.points_awarded,pointImageModal:false,offset:0,commentlist: []}, () => {
                                //     self.getCommentList()
                                //     this.timeoutHandle = setTimeout(()=>{
                                //         // Add your logic for the transition
                                //         this.setState({ pointImageModal: false })
                                //     }, 1000);
                                // })
                            }else{
                                AsyncStorage.setItem('commentModal','true')
                                this.setState({redeemPoints:res.points_awarded,redeemModal:true,offset:0,commentlist: [], isComment:true}, () => {
                                    self.getCommentList()
                                })
                            }
                        })

                    } else {
                        SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                    }
                }).catch(err => {
                    //alert(JSON.stringify(err))
                })
            })
        }else{
            SimpleToast.show('Comment cannot be blank',SimpleToast.LONG, SimpleToast.BOTTOM)
        }

    }

    poststatus = (postStatus) => {
        if(postStatus.length > 0){
            AsyncStorage.getItem('token').then((value) => {
                let self = this
                let params1 = {
                    url: 'poststatus',
                    body: {user_token: value, case_token: global.case_token, postStatus: postStatus}
                }
                new RequestService(params1).callCreate().then(res => {
                    console.log("Comment Response ===",res)
                    if (res.message == 'Success') {
                        this.setState({offsetUpdate:0,poststatus_list:[]},() => {
                            self.getPostStatusList()
                        })
                    } else {
                        SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                    }
                }).catch(err => {
                    //alert(JSON.stringify(err))
                })
            })
        }else{
            SimpleToast.show('Update cannot be blank',SimpleToast.LONG, SimpleToast.BOTTOM)
        }

    }

    _handleToggleMenu = () => {
        this.props.navigation.openDrawer();

    }

    _keyExtractor = (item, index) => item.comment;

    _postkeyExtractor = (item, index) => item.id;

    _renderItem = ({item}) => (
        <View style={{
            marginTop: Height(3),
            flexDirection: 'row',
            borderRadius: 3,
            borderColor: '#CCC',
            borderWidth: 1,
            marginHorizontal: Width(2),
            backgroundColor:'#F6F7F9'
        }}>
            <View style={{margin: '3%'}}>
                <Image
                    source={{uri: item.thumbnail ? item.thumbnail : item.photo ? item.photo : 'http://profilepicturesdp.com/wp-content/uploads/2018/07/mustache-dp-2-1.jpg'}}
                    style={{height: 50, width: 50, borderRadius: 25}}/>

            </View>
            <View style={{marginVertical: Height(3),flex:1}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontWeight:'bold',marginBottom:5,width:150}} numberOfLines={1}>{item.name}</Text>
                    <Text style={{color:'grey',marginBottom:5,marginLeft:3,fontSize:10,}}>{Moment(item.created_at).format('DD MMM YYYY hh:mm a')}</Text>
                </View>
                <View><Text>{item.comment}</Text></View>
            </View>
        </View>
    );

    changeDate = (date) => {
        return Moment(date).format('DD MMM YYYY')
    }

    _postrenderItem = ({item}) => (
        <View style={{marginTop: Height(3), marginHorizontal: Width(5)}}>
            <Text>{this.changeDate(item.created_at.slice(0, 10))}</Text>
            <Text style={{color:'#000'}}>{item.poststatus}</Text>
        </View>
    );


    onLoad = () =>   {
        Animated.timing(this.state.opacity,{
            toValue:1,
            duration:5000,
            useNativeDriver: true,
        }).start();
    }

    __renderNavigationBar() {
        const{caseStatus} = this.state
        return (
            <View key="navbar" style={styles.navigationBarContainer}>
                <TouchableHighlight underlayColor='transparent' onPress={this._handleToggleMenu}
                                    style={styles.navigationBarLeftButton}>
                    <Ionicons size={35} name="ios-menu" color="#EE6B9A"/>
                </TouchableHighlight>
                <View style={styles.navigationBarTitleContainer}>
                    <TouchableWithoutFeedback>
                        <View style={{flexDirection: 'row'}}>
                            <Text>Details of this Case</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {((this.state.isOwner && caseStatus == 'active') || (this.state.isOwner && caseStatus == 'inactive')) &&
                <TouchableHighlight underlayColor='transparent' onPress={() => {navigator.navigate('EditCaseScreen',
                    {case:this.state.casedetails,caseImages:this.state.caseImages,casetoken:this.state.casedetails.token,
                        screen:this.props.navigation.state.params.root,lastparams:this.props.navigation.state.params})}}
                                    style={styles.navigationBarRightButton}>
                    <Text style={{color: "#EE6B9A"}}>EDIT</Text>
                </TouchableHighlight>
                }
                <TouchableHighlight onPress={() => this.setState({search: true, autofocus: true})}
                                    underlayColor='transparent'
                                    style={styles.navigationBarRightButton1}>
                    <Animated.Image onLoad={this.onLoad} source={redeem} style={{height:30,width:30,opacity:this.state.opacity,
                    transform:[
                        {
                            scale:this.state.opacity.interpolate({
                                inputRange:[0,1],
                                outputRange:[0.85, 1]
                            })
                        }
                    ]
                    }} />
                </TouchableHighlight>
                <TouchableOpacity style={styles.navigationBarRightButton1} onPress={() => navigator.navigate('MyPointScreen')}>
                    <Text style={{fontSize:12,color:'pink',fontWeight:'bold'}}>{this.props.points}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    onHealedCase = (value) => {
        AsyncStorage.getItem('token').then((value2) => {
            if (value) {

                let formdata = new FormData();
                formdata.append("user_token", value2);
                formdata.append("case_status", 'healed');
                formdata.append("case_token", this.state.casedetails.token);
                console.log("healed fromdata==",formdata)

                fetch('https://cms.healingg.com/api/case_mark_as_healed', {
                    method: 'post',
                    body: formdata,
                    headers: {
                        //'Content-Type': 'application/x-www-form-urlencoded',
                        // 'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => response.json())
                    .then((responseData) => {
                        console.log('password_reset res', responseData);
                        if (responseData.message === "Success") {
                            this.setState({case_healed: value,caseStatus:'healed!'})
                        } else {
                            SimpleToast.show(responseData.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                        }

                    }).catch(err => {
                    console.log('case error', err)
                    SimpleToast.show(responseData.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                })


                // const obj = {user_token: value, case_status: 'healed', case_token: }
                // console.log('obj', obj)
                // let params = {url: 'case_mark_as_healed', body: obj}
                // new RequestService(params).callCreate().then(res => {
                //     console.log('res case', res)
                //     if (res.message === "Success") {
                //         this.setState({case_healed: value})
                //     } else {
                //         SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                //     }
                // }).catch(err => {
                //     console.log('case error', err)
                //     alert(JSON.stringify(err))
                // })
            }
        })
    }

    onPrayClick = (cases) => {
        console.log('********************************',cases);
        if(!this.state.isPray) {
            this.setState({cases: cases}, () => {
                this.setState({modalPrayerApi: true})
            })
        }
    }

    onCloseCase = (value) => {
        AsyncStorage.getItem('token').then((value2) => {
            if (value) {
                let formdata = new FormData();
                formdata.append("user_token", value2);
                formdata.append("case_status", 'closed');
                formdata.append("case_token", this.state.casedetails.token);
                console.log("close fromdata==",formdata)

                fetch('https://cms.healingg.com/api/case_mark_as_healed', {
                    method: 'post',
                    body: formdata,
                    headers: {
                        //'Content-Type': 'application/x-www-form-urlencoded',
                        // 'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => response.json())
                    .then((responseData) => {
                        console.log('res case', responseData)
                        if (responseData.message === "Success") {
                            this.setState({case_closed: value,caseStatus:'closed'})
                        } else {
                            SimpleToast.show(responseData.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                        }

                    }).catch(err => {
                    console.log('case error', err)
                    SimpleToast.show(responseData.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                })
                // const obj = {user_token: value, case_status: 'closed', case_token: global.case_token}
                // console.log('obj', obj)
                // let params = {url: 'case_mark_as_healed', body: obj}
                // new RequestService(params).callCreate().then(res => {
                //     console.log('res case', res)
                //     if (res.message === "Success") {
                //         this.setState({case_closed: value})
                //     } else {
                //         SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                //     }
                // }).catch(err => {
                //     console.log('case error', err)
                //     //alert(JSON.stringify(err))
                // })
            }
        })
    }

    onActiveCase = (value) => {
        AsyncStorage.getItem('token').then((value2) => {
            if (value) {
                let formdata = new FormData();
                formdata.append("user_token", value2);
                formdata.append("case_status", 'active');
                formdata.append("case_token", this.state.casedetails.token);

                fetch('https://cms.healingg.com/api/case_mark_as_healed', {
                    method: 'post',
                    body: formdata,
                    headers: {
                        //'Content-Type': 'application/x-www-form-urlencoded',
                        // 'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => response.json())
                    .then((responseData) => {
                        console.log('res case', responseData)
                        if (responseData.message === "Success") {
                            this.setState({case_closed: false ,caseStatus:'active',case_healed:false})
                        } else {
                            SimpleToast.show(responseData.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                        }

                    }).catch(err => {
                    console.log('case error', err)
                    SimpleToast.show(responseData.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                })
                // const obj = {user_token: value, case_status: 'closed', case_token: global.case_token}
                // console.log('obj', obj)
                // let params = {url: 'case_mark_as_healed', body: obj}
                // new RequestService(params).callCreate().then(res => {
                //     console.log('res case', res)
                //     if (res.message === "Success") {
                //         this.setState({case_closed: value})
                //     } else {
                //         SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                //     }
                // }).catch(err => {
                //     console.log('case error', err)
                //     //alert(JSON.stringify(err))
                // })
            }
        })
    }

    alertMessage = (text,type) => {
        Alert.alert(
            'Healingg',
            text,
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => {
                        if(type == 'reopen'){
                            this.onActiveCase(true)
                        }else if(type == 'close'){
                            this.onCloseCase(true)
                        }else{
                            this.onHealedCase(true)
                        }
                    }},
            ],
            { cancelable: false }
        )
    }

    changeTextOnStatus = () => {
        const{caseStatus,casedetails} = this.state
        console.log("case status===",caseStatus)
        switch(caseStatus){
            case 'active':
                return "This case is active."
            case 'healed!':
                return "This case has been marked as healed by " + casedetails.ownerName
            case 'closed':
                return "This case has been closed by " + casedetails.ownerName
            case 'inactive':
                return "This case has not been updated since the last 3 months."
            default:
                return " "
        }
    }

    backToNavigate = () => {
        if(this.props.navigation.state.params.root == 'home'){
            // if(this.props.navigation.state.params.isFilter == true){
            //     this.props.setFollowStatus(false, false, '',true)
            // }
            // if(this.props.navigation.state.params.isFollowCases == true) {
            //     if(this.props.navigation.state.params.isFilter == true){
            //         this.props.setFollowStatus(true, false, '',true)
            //     }else{
            //         this.props.setFollowStatus(true, false, '',false)
            //     }
            // }
            // if(this.props.navigation.state.params.isSearch == true){
            //     this.props.setFollowStatus(false,true,this.props.navigation.state.params.searchWord,false)
            // }
            this.props.navigation.navigate('Home')
        }else{
            console.log("Tab===",this.props.navigation.state.params.tab)
            // if(this.props.navigation.state.params.tab){
            //     this.props.setMyCaselistTab(this.props.navigation.state.params.tab,true)
            // }
            this.props.navigation.navigate('MyCaseScreen')
        }
    }

    managerImage = () => {
        const {caseImages} = this.state
        var arrImage = []
        if(caseImages.length > 0 && caseImages[0].case_images != "NULL"){
            arrImage.push(caseImages[0].case_images)
        }
        if(caseImages.length > 1 && caseImages[1].case_images != "NULL"){
            arrImage.push(caseImages[1].case_images)
        }
        if(caseImages.length > 2 && caseImages[2].case_images != "NULL"){
            arrImage.push(caseImages[2].case_images)
        }
        if(caseImages.length > 3 && caseImages[3].case_images != "NULL"){
            arrImage.push(caseImages[3].case_images)
        }

        if(arrImage.length == 4){
            return(
                <View style={{
                    marginTop: Height(4),
                    borderRadius: 2,
                    borderColor: '#ccc',
                    borderWidth: 1,
                    marginHorizontal: Width(2),
                    backgroundColor:'#f5f6fa'
                }}>
                    <Text style={{alignSelf: 'center'}}>Additional pictures</Text>
                    <View style={{
                        flexDirection: 'row',
                        marginVertical: Height(2.5),
                        marginLeft: '5%',
                        marginRight: '5%',
                        justifyContent: 'space-evenly',
                    }}>
                        <TouchableOpacity style={{
                            height: Height(9),
                            width: Height(9),
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',

                        }} onPress={() => {this.setState({modalVisisble:true,indexImage:0,isProfile:false})}}>
                            <Image
                                source={{uri: this.state.caseImages.length > 0 && this.state.caseImages[0].thumbnail ? this.state.caseImages[0].thumbnail : this.state.caseImages[0].case_images}}
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            height: Height(9),
                            width: Height(9),
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} onPress={() => {this.setState({modalVisisble:true,indexImage:1,isProfile:false})}}>
                            <Image
                                source={{uri: this.state.caseImages.length > 1 && this.state.caseImages[1].thumbnail ? this.state.caseImages[1].thumbnail : this.state.caseImages[1].case_images}}
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            height: Height(9),
                            width: Height(9),
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} onPress={() => {this.setState({modalVisisble:true,indexImage:2,isProfile:false})}}>
                            <Image
                                source={{uri: this.state.caseImages.length > 2 && this.state.caseImages[2].thumbnail ? this.state.caseImages[2].thumbnail : this.state.caseImages[2].case_images}}
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            height: Height(9),
                            width: Height(9),
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} onPress={() => {this.setState({modalVisisble:true,indexImage:3,isProfile:false})}}>
                            <Image
                                source={{uri: this.state.caseImages.length > 3 && this.state.caseImages[3].thumbnail ? this.state.caseImages[3].thumbnail : this.state.caseImages[3].case_images}}
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
            )
        }
        else if(arrImage.length == 3){
            return(
                <View style={{
                    marginTop: Height(4),
                    borderRadius: 2,
                    borderColor: '#ccc',
                    borderWidth: 1,
                    marginHorizontal: Width(2),
                    backgroundColor:'#f5f6fa'
                }}>
                    <Text style={{alignSelf: 'center'}}>Additional pictures</Text>
                    <View style={{
                        flexDirection: 'row',
                        marginVertical: Height(2.5),
                        marginLeft: '15%',
                        marginRight: '15%',
                        justifyContent: 'space-evenly',
                    }}>
                        <TouchableOpacity style={{
                            height: Height(9),
                            width: Height(9),
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',

                        }} onPress={() => {this.setState({modalVisisble:true,indexImage:0,isProfile:false})}}>
                            <Image
                                source={{uri: this.state.caseImages.length > 0 && this.state.caseImages[0].thumbnail ? this.state.caseImages[0].thumbnail : this.state.caseImages[0].case_images}}
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            height: Height(9),
                            width: Height(9),
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',

                        }} onPress={() => {this.setState({modalVisisble:true,indexImage:1,isProfile:false})}}>
                            <Image
                                source={{uri:this.state.caseImages.length > 1 && this.state.caseImages[1].thumbnail ? this.state.caseImages[1].thumbnail : this.state.caseImages[1].case_images}}
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            height: Height(9),
                            width: Height(9),
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',

                        }} onPress={() => {this.setState({modalVisisble:true,indexImage:2,isProfile:false})}}>
                            <Image
                                source={{uri: this.state.caseImages.length > 2 && this.state.caseImages[2].thumbnail ? this.state.caseImages[2].thumbnail : this.state.caseImages[2].case_images}}
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else if(arrImage.length == 2){
            return(
                <View style={{
                    marginTop: Height(4),
                    borderRadius: 2,
                    borderColor: '#ccc',
                    borderWidth: 1,
                    marginHorizontal: Width(2),
                    backgroundColor:'#f5f6fa'
                }}>
                    <Text style={{alignSelf: 'center'}}>Additional pictures</Text>
                    <View style={{
                        flexDirection: 'row',
                        marginVertical: Height(2.5),
                        marginLeft: '5%',
                        marginRight: '5%',
                        justifyContent: 'space-evenly',
                    }}>
                        <View style={{
                            height: Height(9),
                            width: Height(9),
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}>
                            <Image
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </View>
                        <TouchableOpacity style={{
                            height: Height(9),
                            width: Height(9),
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',

                        }} onPress={() => {this.setState({modalVisisble:true,indexImage:0,isProfile:false})}}>
                            <Image
                                source={{uri: this.state.caseImages.length > 0 && this.state.caseImages[0].thumbnail ? this.state.caseImages[0].thumbnail : this.state.caseImages[0].case_images}}
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            height: Height(9),
                            width: Height(9),
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',

                        }} onPress={() => {this.setState({modalVisisble:true,indexImage:1,isProfile:false})}}>
                            <Image
                                source={{uri: this.state.caseImages.length > 1 && this.state.caseImages[1].thumbnail ? this.state.caseImages[1].thumbnail : this.state.caseImages[1].case_images}}
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </TouchableOpacity>
                        <View style={{
                            height: Height(9),
                            width: Height(9),
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}>
                            <Image
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </View>
                    </View>
                </View>
            )
        }
        else if(arrImage.length == 1){
            return(
                <View style={{
                    marginTop: Height(4),
                    borderRadius: 2,
                    borderColor: '#ccc',
                    borderWidth: 1,
                    marginHorizontal: Width(2),
                    backgroundColor:'#f5f6fa'
                }}>
                    <Text style={{alignSelf: 'center'}}>Additional pictures</Text>
                    <View style={{
                        flexDirection: 'row',
                        marginVertical: Height(2.5),
                        marginLeft: '5%',
                        marginRight: '5%',
                        justifyContent: 'space-evenly',
                    }}>
                        <TouchableOpacity style={{
                            height: Height(9),
                            width: Height(9),
                            borderColor: '#000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',

                        }} onPress={() => {this.setState({modalVisisble:true,indexImage:0,isProfile:false})}}>
                            <Image
                                source={{uri: this.state.caseImages.length > 0 && this.state.caseImages[0].thumbnail ? this.state.caseImages[0].thumbnail : this.state.caseImages[0].case_images}}
                                style={{
                                    height: Height(9),
                                    width: Height(9),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                resizeMode={'stretch'}
                                borderRadius={8}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

    }

    noOfPrayerClick = (cases) => {
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'prayerlist', body: {case_token: this.props.navigation.state.params.token, user_token: value,dataCount: 0}}
            new RequestService(params).callCreate().then(res => {
                console.log('pray response', res)
                if (res.message) {
                    Toast.show(res.message, Toast.LONG, Toast.BOTTOM)
                } else {
                    console.log("Prayer List===",res.users)
                    this.setState({prayerList:res.users,casesPrayer:this.props.navigation.state.params} ,() => {
                        this.setState({modalPrayer:true})
                    })
                }
            }).catch(err => {
                console.log('pray error', err)
                alert(JSON.stringify(err))
            })
        })
    }

    callPrayerApi = (cases) => {
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'casepray', body: {case_token: cases.token, user_token: value}}
            console.log("prayer params===", params)
            new RequestService(params).callCreate().then(res => {
                console.log('pray response', res)
                if (res.message === "Success") {
                    this.props.setPointsPage(res.new_balance)
                    AsyncStorage.getItem('PrayerPointModal').then((value) => {
                        if(value == 'true') {
                            this.setState({isPray:true,modalPrayerApi:false,redeemPoints:res.points_awarded,pointImageModal:false},() => {
                                this.timeoutHandle = setTimeout(()=>{
                                    // Add your logic for the transition
                                    this.setState({ pointImageModal: false })
                                }, 1000);
                            })
                        }else{
                            AsyncStorage.setItem('PrayerPointModal','true')
                            this.setState({isPray:true,modalPrayerApi:true,redeemPoints:res.points_awarded,redeemModal:true})
                        }
                    })
                    this.getCaseDetails()
                    this.props.fetchPrayClick(true,cases.token)
                } else {
                    this.setState({modalPrayerApi:false})
                }
            }).catch(err => {
                console.log('pray error', err)
                this.setState({modalPrayerApi:false})
                //alert(JSON.stringify(err))
            })
        })
    }

    boostApiCall = (cases,id) => {
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'boost_case', body: {case_token: cases.token, user_token: value,points:id}}
            new RequestService(params).callCreate().then(res => {
                console.log('pray response', res)
                debugger;
                if (res.message === "Success") {
                    this.setState({pointsModal:false})
                    this.props.setPointsPage(res.new_points)
                    this.getCaseDetails()
                } else {
                    this.setState({pointsModal:false})
                }
            }).catch(err => {
                console.log('pray error', err)
                this.setState({pointsModal:false})
            })
        })
    }

    onSendPrayer = (cases) => {
        navigator.navigate('UserCaselistScreen',{token:cases.customer_token})
    }

    onCloseModal = () => {
        this.setState({redeemModal:false,isComment:false})
    }

    getPoints = () => {
        AsyncStorage.getItem('token').then((value) => {
            if (value) {
                let params = {url: 'boost_list', body: {user_token: value}}
                new RequestService(params).callCreate().then(res => {
                    if(res.activities){
                        this.setState({points:res.activities})
                    }
                }).catch(err => {
                    console.log("history error==",err)
                })
            }
        })
    }

    render() {
        const casedetails = this.state.casedetails
        const caseStatus = casedetails.status === 'healed' ? 'healed!' : casedetails.status
        console.log('this.props.navigation.goBack()', this.state.casedetails);
        console.log('this.props.navigation.goBack()', this.state.caseImages.length > 0 && this.state.caseImages[0].case_images);
        const countryName = casedetails.country ? casedetails.country : casedetails.ownerCountry
        const personName = casedetails.person_name ? casedetails.person_name : casedetails.ownerName
        const personImage =  this.state.isMySelf ? casedetails.ownerPhoto ? casedetails.ownerPhoto : casedetails.person_image :  casedetails.person_image ? casedetails.person_image : casedetails.ownerPhoto
        const thumbnail = this.state.isMySelf ? casedetails.ownerThumbnail : casedetails.thumbnail
        const personGender = this.state.isMySelf ? casedetails.ownerGender : casedetails.gender
        const age =  (casedetails.isGroup == "yes") ? "Group" : this.state.isMySelf ?  casedetails.ownerAge : casedetails.age
        const city = this.state.isMySelf ? casedetails.ownerCity : casedetails.caseCity
        if (casedetails) {
            return (
                <View style={styles.container}>
                    <PrayerModal visible={this.state.modalPrayer} indexCount={[1]} cases={this.state.casesPrayer} prayerList={this.state.prayerList} onCloseModal={() => {
                        this.setState({modalPrayer:false})
                    }} onSendPrayerPress={(cases) => {
                        this.onSendPrayer(cases)
                    }}/>
                    <PrayerScreen visible={this.state.modalPrayerApi} cases={this.state.cases} onCloseModal={() => {
                        this.setState({modalPrayerApi:false})
                    }} onPrayerApiClick={(cases) => {
                        this.callPrayerApi(cases)
                    }} casedetail={true} />
                    <PointsModal visible={this.state.pointsModal} pointData={this.state.points} points={this.props.points}
                                 cases={casedetails}  onCloseModal={() => {
                        this.setState({pointsModal:false})
                    }} onBoostPress={(cases,id) => this.boostApiCall(cases,id)}/>
                    <ReedemModal isOpen={this.state.redeemModal} onCloseModal={() => this.onCloseModal()}
                                 points={this.state.redeemPoints} name={personName} isComment={this.state.isComment}
                    />
                    <PointImageModal visible={this.state.pointImageModal} />
                    {this.__renderNavigationBar()}
                    {this.renderModal()}
                    {this.state.loading ? <Spinner/> :
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1}}>
                            <ScrollView>
                                {(casedetails.boosted && caseStatus == 'active') ?
                                <View style = {{alignItems: 'center',height:30,backgroundColor:'#d1266b',justifyContent:'center'}}>
                                    <Text style={{color: 'white'}}>This case is boosted to receive more prayers </Text>
                                </View> : <View/>}
                                <View style={{flex: 1, height: Height(18), backgroundColor: '#F6C4D5', width: '100%',paddingTop:Height(1.5)}}>

                                    <View style={{flexDirection: 'row',width:'100%', alignItems: 'center',
                                        justifyContent: 'center'}}>
                                        <View  style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <TouchableOpacity onPress={() => this.noOfPrayerClick()}>
                                                <Text
                                                    style={{
                                                        color: 'red',
                                                        fontSize: 24,
                                                        fontStyle: 'italic'
                                                    }}>
                                                    {casedetails.total_prays > 0 ? casedetails.total_prays : "0"}
                                                </Text>
                                            </TouchableOpacity>
                                            <View>
                                                <Text
                                                    style={{alignSelf: 'center', fontStyle: 'italic'}}>
                                                    {casedetails.total_prays > 1 ? " prayers received" : " prayer received"}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            this.backToNavigate()
                                        }} style={{flexDirection: 'row', marginTop: Height(1),position:'absolute',left:0}}>
                                            <Ionicons style={{paddingLeft: Width(4)}}
                                                      name="ios-arrow-back" size={25}/>
                                            <Text
                                                style={{paddingLeft: Width(1), marginTop: Height(0.2)}}>Back</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{marginTop:Height(2.5),alignItems:'center',justifyContent:'center',flexDirection:'row',flex:1,width:'100%',bottom: Height(8)}}>
                                    <TouchableOpacity style={{
                                        height: Height(20),
                                        width: Height(20),
                                        borderRadius: 2,
                                        borderWidth: 2,
                                        borderColor: '#EE6B9A',
                                        overflow: 'hidden',
                                        zIndex: 99,
                                        marginLeft:Width(26)
                                    }} onPress={() => {this.setState({modalVisisble:true,indexImage:0,isProfile:true})}}>
                                        {thumbnail ? <Image source={{uri: thumbnail}}
                                                            style={{height: '100%', width: '100%'}}/> :  personImage ? <Image source={{uri: personImage}}
                                                                                                                              style={{height: '100%', width: '100%'}}
                                                                                                                              onError={(e) => this.setState({photo: 'https://s3.us-east-2.amazonaws.com/healinggimagestest/default.png'})}/>
                                                                                                                              : <Image style={{height: '100%', width: '100%'}}
                                                    source={{uri: 'http://profilepicturesdp.com/wp-content/uploads/2018/07/mustache-dp-2-1.jpg'}}/>}
                                    </TouchableOpacity>
                                    {casedetails.status === 'active' ?
                                        <TouchableOpacity>
                                            {this.state.isPray ? <View style={{ height: Height(10),
                                                    width: Height(10),
                                                    marginLeft:Height(5),
                                                    marginTop:Height(1.5)}}/>
                                                :
                                                <View style={{ height: Height(10),
                                                    width: Height(10),
                                                    marginLeft:Height(5),
                                                    marginTop:Height(1.5)}}/>}
                                        </TouchableOpacity> : <Image style={{ height: Height(10),
                                            width: Height(10),
                                            marginLeft:Height(5),
                                            marginTop:Height(1.5)}}/>}
                                </View>

                                <View style={{bottom: Height(8)}}>
                                    <Text style={{
                                        alignSelf: 'center',
                                        paddingTop: Height(2),
                                        fontSize: FontSize(18),
                                        fontWeight: 'bold',
                                        color: '#000'
                                    }}>{personName}</Text>

                                    {(age >= 0 && age != "Group")?
                                        city ?
                                            <Text style={{
                                                alignSelf: 'center',
                                                paddingTop: Height(1),
                                                fontSize: FontSize(14)
                                            }}>{personGender ? personGender.charAt(0).toUpperCase() + personGender.toLowerCase().slice(1) + ', ' : ''}{ (age > 0 ? age == 1 ? `${age} yr` :  `${age} yrs` : 'Infant') } {` from ${city}, ${countryName}` }</Text>:
                                            <Text style={{
                                                alignSelf: 'center',
                                                paddingTop: Height(1),
                                                fontSize: FontSize(14)
                                            }}>{personGender ? personGender.charAt(0).toUpperCase() + personGender.toLowerCase().slice(1) + ', ' : ''}{(age > 0 ? age == 1 ? `${age} yr` :  `${age} yrs` : 'Infant')} {` from ${countryName}` }</Text>
                                        :
                                        city ?
                                            <Text style={{
                                                alignSelf: 'center',
                                                paddingTop: Height(1),
                                                fontSize: FontSize(14)
                                            }}>{` From ${city}, ${countryName}` }</Text> :

                                            <Text style={{
                                                alignSelf: 'center',
                                                paddingTop: Height(1),
                                                fontSize: FontSize(14)
                                            }}>{` From ${countryName}` }</Text>}
                                    <View style={{
                                        paddingTop: Height(3),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row'
                                    }}>

                                        <View style={{
                                            height: Height(1.2),
                                            width: Height(1.2),
                                            borderRadius: Height(1.2),
                                            borderColor: '#EE6A93',
                                            borderWidth: 2,
                                        }}/>
                                        <Text style={{
                                            paddingLeft: Width(2), fontWeight: 'bold',
                                            color: '#000'
                                        }}>{casedetails.title}</Text>
                                    </View>

                                    <View style={{
                                        paddingTop: Height(1.5),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row'
                                    }}>
                                        <Text style={{
                                            paddingLeft: Width(2),
                                            marginHorizontal: Width(4),
                                            textAlign: 'center'
                                        }}>{casedetails.description}</Text>
                                    </View>

                                    <View style={{
                                        paddingTop: Height(2),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row'
                                    }}>
                                        {/* <View style={{height:Height(2),width:Height(2),borderRadius:Height(2),borderColor:'blue',borderWidth:2}}></View> */}
                                        <MaterialIcons name="access-time" color="#EE6A93" size={16}/>
                                        <Text style={{paddingLeft: Width(2)}}>Suffering since: <Text style={{
                                            fontWeight: 'bold',
                                            color: '#000'
                                        }}>{casedetails.suffering}</Text></Text>
                                    </View>
                                    <View style={{
                                        paddingTop: Height(2),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row'
                                    }}>
                                        {/* <View style={{height:Height(2),width:Height(2),borderRadius:Height(2f),borderColor:'blue',borderWidth:2}}></View> */}
                                        {/*<Image*/}
                                        {/*    source={require('./../../assets/submitted_on.png')}*/}
                                        {/*    style={{*/}
                                        {/*        height: Height(3),*/}
                                        {/*        width: Height(3),*/}
                                        {/*        alignItems: 'center',*/}
                                        {/*        justifyContent: 'center',*/}
                                        {/*    }}*/}
                                        {/*    resizeMode={'contain'}/>*/}
                                        <Text style={{paddingLeft: Width(2)}}>Case submitted On: <Text style={{
                                            fontWeight: 'bold',
                                            color: '#000'
                                        }}>{this.changeDate(casedetails.created_at)}</Text><Text>{" by "}</Text><Text style={{
                                            fontWeight: 'bold',
                                            color: '#000'
                                        }}>{casedetails.ownerName}</Text></Text>
                                    </View>
                                    {this.state.caseImages.length > 0 &&
                                    this.managerImage() }
                                </View>

                                {this.state.isOwner ?
                                    <View>
                                        <View style={{flexDirection: 'row'}}>
                                            <View
                                                style={{
                                                    backgroundColor: '#EE6B9A',
                                                    height: 1,
                                                    flex: 1,
                                                    alignSelf: 'center'
                                                }}/>
                                            <Text style={{alignSelf: 'center', paddingHorizontal: 5}}>Case Updates
                                                ({this.state.poststatus_list.length})</Text>
                                            <View
                                                style={{
                                                    backgroundColor: '#EE6B9A',
                                                    height: 1,
                                                    flex: 1,
                                                    alignSelf: 'center'
                                                }}/>
                                        </View>
                                        <View style={{
                                            marginTop: Height(3),
                                            marginHorizontal: Height(1),
                                            flexDirection: 'row',
                                            borderColor: 'black',
                                            borderWidth: 1,
                                            borderRadius: 25
                                        }}>
                                            <View style={{justifyContent: 'center', paddingLeft: Width(3)}}>
                                                <MaterialCommunityIcons size={25} name="square-edit-outline"/>
                                            </View>
                                            <View style={{flex: 6, paddingLeft: Width(4), flexDirection: 'row'}}>
                                                <TextInput style={{flex:1}} value={this.state.postStatus}
                                                           onChangeText={(postStatus) => this.setState({postStatus})}
                                                           placeholder={"Provide an update..."}/>
                                            </View>
                                            <TouchableOpacity onPress={() => {
                                                this.poststatus(this.state.postStatus);
                                                this.setState({postStatus: ''})
                                            }} style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
                                                <MaterialIcons name="send" size={20}/>
                                            </TouchableOpacity>
                                        </View>


                                        {/* <View style={{marginTop:Height(3),marginHorizontal:Width(5)}}>
                <Text>05 Dec 2018</Text>
                <Text>Still there is pain</Text>
            </View> */}

                                        <View>
                                            <View>
                                                <FlatList
                                                    data={this.state.poststatus_list}
                                                    keyExtractor={this._postkeyExtractor}
                                                    renderItem={this._postrenderItem}
                                                />
                                                {/*<Text style={{marginHorizontal: Width(5), alignSelf: 'flex-end'}}>Show older*/}
                                                {/*updates</Text>*/}
                                            </View>
                                            <View style={{flexDirection: 'row', marginTop: Height(4)}}>
                                                <View
                                                    style={{
                                                        backgroundColor: '#EE6B9A',
                                                        height: 1,
                                                        flex: 1,
                                                        alignSelf: 'center'
                                                    }}/>
                                                <Text style={{alignSelf: 'center', paddingHorizontal: 5}}>{this.state.commentlist.length > 1 ? 'Comments ' : 'Comment '}
                                                    ({this.state.commentlist.length})</Text>
                                                <View
                                                    style={{
                                                        backgroundColor: '#EE6B9A',
                                                        height: 1,
                                                        flex: 1,
                                                        alignSelf: 'center'
                                                    }}/>
                                            </View>
                                        </View>
                                    </View>
                                    :
                                    <View>
                                        <View style={{flexDirection: 'row'}}>
                                            <View
                                                style={{
                                                    backgroundColor: '#EE6B9A',
                                                    height: 1,
                                                    flex: 1,
                                                    alignSelf: 'center'
                                                }}/>
                                            <Text style={{alignSelf: 'center', paddingHorizontal: 5}}>Case Updates
                                                ({this.state.poststatus_list.length})</Text>
                                            <View
                                                style={{
                                                    backgroundColor: '#EE6B9A',
                                                    height: 1,
                                                    flex: 1,
                                                    alignSelf: 'center'
                                                }}/>
                                        </View>

                                        <View>
                                            <View>
                                                <FlatList
                                                    data={this.state.poststatus_list}
                                                    keyExtractor={this._postkeyExtractor}
                                                    renderItem={this._postrenderItem}
                                                />
                                                {/*<Text style={{marginHorizontal: Width(5), alignSelf: 'flex-end'}}>Show older*/}
                                                {/*updates</Text>*/}
                                            </View>
                                            <View style={{flexDirection: 'row', marginTop: Height(4)}}>
                                                <View
                                                    style={{
                                                        backgroundColor: '#EE6B9A',
                                                        height: 1,
                                                        flex: 1,
                                                        alignSelf: 'center'
                                                    }}/>
                                                <Text style={{alignSelf: 'center', paddingHorizontal: 5}}>{this.state.commentlist.length > 1 ?'Comments ' : 'Comment '}
                                                    ({this.state.commentlist.length})</Text>
                                                <View
                                                    style={{
                                                        backgroundColor: '#EE6B9A',
                                                        height: 1,
                                                        flex: 1,
                                                        alignSelf: 'center'
                                                    }}/>
                                            </View>
                                        </View>
                                    </View>}
                                <View style={{marginTop: this.state.isOwner ? 0 : 0}}>
                                    {this.state.commentlist.length > 0 && <FlatList
                                        data={this.state.commentlist}
                                        onEndReachedThreshold={0.1}
                                        onEndReached={() => {
                                            this.getCommentList()
                                        }}
                                        keyExtractor={this._keyExtractor}
                                        renderItem={this._renderItem}
                                    />}


                                    {/*<Text style={{paddingTop: Height(2), marginHorizontal: Width(5), alignSelf: 'flex-end'}}>Show
                                more
                                comments</Text>*/}
                                    {/*<Text style={{marginHorizontal: Width(5), alignSelf: 'center'}}>Comments</Text>*/}
                                    {/*<Text style={{marginHorizontal: Width(5), alignSelf: 'center'}}>List of Comments</Text>*/}
                                    <View style={{
                                        marginTop: Height(3),
                                        marginHorizontal: Height(1),
                                        flexDirection: 'row',
                                        borderColor: 'black',
                                        borderWidth: 1,
                                        borderRadius: 25
                                    }}>
                                        <View style={{justifyContent: 'center', paddingLeft: Width(3)}}>
                                            <MaterialCommunityIcons size={25} name="square-edit-outline"/>
                                        </View>
                                        <View style={{flex: 6, paddingLeft: Width(4), flexDirection: 'row'}}>
                                            <TextInput style={{flex:1}} value={this.state.comment}
                                                       onChangeText={(comment) => this.setState({comment:comment})}
                                                       placeholder={"Write a response..."}/>
                                        </View>
                                        <TouchableOpacity onPress={() => {
                                            this.comment(this.state.comment);
                                            this.setState({comment: ''})
                                        }} style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
                                            <MaterialIcons name="send" size={20}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {this.state.isOwner ?
                                    <View>
                                        <View style={{flexDirection: 'row', marginTop: Height(4)}}>
                                            <View
                                                style={{
                                                    backgroundColor: '#EE6B9A',
                                                    height: 1,
                                                    flex: 1,
                                                    alignSelf: 'center'
                                                }}/>
                                            <Text style={{alignSelf: 'center', paddingHorizontal: 5}}>Case
                                                Settings <Entypo
                                                    name="info-with-circle" size={15}/></Text>
                                            <View
                                                style={{
                                                    backgroundColor: '#EE6B9A',
                                                    height: 1,
                                                    flex: 1,
                                                    alignSelf: 'center'
                                                }}/>
                                        </View>
                                        <View style={{paddingTop: Height(2)}}>

                                            {
                                                !this.state.case_closed ?
                                                    !this.state.case_healed ?
                                                        <View style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginVertical: Height(2)
                                                        }}>
                                                            <ToggleSwitch
                                                                isOn={this.state.case_healed}
                                                                onColor='#F6C4D5'
                                                                offColor='#F6C4D5'
                                                                label='Tap to mark case as healed'
                                                                labelStyle={{color: 'black', fontWeight: '900'}}
                                                                size='medium'
                                                                onToggle={(isOn) => {
                                                                    this.alertMessage("Do you want to mark this case as \"Healed\"?",'heal')
                                                                }}
                                                            />
                                                        </View> :
                                                        <View style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginVertical: Height(2)
                                                        }}>
                                                            <ToggleSwitch
                                                                isOn={this.state.case_healed}
                                                                onColor='#EE6B9A'
                                                                offColor='#F6C4D5'
                                                                label='Re-open case'
                                                                labelStyle={{color: 'black', fontWeight: '900'}}
                                                                size='medium'
                                                                onToggle={() => {
                                                                    this.alertMessage("Do you really want to Re-open this case?",'reopen')
                                                                }}
                                                            />
                                                        </View> : null
                                            }

                                            {
                                                !this.state.case_healed ?
                                                    !this.state.case_closed ?
                                                        <View style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginVertical: Height(1)
                                                        }}>
                                                            <ToggleSwitch
                                                                isOn={this.state.case_closed}
                                                                onColor='#F6C4D5'
                                                                offColor='#F6C4D5'
                                                                label='Tap to close this case'
                                                                labelStyle={{color: 'black', fontWeight: '900'}}
                                                                size='medium'
                                                                onToggle={() => {
                                                                    this.alertMessage("Do you really want to close this case?",'close')
                                                                }}
                                                            />
                                                        </View> :
                                                        <View style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginVertical: Height(1)
                                                        }}>
                                                            <ToggleSwitch
                                                                isOn={this.state.case_closed}
                                                                onColor='#EE6B9A'
                                                                offColor='#F6C4D5'
                                                                label='Re-open case'
                                                                labelStyle={{color: 'black', fontWeight: '900'}}
                                                                size='medium'
                                                                onToggle={() => {
                                                                    this.alertMessage("Do you really want to Re-open this case?",'reopen')
                                                                }}
                                                            />
                                                        </View>
                                                    : null

                                            }
                                            {/*{*/}
                                            {/*    this.state.case_closed &&*/}
                                            {/*    <View style={{*/}
                                            {/*        justifyContent: 'center',*/}
                                            {/*        alignItems: 'center',*/}
                                            {/*        marginVertical: Height(1)*/}
                                            {/*    }}>*/}
                                            {/*        <ToggleSwitch*/}
                                            {/*            isOn={!this.state.case_closed}*/}
                                            {/*            onColor='#F6C4D5'*/}
                                            {/*            offColor='#F6C4D5'*/}
                                            {/*            label='Re-opened Case'*/}
                                            {/*            labelStyle={{color: 'black', fontWeight: '900'}}*/}
                                            {/*            size='medium'*/}
                                            {/*            onToggle={(isOn) => this.onCloseCase(isOn)}*/}
                                            {/*        />*/}
                                            {/*    </View>*/}
                                            {/*}*/}
                                        </View>
                                    </View> : null
                                }
                                <View style={{
                                    marginTop: Height(5),
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: Height(3),
                                }}>
                                    <Text style={{
                                        color: '#EE6B9A',
                                        fontStyle: 'italic'
                                    }}>{this.changeTextOnStatus()}</Text>
                                </View>
                                {((!casedetails.boosted || casedetails.boosted == null) && this.state.isOwner && caseStatus == 'active') &&
                                <TouchableOpacity style={{position:'absolute',right:-5,width:35,height:150,backgroundColor:'#d1266b',
                                    top:60,borderRadius:5,justifyContent:'center'}}  onPress={() => this.setState({pointsModal:true})}>
                                    <Text style={{
                                        marginTop:0,
                                        height:'65%',
                                        width:110,
                                        color:'white',
                                        fontSize:15,
                                        transform: [{ rotate: '-90deg' }],
                                    }}>Boost  this case</Text>
                                </TouchableOpacity>}
                            </ScrollView>
                            {(this.state.caseStatus != 'closed' && this.state.caseStatus != 'healed!' && this.state.caseStatus != 'inactive') &&
                            <TouchableOpacity style={[{
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: Height(0),
                                height: 50,
                                backgroundColor:'red'
                            },
                                this.state.isPray ? {backgroundColor: '#CCC'} : {backgroundColor: '#EE6B9A'}]}
                                              onPress={() => {
                                                  this.onPrayClick(casedetails)
                                              }}>
                                {this.state.isPray ?
                                    <Image style={{
                                        flex: 1,
                                        position: 'absolute',
                                        left: 10,
                                        height: 40,
                                        width: 50,
                                        alignSelf: 'center'
                                    }}
                                           source={require('./../../assets/Healingg_Heart_Grey.png')}
                                           resizeMode={'stretch'}/>
                                    :
                                    <Image style={{
                                        flex: 1,
                                        position: 'absolute',
                                        left: 10,
                                        height: 40,
                                        width: 50,
                                        alignSelf: 'center'
                                    }}
                                           source={require('./../../assets/Healingg_Heart_White.png')}
                                           resizeMode={'stretch'}/>
                                }
                                <Text style={[{
                                    fontSize: 24,
                                    fontStyle: 'italic',
                                    alignSelf: 'center'
                                },
                                    this.state.isPray ? {color: 'grey'} : {color: 'white'}]}>{this.state.isPray ? 'Prayers Sent!' : 'Pray'}</Text>
                            </TouchableOpacity>
                            }
                        </KeyboardAvoidingView>

                    }
                </View>
            );
        } else {
            return null;
        }
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({setFollowStatus,setMyCaselistTab,setNotifiationPage,shareAction,fetchPrayClick,setPointsPage}, dispatch)
    }
}

function mapStateToProps(state) {
    return{
        notificationPage: state.notificationPageManage.isCaseToken,
        isShare: state.shareData.isShare,
        points:state.points.points
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (ProfileScreen)


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
        right: Width(10),
        bottom: 0,
        height: Layout.HEADER_HEIGHT,
        width: Layout.HEADER_HEIGHT,
        justifyContent: 'center',
        zIndex: 2,
    },
    navigationBarRightButton1: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/2.5 : 15,
        right: 15,
        height: 30,
        width: 30,
        alignItems:'center',
        justifyContent:'center'
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
    hairline: {
        backgroundColor: '#A2A2A2',
        height: 2,
        width: 165
    },

    loginButtonBelowText1: {
        fontFamily: 'AvenirNext-Bold',
        fontSize: 14,
        color: '#A2A2A2'
    },

});
