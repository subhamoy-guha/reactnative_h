import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    AsyncStorage,
    FlatList, ActivityIndicator, BackHandler, Alert
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import RequestService from './../../services/RequestService';
import {Spinner} from "../../component/spinner";
import CaseListItem from "../CaseListItem";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchFollowingCaseList } from '../../Actions/fetchFollowingCaselist';
import {fetchPrayClick} from '../../Actions/fetchPrayClick'
import { manageEditCase } from '../../Actions/manageEditCase'
import { fetchSortCaseList } from '../../Actions/fetchSortCaseList'
import { fetchFilterCaseList } from '../../Actions/fetchFilterCaseList'
import {setFilterStatus} from '../../Actions/setFilter'
import {setPointsPage} from "../../Actions/setPoint";
import ImageModal from '../../component/imageModal';
import Toast from "react-native-simple-toast";
import PrayerModal from '../../component/prayerModal';
import PrayerScreen from '../../component/PrayerScreen';
import {API_ROOT} from '../../constants/config';
import navigator from "../../services/navigator";
import ReedemModal from '../../component/ReedemPointsAlert';


class MyCaseTab extends Component {
    state={
        myFollowingCases:[],
        currentlist: [],
        loading:false,
        offset:0,
        isFlatStop:false,
        isRefresh:false,
        addMoreLoader:false,
        modalVisisble:false,
        imageProfile:[],
        modalPrayer: false,
        prayerList: {},
        modalPrayerApi : false,
        cases:{},
        casesPrayer:{},
        filterType:'',
        filter:'',
        redeemModal:false,
        redeemPoints:0,
        name:""
    }

    componentDidMount(){
        SplashScreen.hide()
        let self = this
        AsyncStorage.getItem('token').then((value) => {
            if(value) {
                AsyncStorage.getItem('healer').then((value2) => {
                    if(value2) {
                        let params = {url: 'my_following_cases', body: {user_token: value,dataCount:0}};
                        console.log("====propscount Following====",this.props.followingCaselist.followingCaselist.length)
                        if (this.props.filterData.filter.length == 0 || this.props.filterData.filter == "alltab") {
                            if (this.props.followingCaselist.followingCaselist.length == 0) {
                                this.setState({loading: true})
                                this.props.fetchFollowingCaseList(params, false, this.state.offset)
                            } else {
                                this.setState({
                                    myFollowingCases: this.props.followingCaselist.followingCaselist,
                                    loading: false,
                                    offset: this.props.followingCaselist.offset + 1
                                })
                            }
                        }
                    } else{
                        this.setState({loading: false})
                    }
                }).catch((err) => {
                    console.log(err)
                })
            } else{
                this.setState({loading: false})
            }
        })
    }

