import React,{Component} from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Image,
    TouchableOpacity,
    StyleSheet, Platform, AsyncStorage, FlatList
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import redeem from "../../assets/Reward_Points_Icon.png";
import navigator from "../services/navigator";
import Layout from "../constants/Layout";
import {FontSize, Width} from "../constants/dimensions";
import RequestService from "../services/RequestService";
import CaseListItem from "./CaseListItem";
import Toast from "react-native-simple-toast";
import ImageModal from "../component/imageModal";
import PrayerModal from "../component/prayerModal";
import PrayerScreen from "../component/PrayerScreen";
import {setPointsPage} from "../Actions/setPoint";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ReedemModal from '../component/ReedemPointsAlert';
import PointImageModal from "../component/pointsImageModal";


class UserCaselistScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            token: this.props.navigation.state.params.token,
            isFlatStop:false,
            data:[],
            offset:0,
            modalVisisble:false,
            modalPrayer: false,
            modalPrayerApi : false,
            redeemModal:false,
            redeemPoints:0,
            name:"",
            pointImageModal: false
        }
    }

    componentWillMount() {
        this.callApi()
    }

    _handleToggleMenu = () => {
        console.log('navigate', this.props);
        this.props.navigation.toggleDrawer();
    }

    _renderNavigationBar() {
        return (
            <View key="navbar" style={[styles.navigationBarContainer]}>
                <TouchableHighlight underlayColor='transparent' onPress={this._handleToggleMenu}
                                    style={styles.navigationBarLeftButton}>
                    <Ionicons size={35} name="ios-menu" color="#EE6B9A"/>
                </TouchableHighlight>
                <View style={styles.navigationBarTitleContainer}>
                    <TouchableWithoutFeedback>
                        <View style={{flexDirection: 'row'}}>
                            <Text>Cases that need your prayers</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

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

    callApi = () => {
        const {offset,data,token} = this.state
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'user_active_cases', body: {user_token: value, case_owner_token:token, dataCount : offset}}
            new RequestService(params).callCreate().then(res => {
                if (res.mySubmittedCases.length > 0) {
                    const activeCases = res.mySubmittedCases.filter((item) => {
                        return item.status === 'active'
                    })
                    if (activeCases.length > 0) {
                        const newRecords = [...data, ...activeCases];
                        const newoffset = offset + 1;
                        this.setState({data: newRecords, offset: newoffset})
                    }
                }
            })
        })
    }

    onPrayClick = (cases) => {
        if(cases.isPray == 0){
            this.setState({cases:cases}, () => {
                this.setState({modalPrayerApi:true})
            })
        }
        console.log("clicked")
        //this.props.handleProps();
    }

    noOfPrayerClick = (cases) => {
        console.log("clicked")
    }

    callPrayerApi = (cases) => {
        const personName = cases.person_name ? cases.person_name : cases.ownerName
        let params = {url: 'casepray', body: {case_token: cases.token, user_token: this.state.token}}
        new RequestService(params).callCreate().then(res => {
            console.log('pray response', res)
            if (res.message === "Success") {
                this.props.setPointsPage(res.new_balance)
                //const filtercase= this.state.caselist.filter((item)=>{return item.token !== cases.token});
                //console.log(res,'=======',filtercase)
                let filterCases = [];
                this.state.caselist.map((data, index) => {
                    if(data.token === cases.token){
                        data.isPray = true;
                        data.total_prays = parseInt(cases.total_prays) + 1;
                    }
                    filterCases.push(data);
                })
                AsyncStorage.getItem('PrayerPointModal').then((value) => {
                    if(value == 'true') {
                        this.setState({caselist: filterCases,modalPrayerApi:false,redeemPoints:res.points_awarded,
                            pointImageModal:false,
                            name:personName},() => {
                            this.timeoutHandle = setTimeout(()=>{
                                // Add your logic for the transition
                                this.setState({ pointImageModal: false })
                            }, 1000);
                        })
                    }else{
                        AsyncStorage.setItem('PrayerPointModal','true')
                        this.setState({caselist: filterCases,modalPrayerApi:true,redeemPoints:res.points_awarded,
                            redeemModal:true,
                            name:personName})
                    }
                })

            } else {
                Toast.show(res.message, Toast.LONG, Toast.BOTTOM)
                const filtercase= this.state.caselist
                console.log(res,'=======',filtercase)
                this.setState({caselist: filtercase,modalPrayerApi:false})
            }
        }).catch(err => {
            this.setState({modalPrayerApi:false})
            console.log('pray error', err)
            //alert(JSON.stringify(err))
        })
    }

    onCloseModal = () => {
        this.setState({redeemModal:false})
    }

    render() {
        return(
            <View style={styles.container}>
                <ImageModal visible={this.state.modalVisisble} imageProfile={this.state.imageProfile} onSwipeDown={()=> {
                    this.setState({modalVisisble:false})
                }} onCloseModal={() => {
                    this.setState({modalVisisble:false})
                }}/>
                <PrayerScreen visible={this.state.modalPrayerApi} cases={this.state.cases} onCloseModal={() => {
                    this.setState({modalPrayerApi:false})
                }} onPrayerApiClick={(cases) => {
                    this.callPrayerApi(cases)
                }} casedetail={false}/>
                <ReedemModal isOpen={this.state.redeemModal} onCloseModal={() => this.onCloseModal()}
                             points={this.state.redeemPoints} name={this.state.name}
                />
                <PointImageModal visible={this.state.pointImageModal} />
                {this._renderNavigationBar()}
                {
                    this.state.data.length > 0 ?
                        <FlatList
                            style={{flex: 1}}
                            data = {this.state.data}
                            onEndReachedThreshold={0.7}
                            onEndReached={() => {
                                if (!this.state.isFlatStop){
                                    this.callApi()
                                }
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem = {(item,index) => {
                                return <CaseListItem cases={item} onPrayClick={this.onPrayClick} onNoofPrayerClick={this.noOfPrayerClick}
                                                      tab={0} onImageClick={(arrImages) => {
                                    this.setState({imageProfile:arrImages,modalVisisble:true})
                                }
                                }/>
                            }
                            }
                        /> :
                        <Text> No cases found </Text>
                }
            </View>
        )
    }
}

function mapStateToProps(state) {
    return{
        points:state.points.points
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({setPointsPage}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (UserCaselistScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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

});
