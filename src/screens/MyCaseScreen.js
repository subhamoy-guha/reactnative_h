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
import { TabView, SceneMap,PagerPan } from 'react-native-tab-view';
import Active from './MyCaseTabScreen/Active'
import Inactive from './MyCaseTabScreen/Inactive'
import Healed from './MyCaseTabScreen/Healed'
import Closed from './MyCaseTabScreen/Closed'
import navigator from '../services/navigator';
import Toast from "react-native-simple-toast";
import { connect } from 'react-redux';
import {setMyCaselistTab} from "../Actions/setMyCaselistTab";
import {setNotifiationPage} from '../Actions/setNotificationPage';
import {shareAction} from "../Actions/shareAction";
import { bindActionCreators } from 'redux';
import {SHARE_MESSAGE, SHARE_TITLE, SHARE_URL} from "../constants/config";
import redeem from "../../assets/Reward_Points_Icon.png";


class MyCasesScreen extends Component {
    backHandler
    constructor(props){
        super(props)
        this.state={
            index: 0,
            routes: [
                { key: 'first', title: 'Active' },
                { key: 'second', title: "Inactive" },
                { key: 'third', title: "Healed" },
                { key: 'fourth', title: "Closed" }
            ]
        }
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

    componentWillUpdate(nextProps, nextState, nextContext) {
        console.log("My Case Screen",nextProps)
        if(nextProps.isShare == true ){
            this.props.shareAction(false)
            this.onShare()
        }
        if(nextProps.notificationPage){
            this.props.setNotifiationPage(false)
            navigator.navigate('Home')
        }
    }

    _handleToggleMenu=()=>{
        this.props.navigation.openDrawer();
    }

    tabViewIndexChange = (index) => {
        this.setState({ index });
    };

    createCase = () => {
        if (this.state.healing_for !== 'myself') {
            if(this.state.category_id ==  1 && this.state.category_id ==4){
                if (this.state.country && this.state.person_name && this.state.gender && this.state.age && this.state.case_title && this.state.case_description && this.state.suffering) {
                    this.setState({loading: true})
                    let self = this
                    AsyncStorage.getItem('token').then((value) => {
                            let formdata = new FormData();
                            formdata.append("user_token", value);
                            formdata.append("person_name", this.state.person_name);
                            formdata.append("case_title", this.state.case_title);
                            formdata.append("case_description", this.state.case_description);
                            formdata.append("category_id", this.state.category_id);
                            formdata.append("country", this.state.country.country);
                            formdata.append("gender", this.state.gender.toLocaleLowerCase());
                            formdata.append("age", this.state.age.toString());
                            formdata.append("suffering_since", this.state.suffering.id.toString());
                            formdata.append("healing_for", this.state.healing_for);
                            if (this.state.person_image) {
                                formdata.append("person_image", {
                                    uri: Platform.OS === "android" ? this.state.person_image.uri : this.state.person_image.uri.replace("file://", ""),
                                    type: this.state.person_image.type,
                                    name: this.state.person_image.fileName,
                                });
                            }
                            if (this.state.case_image_1) {
                                formdata.append("case_image_1", {
                                    uri: Platform.OS === "android" ? this.state.case_image_1.uri : this.state.case_image_1.uri.replace("file://", ""),
                                    type: this.state.case_image_1.type,
                                    name: this.state.case_image_1.fileName,
                                });
                            }
                            if (this.state.case_image_2) {
                                formdata.append("case_image_2", {
                                    uri: Platform.OS === "android" ? this.state.case_image_2.uri : this.state.case_image_2.uri.replace("file://", ""),
                                    type: this.state.case_image_2.type,
                                    name: this.state.case_image_2.fileName,
                                });
                            }
                            if (this.state.case_image_3) {
                                formdata.append("case_image_3", {
                                    uri: Platform.OS === "android" ? this.state.case_image_3.uri : this.state.case_image_3.uri.replace("file://", ""),
                                    type: this.state.case_image_3.type,
                                    name: this.state.case_image_3.fileName,
                                });
                            }
                            if (this.state.case_image_4) {
                                formdata.append("case_image_4", {
                                    uri: Platform.OS === "android" ? this.state.case_image_4.uri : this.state.case_image_4.uri.replace("file://", ""),
                                    type: this.state.case_image_4.type,
                                    name: this.state.case_image_4.fileName,
                                });
                            }


                            console.log('formdata', formdata);


                            fetch('https://cms.healingg.com/api/create_case', {
                                method: 'post',
                                body: formdata,
                                headers: {
                                    //'Content-Type': 'application/x-www-form-urlencoded',
                                    // 'Accept': 'application/json',
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then((responseData) => {
                                console.log('create case', responseData)
                                this.setState({loading: false})
                                navigator.navigate('Home')
                            }).catch(err => {
                                this.setState({loading: false})
                                console.log(err)
                                Toast.show('Error while create case', Toast.LONG, Toast.BOTTOM)
                            })
                        }
                    )
                } else {
                    Toast.show('Please fill up all details', Toast.LONG, Toast.BOTTOM)
                }
            }else{
                if (this.state.country && this.state.person_name  && this.state.case_title && this.state.case_description && this.state.suffering) {
                    this.setState({loading: true})
                    let self = this
                    AsyncStorage.getItem('token').then((value) => {
                            let formdata = new FormData();
                            formdata.append("user_token", value);
                            formdata.append("person_name", this.state.person_name);
                            formdata.append("case_title", this.state.case_title);
                            formdata.append("case_description", this.state.case_description);
                            formdata.append("category_id", this.state.category_id);
                            formdata.append("country", this.state.country.country);
                            formdata.append("suffering_since", this.state.suffering.id.toString());
                            formdata.append("healing_for", this.state.healing_for);
                            if (this.state.person_image) {
                                formdata.append("person_image", {
                                    uri: Platform.OS === "android" ? this.state.person_image.uri : this.state.person_image.uri.replace("file://", ""),
                                    type: this.state.person_image.type,
                                    name: this.state.person_image.fileName,
                                });
                            }
                            if (this.state.case_image_1) {
                                formdata.append("case_image_1", {
                                    uri: Platform.OS === "android" ? this.state.case_image_1.uri : this.state.case_image_1.uri.replace("file://", ""),
                                    type: this.state.case_image_1.type,
                                    name: this.state.case_image_1.fileName,
                                });
                            }
                            if (this.state.case_image_2) {
                                formdata.append("case_image_2", {
                                    uri: Platform.OS === "android" ? this.state.case_image_2.uri : this.state.case_image_2.uri.replace("file://", ""),
                                    type: this.state.case_image_2.type,
                                    name: this.state.case_image_2.fileName,
                                });
                            }
                            if (this.state.case_image_3) {
                                formdata.append("case_image_3", {
                                    uri: Platform.OS === "android" ? this.state.case_image_3.uri : this.state.case_image_3.uri.replace("file://", ""),
                                    type: this.state.case_image_3.type,
                                    name: this.state.case_image_3.fileName,
                                });
                            }
                            if (this.state.case_image_4) {
                                formdata.append("case_image_4", {
                                    uri: Platform.OS === "android" ? this.state.case_image_4.uri : this.state.case_image_4.uri.replace("file://", ""),
                                    type: this.state.case_image_4.type,
                                    name: this.state.case_image_4.fileName,
                                });
                            }


                            console.log('formdata', formdata);


                            fetch('https://cms.healingg.com/api/create_case', {
                                method: 'post',
                                body: formdata,
                                headers: {
                                    //'Content-Type': 'application/x-www-form-urlencoded',
                                    // 'Accept': 'application/json',
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then((responseData) => {
                                console.log('create case', responseData)
                                this.setState({loading: false})
                                navigator.navigate('Home')
                            }).catch(err => {
                                this.setState({loading: false})
                                console.log(err)
                                Toast.show('Error while create case', Toast.LONG, Toast.BOTTOM)
                            })
                        }
                    )
                } else {
                    Toast.show('Please fill up all details', Toast.LONG, Toast.BOTTOM)
                }
            }

        } else {
            if (this.state.case_title && this.state.case_description && this.state.suffering) {
                this.setState({loading: true})
                let self = this
                AsyncStorage.getItem('token').then((value) => {
                        let formdata = new FormData();
                        formdata.append("user_token", value);
                        formdata.append("person_name", this.state.my_name);
                        formdata.append("case_title", this.state.case_title);
                        formdata.append("case_description", this.state.case_description);
                        formdata.append("category_id", this.state.category_id);
                        formdata.append("country", this.state.my_country);
                        formdata.append("gender", this.state.my_gender.toLocaleLowerCase());
                        formdata.append("age", this.state.my_age);
                        formdata.append("suffering_since", this.state.suffering.id.toString());
                        formdata.append("healing_for", this.state.healing_for === 'myself' ? 'My Self' : '');
                        // formdata.append("photo", this.state.my_photo);
                        formdata.append("person_image", {
                            uri: this.state.my_photo,
                            type: 'image/jpeg',
                            name: 'downlaod.jpg',
                        });
                        if (this.state.case_image_1) {
                            formdata.append("case_image_1", {
                                uri: Platform.OS === "android" ? this.state.case_image_1.uri : this.state.case_image_1.uri.replace("file://", ""),
                                type: this.state.case_image_1.type,
                                name: this.state.case_image_1.fileName,
                            });
                        }
                        if (this.state.case_image_2) {
                            formdata.append("case_image_2", {
                                uri: Platform.OS === "android" ? this.state.case_image_2.uri : this.state.case_image_2.uri.replace("file://", ""),
                                type: this.state.case_image_2.type,
                                name: this.state.case_image_2.fileName,
                            });
                        }
                        if (this.state.case_image_3) {
                            formdata.append("case_image_3", {
                                uri: Platform.OS === "android" ? this.state.case_image_3.uri : this.state.case_image_3.uri.replace("file://", ""),
                                type: this.state.case_image_3.type,
                                name: this.state.case_image_3.fileName,
                            });
                        }
                        if (this.state.case_image_4) {
                            formdata.append("case_image_4", {
                                uri: Platform.OS === "android" ? this.state.case_image_4.uri : this.state.case_image_4.uri.replace("file://", ""),
                                type: this.state.case_image_4.type,
                                name: this.state.case_image_4.fileName,
                            });
                        }


                        console.log('formdata', formdata);


                        fetch('https://cms.healingg.com/api/create_case', {
                            method: 'post',
                            body: formdata,
                            headers: {
                                //'Content-Type': 'application/x-www-form-urlencoded',
                                // 'Accept': 'application/json',
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then((responseData) => {
                            console.log('create case', responseData)
                            this.setState({loading: false})
                            navigator.navigate('Home')
                        }).catch(err => {
                            this.setState({loading: false})
                            console.log(err)
                            Toast.show('Error while create case', Toast.LONG, Toast.BOTTOM)
                        })
                    }
                )
            } else {
                Toast.show('Please fill up all details', Toast.LONG, Toast.BOTTOM)
            }
        }
    }

    renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        console.log('render tab bar===',this.state.index)
        if(this.props.isChange){
           this.setState({index:this.props.Tab},() => {
               this.props.setMyCaselistTab(this.props.tab,false)
               return (
                   <View style={styles.tabBar}>
                       {props.navigationState.routes.map((route, i) => {
                           const color = props.position.interpolate({
                               inputRange,
                               outputRange: inputRange.map(inputIndex => (inputIndex === i ? '#333333' : '#767676'))
                           });
                           return (
                               <TouchableOpacity
                                   key={i}
                                   style={[styles.tabItem, this.state.index == i ? styles.selectedTab : {}]}
                                   onPress={() => {
                                       this.setState({ index: i })
                                   }}
                               >
                                   <Animated.Text style={{ color,fontSize:FontSize(12) }}>{route.title}</Animated.Text>
                               </TouchableOpacity>
                           );
                       })}
                   </View>
               );
           })
        }else{
            return (
                <View style={styles.tabBar}>
                    {props.navigationState.routes.map((route, i) => {
                        const color = props.position.interpolate({
                            inputRange,
                            outputRange: inputRange.map(inputIndex => (inputIndex === i ? '#333333' : '#767676'))
                        });
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[styles.tabItem, this.state.index == i ? styles.selectedTab : {}]}
                                onPress={() => {
                                    console.log("index===",i)
                                    this.setState({ index: i })
                                }}
                            >
                                <Animated.Text style={{ color,fontSize:FontSize(12) }}>{route.title}</Animated.Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        }

    };

    __renderNavigationBar() {

        return (
            <View key="navbar" style={styles.navigationBarContainer}>
                <TouchableHighlight underlayColor='transparent' onPress={this._handleToggleMenu} style={styles.navigationBarLeftButton}>
                    <Ionicons  size={35} name="ios-menu" color="#EE6B9A"/>
                </TouchableHighlight>
                <View style={styles.navigationBarTitleContainer}>
                    <TouchableWithoutFeedback>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>My Cases</Text>
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
                <TabView
                    navigationState={this.state}
                    onIndexChange={(index) => this.tabViewIndexChange(index)}
                    renderScene={SceneMap({
                        first: Active,
                        second: Inactive,
                        third:Healed,
                        fourth:Closed
                    })}
                    renderTabBar={this.renderTabBar}
                    renderPager={(props) => <PagerPan {...props}/>}
                />
                <View style={{zIndex: -1, justifyContent: 'flex-end', height: 50}}>
                    <View style={{flexDirection: 'row', height: 50}}>
                        <TouchableOpacity
                            onPress={()=>navigator.navigate('Home')}
                            style={{
                                width: '50%',
                                backgroundColor: '#CCC',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}><Text style={{fontSize: FontSize(16), color: '#EE6B9A'}}>Send Prayers</Text></TouchableOpacity>
                        <TouchableOpacity style={{
                            width: '50%',
                            backgroundColor: "#EE6B9A",
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} onPress={() => this.props.navigation.navigate('SubmitCaseScreen')}><Text style={{fontSize: FontSize(16), color: 'white'}}>Request Healing</Text></TouchableOpacity>
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
        ...bindActionCreators({setMyCaselistTab,setNotifiationPage,shareAction}, dispatch)
    }
}

function mapStateToProps(state) {
    console.log("===statetab",state)
    return{
        Tab: state.mycaselisttab.Tab,
        isChange: state.mycaselisttab.isChange,
        notificationPage: state.notificationPageManage.isCaseToken,
        isShare: state.shareData.isShare,
        points:state.points.points
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(MyCasesScreen)

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