    componentWillReceiveProps(nextProps){
        const {offset,myFollowingCases} = this.state
        console.log('def====',nextProps)
        if(nextProps.filterData ) {
            if (nextProps.filterData.index == 1) {
                if (nextProps.filterData.filter == 'sort') {
                    this.setState({
                        loading: false,
                        offset: 0,
                        myFollowingCases: [],
                        isFlatStop: false,
                        currentlist: [],
                        filter: 'sort',
                        filterType: nextProps.filterData.filter_type
                    }, () => {
                        this.sortcases(nextProps.filterData.filter_type)
                        this.props.setFilterStatus("",'',nextProps.filterData.index,'')
                    })
                } else if (nextProps.filterData.filter == 'alltab') {
                    this.setState({
                        myFollowingCases: this.props.followingCaselist.followingCaselist, loading: false,
                        offset: this.props.followingCaselist.offset + 1, filterType: '', filter: ''
                    })
                } else if (nextProps.filterData.filter == 'filter') {
                    this.setState({
                        loading: false,
                        offset: 0,
                        myFollowingCases: [],
                        isFlatStop: false,
                        currentlist: [],
                        filter: 'filter',
                        filterType: nextProps.filterData.filter_type
                    }, () => {
                        this.filterCases(nextProps.filterData.filter_type)
                        this.props.setFilterStatus("",'',nextProps.filterData.index,'')
                    })
                }
            }
        }
        if(nextProps.isFollow){
            this.props.manageEditCase(false,false)
            this.onRefresh()
        }
        if(nextProps.isPrayerClick){
            this.props.fetchPrayClick(false,'')
            this.setState({myFollowingCases:[],offset:0,isRefresh:true}, () => {
                this.fetchData()
            })
        }
        if(!nextProps.followingCaselist.error){
            console.log(myFollowingCases,nextProps.followingCaselist.followingCaselist)
            if(nextProps.followingCaselist.followingCaselist.length > 0){
                if(this.props.followingCaselist.followingCaselist != nextProps.followingCaselist.followingCaselist){
                    let newOffset =  offset + 1
                    console.log('new following Offset:',newOffset)
                    let newCaselist = nextProps.followingCaselist.followingCaselist
                    this.setState({myFollowingCases:newCaselist,loading:false,offset:newOffset,addMoreLoader:false,isFlatStop:false})
                }
            }else{
                if(offset != 0 ){
                    this.setState({isFlatStop:true,loading:false,addMoreLoader:false})
                }
            }
        }else{
            this.setState({addMoreLoader:false,loading:false,isFlatStop:true,})
        }
        if(nextProps.sortData){
            if (nextProps.filterData.index == 1) {
                if (!nextProps.sortData.error) {
                    if (nextProps.sortData.caselist.length > 0) {
                        if (this.props.sortData.caselist != nextProps.sortData.caselist) {
                            let newOffset = offset + 1
                            console.log('new All Tab Offset:', newOffset)
                            this.setState({
                                myFollowingCases: nextProps.sortData.caselist,
                                loading: false,
                                offset: newOffset,
                                addMoreLoader: false,
                                currentlist: nextProps.sortData.currentlist,
                                isFlatStop: false
                            })
                        }
                    } else {
                        if (offset != 0) {
                            this.setState({loading: false, addMoreLoader: false})
                        }
                    }
                } else {
                    this.setState({addMoreLoader: false, loading: false, isFlatStop: true})
                }
            }
        }
        if(nextProps.filterListData){
            if (nextProps.filterData.index == 1) {
                if (!nextProps.filterListData.error) {
                    if (nextProps.filterListData.caselist.length > 0) {
                        if (this.props.filterListData.caselist != nextProps.filterListData.caselist) {
                            let newOffset = offset + 1
                            console.log('new All Tab Offset:', newOffset)
                            this.setState({
                                myFollowingCases: nextProps.filterListData.caselist,
                                loading: false,
                                offset: newOffset,
                                addMoreLoader: false,
                                currentlist: nextProps.filterListData.currentlist,
                                isFlatStop: false
                            })
                        }
                    } else {
                        if (offset != 0) {
                            this.setState({loading: false, addMoreLoader: false})
                        }
                    }
                } else {
                    this.setState({addMoreLoader: false, loading: false, isFlatStop: true})
                }
            }
        }

    }

    sortcases = (status) => {
        let params = {}
        const {currentlist,offset} = this.state
        var strIds = currentlist.join()
        AsyncStorage.getItem('token').then((value) => {
            if (value) {
                if (status === 'latest') {
                    params = {url: 'caselist', body: {user_token: value,dataCount:offset,sortBy:'desc',caseIdArray:strIds}}
                } else if (status === 'mosthealed') {
                    params = {url: 'caselist', body: {user_token: value,dataCount:offset,most_least_healed:'desc'}}
                } else if (status === 'leasthealed') {
                    params = {url: 'caselist', body: {user_token: value,dataCount:offset,most_least_healed:'asc'}}
                }
                if(offset == 0){
                    this.props.fetchSortCaseList(status,params, true, 0)
                }else{
                    this.props.fetchSortCaseList(status,params, false, 0)
                }

            }
        })
    }

    filterCases = (status) => {
        console.log("==filter calling===")
        this.setState({loading: false})
        const {offset,  currentlist} = this.state
        this.setState({addMoreLoader: true})
        var strIds = currentlist.join()
        let params = {}
        AsyncStorage.getItem('token').then((value) => {
            if (value) {
                params = {url: 'caselist', body: {user_token: value,dataCount:offset,filterBy:status,caseIdArray:strIds}}
                if(offset == 0){
                    this.props.fetchFilterCaseList(status,params, true, 0)
                }else{
                    this.props.fetchFilterCaseList(status,params, false, 0)
                }
            }
        })
    }

    onPrayClick = (cases) => {
        if(cases.isPray == 0) {
            this.setState({cases: cases}, () => {
                this.setState({modalPrayerApi: true})
            })
            console.log(cases);
        }
    }

    fetchData = () => {
        const {offset,isRefresh} = this.state
        console.log("===fetch data calling====")
        console.log('offset',offset)
        this.setState({addMoreLoader:true})
        AsyncStorage.getItem('token').then((value) => {
            if(value) {
                AsyncStorage.getItem('healer').then((value2) => {
                    if(value2) {
                        let params = {url: 'my_following_cases', body: {user_token: value,dataCount:offset}};
                        if(isRefresh){
                            this.setState({isRefresh:false},() => {
                                this.props.fetchFollowingCaseList(params,true,offset)
                            })
                        }else {
                            this.props.fetchFollowingCaseList(params,false,offset)
                        }
                    } else{
                        this.setState({loading: false})
                    }
                })
            } else{
                this.setState({loading: false})
            }
        })
    }

