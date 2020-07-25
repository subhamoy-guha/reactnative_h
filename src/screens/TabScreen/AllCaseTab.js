import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    AsyncStorage,
    FlatList, Image, Text, TouchableOpacity, ActivityIndicator, Modal
} from 'react-native';
import {Height, Width, FontSize, isIphoneX, isIphone} from './../../constants/dimensions'
import RequestService from '../../services/RequestService';
import navigator from '../../services/navigator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchCaseList } from '../../Actions/fetchCaseList';
import {fetchPrayClick} from '../../Actions/fetchPrayClick'
import { manageEditCase } from '../../Actions/manageEditCase'
import { fetchSortCaseList } from '../../Actions/fetchSortCaseList'
import { fetchFilterCaseList } from '../../Actions/fetchFilterCaseList'
import {setFilterStatus} from '../../Actions/setFilter'
import {setPointsPage} from "../../Actions/setPoint";
import CaseListItem from "../CaseListItem";
import {Spinner} from "../../component/spinner";
import ImageModal from '../../component/imageModal';
import PrayerModal from '../../component/prayerModal';
import PrayerScreen from '../../component/PrayerScreen';
import Toast from "react-native-simple-toast";
import ReedemModal from '../../component/ReedemPointsAlert';
import BoostedModal from "../../component/BoostedModal";
import PointImageModal from "../../component/pointsImageModal";

class AllCaseTab extends Component {

    constructor(props) {
        super(props)
        this.state = {
            caselist: [],
            currentlist:[],
            prayed:false,
            loading:false,
            offset:0,
            isFlatStop:false,
            isRefresh:false,
            addMoreLoader:false,
            modalVisisble:false,
            imageProfile:[],
            modalPrayer: false,
            modalPrayerApi : false,
            prayerList: {},
            cases:{},
            casesPrayer:{},
            filterType:'',
            filter:'',
            redeemModal:false,
            redeemPoints:0,
            boostedModal:false,
            name:"",
            pointImageModal: false
        };
        this.user_token=''
    }

    componentWillMount() {
    }

    componentDidMount() {
        let self = this
        AsyncStorage.getItem('token').then((value) => {
            if(value) {
                AsyncStorage.getItem('healer').then((value2) => {
                    if(value2) {
                        let params = {url: 'caselist', body: {user_token: value,dataCount:0}}
                        console.log("====propscount====",params)
                        if (this.props.filterData.filter.length == 0 || this.props.filterData.filter == "alltab") {
                            if (this.props.caselist.caselist.length == 0) {
                                this.setState({loading: true})
                                this.props.fetchCaseList(params, false, this.state.offset)
                            } else {
                                this.setState({
                                    caselist: this.props.caselist.caselist,
                                    offset: this.props.caselist.offset + 1,
                                    loading: false,
                                    currentlist: this.props.caselist.currentlist
                                })
                            }
                        }
                    }
                    else{
                        this.setState({loading: false})
                    }
                })
            }
            else{
                this.setState({loading: false})
            }
        })
    }

