import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,Text, AsyncStorage
} from 'react-native';
import RequestService from "../services/RequestService";
import Moment from 'moment';
import CaseListItem from "./CaseListItem";



export default class NotificationScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            records:[],
            offset:0,
            isFlatStop:false,
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = () => {
        const {offset,records,totalPoints} = this.state
        AsyncStorage.getItem('token').then((value) => {
            if (value) {
                let params = {url: 'history/records', body: {user_token: value, dataCount : offset}}
                new RequestService(params).callCreate().then(res => {
                    if(res.message != "No records found"){
                        const newRecords = [...records,...res.records];
                        const newoffset = offset + 1;
                        this.setState({records:newRecords,offset:newoffset})
                    }else{
                        this.setState({isFlatStop:true})
                    }
                }).catch(err => {
                    console.log("history error==",err)
                })
            }
        })
    }

    renderItem = (item) => {
        return(
            <View>
                <Text style={{marginLeft:20,color:'gray'}}>{Moment(item.created_at).format('DD MMM YYYY hh:mm a')}</Text>
                <View style={{height:60,flexDirection:'row',justifyContent:'center',marginHorizontal:20,marginTop:2}}>
                    <Text style={{width:'62%',height:'100%',color:'black'}}>{item.reference}</Text>
                    <Text style={{width:'15%',height:'100%',justifyContent:'center',color:item.add > 0 ? 'green' : 'red',fontWeight:'bold',textAlign:'center'}} >{item.add > 0 ? "+" : "-" }{item.add > 0 ? item.add : item.less }</Text>
                    <Text style={{width:'23%',height:'100%',justifyContent:'center',color:'black',fontWeight:'bold',textAlign:'center'}} >{item.balance}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{height:60,flexDirection:'row',justifyContent:'center',marginHorizontal:20}}>
                    <View style={{width:'62%',height:'100%'}} />
                    <View style={{width:'15%',height:'100%',justifyContent:'center',alignItems:'center'}} ><Text>Points</Text></View>
                    <View style={{width:'23%',height:'100%',justifyContent:'center',alignItems:'center'}} ><Text>Balance</Text></View>
                </View>
                <FlatList
                    style={{flex: 1}}
                    data={this.state.records}
                    onEndReachedThreshold={0.7}
                    onEndReached={() => {
                        if (!this.state.isFlatStop){
                            this.fetchData()
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item,index }) => this.renderItem(item,index)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});