    onRefresh() {
        this.setState({myFollowingCases:[],offset:0,isRefresh:true,isFlatStop:false}, () => {
            this.fetchData()
        })
    }

    renderFooter = () => {
        console.log("==Footer Calling===")
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.addMoreLoader) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
            />
        );
    };

    noOfPrayerClick = (cases) => {
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'prayerlist', body: {case_token: cases.token, user_token: value,dataCount: 0}}
            console.log("==prayerlist params====",params)
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

    callPrayerApi = (cases) => {
        const personName = cases.person_name ? cases.person_name : cases.ownerName
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'my_following_cases', body: {case_token: cases.token, user_token: this.user_token}}
            new RequestService(params).callCreate().then(res => {
                console.log('pray response', res)
                if (res.message === "Success") {
                    this.props.setPointsPage(res.new_balance)
                    let params = {url: 'caselist', body: {user_token: value}}
                    new RequestService(params).callCreate().then(res => {
                        if (res.caselist) {
                            this.setState({
                                caselist: res.caselist,
                                modalPrayerApi:false,
                                redeemPoints:res.points_awarded,
                                redeemModal:true,
                                name:personName
                            })
                        } else {

                        }
                    }).catch(err => {
                        this.setState({modalPrayerApi:false})
                    })
                } else {
                    this.setState({modalPrayerApi:false})
                }
            }).catch(err => {
                this.setState({modalPrayerApi:false})
                console.log('pray error', err)
            })
        })
    }

    onSendPrayer = (cases) => {
        navigator.navigate('UserCaselistScreen',{token:cases.customer_token})
    }
    render() {
        return (
            <View style={styles.container}>
                <ImageModal visible={this.state.modalVisisble} imageProfile={this.state.imageProfile} onSwipeDown={()=> {
                    this.setState({modalVisisble:false})
                }} onCloseModal={() => {
                    this.setState({modalVisisble:false})
                }}/>
                <PrayerModal visible={this.state.modalPrayer} indexCount={[1]} cases={this.state.casesPrayer} prayerList={this.state.prayerList} onCloseModal={() => {
                    this.setState({modalPrayer:false})
                }} onSendPrayerPress={(cases) => {
                    this.onSendPrayer(cases)
                }}/>
                <PrayerScreen visible={this.state.modalPrayerApi} cases={this.state.cases} onCloseModal={() => {
                    this.setState({modalPrayerApi:false})
                }} onPrayerApiClick={(cases) => {
                    this.callPrayerApi(cases)
                }} casedetail={false}/>
                <ReedemModal isOpen={this.state.redeemModal} onCloseModal={() => this.onCloseModal()}
                             points={this.state.redeemPoints} name={this.state.name}
                />
                {this.state.loading ? <Spinner/> :
                    <FlatList
                        style={{flex: 1}}
                        data = {this.state.myFollowingCases}
                        ListFooterComponent={this.renderFooter()}
                        onEndReachedThreshold={0.1}
                        onEndReached={() => {
                            console.log("==on end reached===")
                            if (!this.state.isFlatStop && this.state.addMoreLoader == false){
                                if(this.state.filter == 'sort'){
                                    this.sortcases(this.state.filterType)
                                }else if(this.state.filter == 'filter'){
                                    this.filterCases(this.state.filterType)
                                }
                                else{
                                    this.fetchData()
                                }
                            }
                        }}
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.isRefresh}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem = {(item,index) => {
                            return <CaseListItem cases={item} isMyCase={true} onPrayClick={this.onPrayClick} isFilter={this.state.filter.length > 0 ? true : false} onNoofPrayerClick={this.noOfPrayerClick} myFollow={this.state.filter.length > 0 ? '' : 'follow'} onImageClick={(arrImages) => {
                                this.setState({imageProfile:arrImages,modalVisisble:true})
                            }
                            }/>
                        }
                        }
                    />

                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    return{
        followingCaselist: state.followingcaselist,
        isPrayerClick: state.prayerclick.isPrayerClick,
        isFollow: state.editcaseManage.isFollow,
        filterData:state.filterData,
        filterListData:state.filterCaselistData,
        sortData:state.sortCaselistData
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({fetchFollowingCaseList,fetchPrayClick,manageEditCase,fetchSortCaseList,setFilterStatus,
            fetchFilterCaseList,setPointsPage}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MyCaseTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white'
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