    componentWillReceiveProps(nextProps){
        console.log("==abc",nextProps)
        const {offset,caselist} = this.state
        if(nextProps.filterData){
            if (nextProps.filterData.index == 0) {
                if (nextProps.filterData.filter == 'sort') {
                    this.setState({
                        loading: false,
                        offset: 0,
                        caselist: [],
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
                        caselist: this.props.caselist.caselist, offset: this.props.caselist.offset + 1, loading: false,
                        currentlist: this.props.caselist.currentlist, filter: '', filterType: ''
                    })
                } else if (nextProps.filterData.filter == 'filter') {
                    this.setState({
                        loading: false,
                        offset: 0,
                        caselist: [],
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
        if(nextProps.isActiveTab) {
            this.props.manageEditCase(false, false)
            this.onRefresh()
        }
        if(nextProps.caselist){
            console.log("Active tab ==",caselist,nextProps)
            if(!nextProps.caselist.error){
                if(nextProps.caselist.caselist.length > 0){
                    if(this.props.caselist.caselist != nextProps.caselist.caselist){
                        let newOffset =  offset + 1
                        console.log('new All Tab Offset:',newOffset)
                        this.setState({caselist:nextProps.caselist.caselist,loading:false,offset:newOffset,addMoreLoader:false,
                            currentlist:nextProps.caselist.currentlist,isFlatStop:false})
                    }
                }else{
                    if(offset != 0 ){
                        this.setState({isFlatStop:true,loading:false,addMoreLoader:false})
                    }
                }
            }else{
                this.setState({addMoreLoader:false,loading:false,isFlatStop:true,})
            }
        }
        if(nextProps.sortData){
            if (nextProps.filterData.index == 0) {
                if (!nextProps.sortData.error) {
                    if (nextProps.sortData.caselist.length > 0) {
                        if (this.props.sortData.caselist != nextProps.sortData.caselist) {
                            let newOffset = offset + 1
                            console.log('new All Tab Offset:', newOffset)
                            this.setState({
                                caselist: nextProps.sortData.caselist,
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
            if (nextProps.filterData.index == 0) {
                if (!nextProps.filterListData.error) {
                    if (nextProps.filterListData.caselist.length > 0) {
                        if (this.props.filterListData.caselist != nextProps.filterListData.caselist) {
                            let newOffset = offset + 1
                            console.log('new All Tab Offset:', newOffset)
                            this.setState({
                                caselist: nextProps.filterListData.caselist,
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
        if(nextProps.isPrayerClick.isPrayerClick){
            if(nextProps.isPrayerClick.caseId.length > 0){
                let filterCases = [];
                this.state.caselist.map((data, index) => {
                    if(data.token === nextProps.isPrayerClick.caseId){
                        data.isPray = true;
                        data.total_prays = parseInt(data.total_prays) + 1;
                    }
                    filterCases.push(data);
                })
                this.setState({caselist: filterCases,modalPrayerApi:false})
                console.log(nextProps.isPrayerClick.caseId)
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

        let self = this
        const {offset, caselist, currentlist} = this.state
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
        if(!cases.isPray){
            this.setState({cases: cases}, () => {
                this.setState({modalPrayerApi: true})
            })
        }
    }

    fetchData = () => {
        console.log("==fetch data calling===")
        let self = this
        const {offset,isRefresh,currentlist,caselist} = this.state
        console.log('offset',offset)
        this.setState({addMoreLoader:true})
        var strIds = currentlist.join()
        AsyncStorage.getItem('token').then((value) => {
            if(value) {
                AsyncStorage.getItem('healer').then((value2) => {
                    if(value2) {
                        let params = {url: 'caselist', body: {user_token: value,dataCount:offset,caseIdArray:strIds}}
                        console.log("new params===",params)
                        if(isRefresh){
                            this.setState({isRefresh:false},() => {
                                this.props.fetchCaseList(params,true)
                            })
                        }else {
                            this.props.fetchCaseList(params,false,offset)
                        }
                    }
                    else{
                        this.setState({loading: false})
                    }
                })
            }
            else{
                this.setState({loading: false})
            }
        })
    }

    onRefresh() {
        if(this.state.filter == 'sort'){
            this.sortcases(this.state.filterType)
        }else if(this.state.filter == 'filter'){
            this.filterCases(this.state.filterType)
        }else{
            this.setState({caselist:[],offset:0,isRefresh:true,isFlatStop:false,currentlist:[]}, () => {
                this.fetchData()
            })
        }
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
            let params = {url: 'casepray', body: {case_token: cases.token, user_token: value}}
            new RequestService(params).callCreate().then(res => {
                console.log('pray response', res)
                if (res.message === "Success") {
                    debugger;
                    this.props.setPointsPage(res.new_balance)
                    let filterCases = [];
                    this.state.caselist.map((data, index) => {
                        if(data.token === cases.token){
                            data.isPray = true;
                            data.total_prays = parseInt(cases.total_prays) + 1;
                        }
                        filterCases.push(data);
                    })
                    this.props.fetchPrayClick(true,'')
                    AsyncStorage.getItem('PrayerPointModal').then((value) => {
                        debugger;
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
                    const filtercase= this.state.caselist.filter((item)=>{return item.token !== cases.token});
                    console.log(res,'=======',filtercase)
                    this.setState({caselist: filtercase,modalPrayerApi:false})
                }
            }).catch(err => {
                console.log('pray error', err)
                this.setState({modalPrayerApi:false})
            })
        })
    }

    onSendPrayer = (cases) => {
        navigator.navigate('UserCaselistScreen',{token:cases.customer_token})
    }

    onCloseModal = () => {
        this.setState({redeemModal:false})
    }

    render() {
        console.disableYellowBox = true;
        const{offset} = this.state
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
                <PointImageModal visible={this.state.pointImageModal} />
                <BoostedModal isOpen={this.state.boostedModal}
                              message="Boosted cases get more visibility and prayers. A person can boost their case by redeeming the points they have accumulated."
                              onCloseModal={() => this.setState({boostedModal:false})}/>
                <View style={{flexDirection:'row',marginLeft:10,marginVertical:10}}>
                    <Text style={{color:'black',fontWeight:'bold'}}>Boosted Cases</Text>
                    <TouchableOpacity onPress={() => this.setState({boostedModal:true})}>
                        <Image source={require('../../../assets/info.png')}
                               style={{width:20,height:20, marginLeft:10}}
                               resizeMode={'contain'}/>
                    </TouchableOpacity>
                </View>

                {this.state.loading ? <Spinner/> :
                    <FlatList
                        style={{flex: 1}}
                        data = {this.state.caselist}
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.isRefresh}
                        ListFooterComponent={this.renderFooter()}
                        onEndReachedThreshold={0.1}
                        onEndReached={() => {
                            console.log("===reach end===",this.state.isFlatStop)
                            if (!this.state.isFlatStop && this.state.addMoreLoader == false){
                                if(this.state.filter == 'sort'){
                                    this.sortcases(this.state.filterType)
                                }else if(this.state.filter == 'filter'){
                                    this.filterCases(this.state.filterType)
                                }else{
                                    this.fetchData()
                                }
                            }
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem = {(item,index) => {
                            return <CaseListItem cases={item} onPrayClick={this.onPrayClick} isFilter={this.state.filter.length > 0 ? true : false} onNoofPrayerClick={this.noOfPrayerClick}
                                                 onImageClick={(arrImages) => {this.setState({imageProfile:arrImages,modalVisisble:true})}}
                                                 isMyCase={true}/>
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
        caselist: state.caselist,
        isActiveTab: state.editcaseManage.isActiveTab,
        filterData:state.filterData,
        sortData:state.sortCaselistData,
        filterListData:state.filterCaselistData,
        isPrayerClick: state.prayerclick,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({fetchCaseList,fetchPrayClick,manageEditCase,fetchSortCaseList,setFilterStatus,fetchFilterCaseList,setPointsPage}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AllCaseTab)

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
});
