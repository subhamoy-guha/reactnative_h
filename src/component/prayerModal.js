import React, {Component} from 'react';
import {
    Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator, AsyncStorage,TouchableWithoutFeedback
} from 'react-native';
import {FontSize, Height, Width} from "../constants/dimensions";
import RequestService from "../services/RequestService";
import Moment from 'moment';

export default class prayerModal extends Component {
    constructor (props){
        super(props);
        this.state = {
            isFlatStop:false,
            offset:1,
            addMoreLoader: false,
            isRefresh:false
        }
    }

    caseListItem = (item,index) => {
        console.log("List Itemmm==",item)
        return(
            <View style={{width:'100%',height: 60}}>
                <View style={{width:'100%',  marginHorizontal: Width(2) ,
                    flexDirection: 'row'}}>
                    {item.photo &&
                    <Image style={{
                        width: 40, height: 40, borderRadius: 20,
                    }} resizeMode={'cover'}
                           source={{uri: item.thumbnail ? item.thumbnail : item.photo}}
                    /> ||
                    <Image style={{
                        width: 40, height: 40, borderRadius: 20,
                    }} resizeMode={'cover'}
                           source={require('../../assets/HEALINGG_Logo_Pink.png')}

                    />}
                    <View style={{width: Width(40),marginLeft: 15 ,flexDirection: 'column'}}>
                        <Text style={{fontSize: FontSize(13)}} numberOfLines = { 1 }>{Moment(item.datetime).format('DD MMM YYYY hh:mm a')}</Text>
                        <Text style={{fontSize: FontSize(17),color:'black',fontWeight:'bold'}} numberOfLines = { 1 }>{item.name}</Text>
                    </View>
                    {item.active_cases > 0 &&
                    <View style={{position:'absolute',height:'100%',justifyContent:'center',alignItems:'center',right:20}}>
                        <TouchableOpacity  onPress={() => this.props.onSendPrayerPress(item)}>
                            <Text style={{fontSize: FontSize( 10),color:'#FF4B87',textAlign:'right'}}>Send Prayers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={() => this.props.onSendPrayerPress(item)}>
                            <Text style={{ fontSize: FontSize( 10),textAlign:'right',height:20}}>
                                {item.active_cases} {item.active_cases <= 1 ? "Active Case" : "Active Cases"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    }
                </View>
                <View style={{width: Width(100), height: 1, backgroundColor: '#ccc',marginTop:10,marginBottom:10}}></View>
            </View>
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

    getPrayerListData = () => {
        const cases = this.props.cases
        var offset = this.props.indexCount
        var currentOffset = offset[offset.length - 1]
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'prayerlist', body: {case_token: cases.token, user_token: value,dataCount: currentOffset}}
            console.log("==prayerlist params====",params)
            new RequestService(params).callCreate().then(res => {
                console.log('pray response', res)
                if (res.message) {
                    this.setState({isFlatStop:true})
                } else {
                    console.log("Prayer List===",res.users)
                    let newOffset = currentOffset + 1
                    offset.push(newOffset)
                    console.log('new Offset:', this.props.indexCount)
                    if (res.users.length !== 0) {
                        res.users.map((data, index) => {
                            this.props.prayerList.push(data)
                        });
                    }
                    console.log('new Prayerlist:', this.props.prayerList)
                    this.setState({
                        isRefresh:true,
                        offset:newOffset
                    })
                }
            }).catch(err => {
                console.log('pray error', err)
                alert(JSON.stringify(err))
            })
        })
    }

    render() {
        return (
            <Modal animationType = {"none"} transparent = {true}
                   visible = {this.props.visible}
                   onRequestClose = {() => {
                       this.props.onCloseModal()
                       console.log("Modal has been closed.") } }>

                <View  style = {styles.modal}>
                    <View style={[{height: (this.props.prayerList.length > 5 ? 350 : ((this.props.prayerList.length * 60) + 50))},
                        styles.listViewStyle]}>
                        <View style={{width:'100%',height:40,backgroundColor:'#EBEBEB',alignItems:'flex-start',justifyContent:'center',marginBottom:10}}>
                            <Text style={{color:'black',alignSelf: 'flex-start',fontStyle: 'italic',marginLeft:15}}>Prayers sent by:</Text>
                        </View>
                        <FlatList
                            style={{width: '100%'}}
                            data = {this.props.prayerList}
                            ListFooterComponent={
                                this.renderFooter()
                            }
                            onEndReachedThreshold={0.1}
                            onEndReached={() => {
                                console.log("====",this.state.isFlatStop,this.state.addMoreLoader)
                                this.getPrayerListData()
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state.isRefresh}
                            renderItem = {({item, index}) => this.caseListItem(item, index)}
                        />
                        <TouchableOpacity onPress={() => {this.props.onCloseModal()}} style={{position:'absolute',top:0,right:0}}>
                            <Image source={require('../../assets/close.png')}
                                   style={{width:40,height:40}}
                                   resizeMode={'stretch'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create ({
    modal: {
        flex:1,
        alignItems: 'center',
        backgroundColor: 'rgba(1,1,1,0.8)',
        justifyContent: 'center',
    },
    listViewStyle:{
        width: '80%',
        backgroundColor:'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
})


