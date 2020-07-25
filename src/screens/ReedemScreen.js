import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList, Text, Image, TouchableOpacity, AsyncStorage
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'
import {FontSize, Height, Width} from "../constants/dimensions";
import {ScrollView} from "react-native-gesture-handler";
import navigator from "../services/navigator";
import ReedemAlert from '../component/reedemAlert';
import RequestService from "../services/RequestService";
import {setPointsPage} from "../Actions/setPoint";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {setNotifiationPage} from "../Actions/setNotificationPage";
import Toast from "react-native-simple-toast";


class NotificationScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:[],
            offset:0,
            isFlatStop:false,
            isAlertOpen:false,
            indexPoint:-1,
            selectedId:'',
            points:[],
            id:'',
            selectedPoint:0
        }
    }

    componentDidMount() {
        this.callApi()
        this.getPoints()
        this.fetchPoints()
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

    callApi = () => {
        const {offset,data} = this.state
        AsyncStorage.getItem('token').then((value) => {
            if (value) {
                let params = {url: 'my_cases_to_boost', body: {user_token: value, dataCount : offset}}
                new RequestService(params).callCreate().then(res => {
                    if(res.mySubmittedCases.length > 0){
                        const activeCases = res.mySubmittedCases
                        if(activeCases.length > 0){
                            const newRecords = [...data,...activeCases];
                            const newoffset = offset + 1;
                            this.setState({data:newRecords,offset:newoffset})
                        }
                    }
                }).catch(err => {
                    console.log("history error==",err)
                })
            }
        })
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

    closeAlert = () => {
        this.setState({isAlertOpen:false})
    }

    _renderPoints = (itemData) => {
        const {indexPoint,selectedId} = this.state
        return this.state.points.map((item,index) => {
            return(
                <TouchableOpacity
                    //disabled={item.points > this.props.points}
                    style={{width:'25%',height: '100%',
                    alignItems:'center',justifyContent:'center',backgroundColor: selectedId == itemData.token ?  indexPoint === index ?'#ff4b87' : '#ffcedd' : "white"}}
                                  onPress={() => {
                                      this.setState({indexPoint: item.points < this.props.points ? index :  this.state.indexPoint,selectedId: item.points < this.props.points ? itemData.token : this.state.selectedId,
                                          id:item.id,selectedPoint: item.points < this.props.points ? item.points : this.state.selectedPoint}, () => {
                                          if(item.points > this.props.points) {
                                              Toast.show(
                                                  'You do not have enough points to boost this case for +' + item.points  +' prayers.',
                                                  Toast.SHORT,
                                                  Toast.BOTTOM
                                              );
                                          }
                                      })}}>

                    <View style={{flexDirection:'row'}}>
                        <Text style={{marginTop:-1,fontSize: FontSize( 16),color:item.points <= this.props.points ? selectedId == itemData.token ?  indexPoint === index ?'white' : '#FF4B87' : "#FF4B87" : 'rgba(255,75,135,0.57)'}}>+</Text>
                        <Text style={[styles.pointText,{color:item.points <= this.props.points ? selectedId == itemData.token ?  indexPoint === index ?'white' : '#FF4B87' : "#FF4B87" : 'rgba(255,75,135,0.57)'}]}>{item.points}</Text>
                    </View>
                    <Text style={{fontSize: FontSize( 10),color:item.points <= this.props.points ? selectedId == itemData.token ?  indexPoint === index ?'white' : 'black' : "black" : 'rgba(0,0,0,0.57)'}}>Prayers</Text>
                </TouchableOpacity>
            )
        })
    }

    renderItem = (item,index) => {
        const isMySelf = item.healing_for == "myself" ? true : false
        const personImage=  item.person_name == null ? item.photo ? item.photo : item.person_image : item.person_image ? item.person_image : item.photo
        const thumbnail = isMySelf ? item.ownerThumbnail : item.thumbnail
        const countryName = item.country ? item.country : item.user_country;
        const age =  (item.isGroup == "yes") ? "Group" : isMySelf ?  item.ownerAge : item.age;
        const gender = isMySelf ? item.ownerGender : item.gender;
        const city = isMySelf ? item.city : item.caseCity;
        const personName= item.person_name ? item.person_name : item.name;
        const {indexPoint,selectedId, points} = this.state
        return(
            <TouchableOpacity  style={{width:'25%',height: '100%',
                alignItems:'center',justifyContent:'center',backgroundColor: selectedId == item.token ?  indexPoint === 0 ?'#ff4b87' : '#ffcedd' : "white"}}
                              onPress={() => {
                                  points[0].points <= this.props.points  ?
                                  this.setState({indexPoint:0,selectedId:item.token,id:points[0].id,selectedPoint:  points[0].points}) : ''
                              }} style={{flexDirection: 'row',height:100,marginBottom:10,backgroundColor:
                    selectedId == item.token ?  '#ffcedd' : "white"}}>
                <View style={{width: Width(16), marginTop: Height(2), marginLeft: Width(2)}}>
                    <View style={{
                        height: Height(10.5),
                        overflow: 'hidden',
                    }}>
                        {thumbnail &&
                        <Image style={{
                            width: Height(7), height: Height(7), borderRadius: Height(7) / 2
                        }} resizeMode={'cover'}
                               source={{uri: thumbnail}}
                        /> || personImage &&
                        <Image style={{
                            width: Height(7), height: Height(7), borderRadius: Height(7) / 2
                        }} resizeMode={'cover'}
                               source={{uri: personImage}}
                        /> ||
                        <Image style={{
                            width: Height(7),
                            height: Height(7), borderRadius: Height(7) / 2
                        }} resizeMode={'cover'}
                               source={require('../../assets/HEALINGG_Logo_Pink.png')}/>
                        }
                    </View>
                </View>
                <View style={{width: Width(28), marginTop: Height(2)}}>
                    <Text style={{fontSize: FontSize(12)}} numberOfLines = { 1 }>{item.category}</Text>
                    {(age >= 0 && age != "Group") ?
                        city ?
                            <Text
                                style={{
                                    fontSize: FontSize(14),
                                    color: '#000'
                                }}>{gender &&
                            `${gender.charAt(0).toUpperCase() + gender.toLowerCase().slice(1)},`}{age > 0  ?  age == 1 ? ` ${age} yr ` :  ` ${age} yrs ` : gender ? ' Infant ' : 'Infant '}
                                {`from ${city}, ${countryName}`} </Text> : <Text
                                style={{
                                    fontSize: FontSize(14),
                                    color: '#000'
                                }}>{gender &&
                            `${gender.charAt(0).toUpperCase() + gender.toLowerCase().slice(1)},`}{age > 0  ?  age == 1 ? ` ${age} yr ` :  ` ${age} yrs ` : gender ? ' Infant ' : 'Infant '}
                                {`from ${countryName}`} </Text>:
                        city  ?
                            <Text
                                style={{
                                    fontSize: FontSize( 14),
                                    color: '#000'
                                }}>{`From ${city}, ${countryName}`} </Text> :
                            <Text
                                style={{
                                    fontSize: FontSize( 14),
                                    color: '#000'
                                }}>{`From  ${countryName}`} </Text>
                    }
                    <Text style={{
                        fontSize: FontSize(14),
                        fontWeight: '700',
                        color: '#000'
                    }}>{personName}</Text>
                    {/*<View style={{flexDirection:'row',marginTop: 3,alignItems:'center'}}>*/}
                    {/*    <View style={{*/}
                    {/*        height: Height(1.2),*/}
                    {/*        width: Height(1.2),*/}
                    {/*        borderRadius: Height(1.2),*/}
                    {/*        borderColor: '#EE6A93',*/}
                    {/*        borderWidth: 2,*/}
                    {/*        marginTop: 2*/}
                    {/*    }}/>*/}

                    {/*    <Text style={{*/}
                    {/*        fontSize: FontSize(14),*/}
                    {/*        paddingLeft:5,*/}
                    {/*        color: '#000',*/}
                    {/*        fontWeight:'500'*/}
                    {/*    }} numberOfLines={1}>{item.title}</Text>*/}
                    {/*</View>*/}

                </View>
                <View style={{width: Width(55),justifyContent:'center',flexDirection:'row',paddingRight:10}}>
                    {this._renderPoints(item)}
                </View>
            </TouchableOpacity>
        )
    }

    boostApiCall = () => {
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'boost_case', body: {case_token: this.state.selectedId, user_token: value,points:this.state.id}}
            new RequestService(params).callCreate().then(res => {
                console.log('boost response', res)
                if (res.message === "Success") {
                    this.props.setPointsPage(res.new_points)
                    this.setState({isAlertOpen:false,data:[],indexPoint:-1,selectedId:'',offset:0},() => {
                        this.callApi()
                    })
                } else {
                    this.setState({isAlertOpen:false})
                }
            }).catch(err => {
                console.log('pray error', err)
                this.setState({isAlertOpen:false})
            })
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <ReedemAlert isOpen={this.state.isAlertOpen} points={this.state.selectedPoint} oncloseAlert={() => this.closeAlert()}
                             onApiCall={() => this.boostApiCall()}/>
                {this.state.data.length > 0 &&
                <View style={{height:Height(8),width:'100%',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:13,color: 'black'}}>Boost your cases for additional prayers</Text>
                    <Text style={{fontSize:12,fontStyle:'italic',marginTop:5,color:'#FF4B87'}}>(1 point = 1 prayer)</Text>
                </View> }
                <FlatList
                    style={{flex: 1}}
                    data={this.state.data}
                    onEndReachedThreshold={0.7}
                    onEndReached={() => {
                        if (!this.state.isFlatStop){
                            this.callApi()
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item,index }) => this.renderItem(item,index)}
                />
                {(this.state.data.length > 0 && this.state.selectedId.length > 0) &&
                <TouchableOpacity disabled={this.state.selectedId.length == 0} onPress={() => this.setState({isAlertOpen:true})}  style={{marginBottom:5,width:'90%',alignSelf:'center',height: 50,backgroundColor:'#EE6B9A',justifyContent:'center'}}>
                    <Text  style={{fontSize:FontSize(16),color:'#FFF',alignSelf:'center'}}>Boost</Text>
                </TouchableOpacity> }

            </View>
        );
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

export default connect(mapStateToProps, mapDispatchToProps) (NotificationScreen)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    pointText:{
        fontSize: FontSize( 19),
        color:'#FF4B87'
    }
});
