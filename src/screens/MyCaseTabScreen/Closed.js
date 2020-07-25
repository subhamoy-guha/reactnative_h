import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    ImageBackground,
    Image,
    TextInput,
    Text,
    AsyncStorage, FlatList, ActivityIndicator
} from 'react-native';
import { RotationGestureHandler, ScrollView } from 'react-native-gesture-handler';
import RequestService from './../../services/RequestService';
import {Spinner} from "../../component/spinner";
import CaseListItem from "../CaseListItem";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchMyCaseList } from '../../Actions/fetchMyCaseList';
import ImageModal from "../../component/imageModal"
import PrayerModal from '../../component/prayerModal';
import Toast from "react-native-simple-toast";
import navigator from "../../services/navigator";


class AllCaseTab extends Component {
    constructor(props){
        super(props)
        this.state={
            caselist:[],
            loading:true,
            offset:0,
            isFlatStop:false,
            isRefresh:false,
            modalVisisble:false,
            imageProfile:[],
            modalPrayer: false,
            prayerList: {},
            casesPrayer:{}
        }
    }

    componentDidMount(){
        let self = this
        // AsyncStorage.getItem('token').then((value) => {
        //
        //     let formdata = new FormData();
        //     formdata.append("user_token", value);
        //
        //     fetch('http://healingg.innovination.com/api/my_cases', {
        //         method: 'post',
        //         body: formdata,
        //         headers: {
        //             //'Content-Type': 'application/x-www-form-urlencoded',
        //             // 'Accept': 'application/json',
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     }).then((response) => response.json())
        //         .then((responseData) => {
        //
        //             if (responseData.mySubmittedCases) {
        //                 let filterCases = [];
        //                 if(responseData.mySubmittedCases.length !== 0) {
        //                     responseData.mySubmittedCases.map((data, index) => {
        //                         filterCases.push(data);
        //                     });
        //                 }
        //                 const cases = filterCases.filter((item)=> { item.status==='closed'})
        //                 console.log('my closed cases', cases);
        //
        //                 self.setState({caselist: cases,loading:false})
        //
        //             } else {
        //                 self.setState({caselist: [],loading:false})
        //             }
        //
        //         }).catch(err => {
        //         self.setState({caselist: [],loading:false})
        //         console.log('my cases err', err);
        //         // alert(JSON.stringify(err))
        //     })
        // })
    }

    componentWillReceiveProps(nextProps){
        const {offset,caselist} = this.state
        console.log('props updated====')
        if(!nextProps.mycaselist.error){
            console.log(caselist,nextProps.mycaselist.mycaselist)
            if(nextProps.mycaselist.mycaselist.length > 0){
                if(this.props.mycaselist.mycaselist != nextProps.mycaselist.mycaselist){
                    let mycaselist = nextProps.mycaselist.mycaselist
                    var newOffset;
                    const cases = mycaselist.filter((item)=>{return item.status==='closed'})
                    var activeCase;
                    if(nextProps.mycaselist.isRefresh){
                        console.log("isRefresh called===",nextProps.mycaselist.allData.length)
                        activeCase = cases
                    }else{
                        if(cases.length > 0){
                            if (caselist.filter(e => e.caseId === cases[0].caseId).length == 0) {
                                activeCase = [...caselist,...cases]
                                newOffset =  offset + 1
                                console.log('new closed Offset:',newOffset)
                            }else{
                                activeCase = caselist
                                newOffset = offset
                            }
                        }else{
                            activeCase = caselist
                            newOffset = offset
                        }
                    }
                    console.log('my closed cases', activeCase);
                    this.setState({caselist:activeCase,loading:false,offset:newOffset})
                }
            }else{
                if(offset != 0 ){
                    this.setState({isFlatStop:true})
                }
            }
        }else{
            this.setState({loading:false})
        }

    }

    onPrayClick = (cases) => {
        console.log('pray click',this.props);
        //this.props.handleProps();
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'casepray', body: {case_token: cases.token, user_token: value}}
            new RequestService(params).callCreate().then(res => {
                console.log('pray response', res)
                if (res.message === "Success") {
                    //const filtercase= this.state.caselist.filter((item)=>{return item.token !== cases.token});
                    //console.log(res,'=======',filtercase)
                    let filterCases = [];
                    this.state.caselist.map((data, index) => {
                        if(data.token === cases.token){
                            data.isPray = true;
                        }
                        filterCases.push(data);
                    })
                    this.setState({caselist: filterCases})
                    // let params = {url: 'caselist', body: {user_token: value}}
                    // new RequestService(params).callCreate().then(res => {
                    //     if (res.caselist) {
                    //  this.setState({caselist: filtercase})
                    //     } else {
                    //
                    //     }
                    // }).catch(err => {
                    //     alert(JSON.stringify(err))
                    // })
                } else {
                    const filtercase= this.state.caselist
                    console.log(res,'=======',filtercase)
                    this.setState({caselist: filtercase})
                }
            }).catch(err => {
                console.log('pray error', err)
                //alert(JSON.stringify(err))
            })
        })
    }

    fetchData = () => {
        let self = this
        const {offset,isRefresh} = this.state
        console.log("===fetch data calling====")
        console.log('offset',offset)
        AsyncStorage.getItem('token').then((value) => {
            let formdata = new FormData();
            formdata.append("user_token", value);
            formdata.append("dataCount", offset);
            if(isRefresh){
                this.setState({isRefresh:false},() => {
                    this.props.fetchMyCaseList(formdata,true,offset)
                })
            }else {
                this.props.fetchMyCaseList(formdata,false,offset)
            }
        })
    }

    onRefresh() {
        this.setState({caselist:[],offset:0,isRefresh:true}, () => {
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
            let params = {url: 'prayerlist', body: {case_token: cases.token, user_token: value,dataCount:0}}
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
                //alert(JSON.stringify(err))
            })
        })
    }

    onSendPrayer = (cases) => {
        navigator.navigate('UserCaselistScreen',{token:cases.customer_token})
    }

    render() {
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
                { this.state.caselist.length > 0 ?
                <FlatList
                    style={{flex: 1}}
                    data = {this.state.caselist}
                    onEndReachedThreshold={0.7}
                    onEndReached={() => {
                        if (!this.state.isFlatStop){
                            this.fetchData()
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem = {(item,index) => {
                        return <CaseListItem cases={item} onPrayClick={this.onPrayClick} onNoofPrayerClick={this.noOfPrayerClick}
                                             isMyCases={true} tab={3} onImageClick={(arrImages) => {
                            this.setState({imageProfile:arrImages,modalVisisble:true})
                        }
                        }/>
                    }
                    }
                /> :
                    <Text> No cases found </Text>

                }
            </View>
        );
    }
}

function mapStateToProps(state) {
    return{
        mycaselist: state.mycaselist,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({fetchMyCaseList}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AllCaseTab)

const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor: 'white'

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
