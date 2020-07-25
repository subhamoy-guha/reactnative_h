import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList, Text, TouchableOpacity, AsyncStorage, BackHandler, Alert
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'
import {FontSize, Height} from "../constants/dimensions";
import RequestService from "../services/RequestService";
import Toast from "react-native-simple-toast";
import {connect} from "react-redux";
import {settingAction} from "../Actions/saveSettings";
import {bindActionCreators} from "redux";

class NotificationScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isPrayer:false,
            isComment:false,
            savedPrayer:false,
            savedComment:false,
            isEdit:false,
        }
    }

    componentWillMount() {
        this.getNotificationApi()
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if(nextProps.setting == true ){
            this.props.settingAction(false,false)
            this.callUpdateNotiApi()
        }
    }

    getNotificationApi = () => {
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'get_customer_notification_settings', body: {user_token: value}}
            console.log("noti params==", params)
            new RequestService(params).callCreate().then(res => {
                console.log('noti response', res)
                const isPrayerNoti = res.prayer_notify == "1" ? true : false
                const isCommentNoti = res.comment_notify == "1" ? true : false
                debugger;
                this.setState({isPrayer:isPrayerNoti,isComment:isCommentNoti,savedPrayer:isPrayerNoti,savedComment:isCommentNoti})
            }).catch(err => {
                console.log('pray error', err)
                this.setState({pointsModal:false})
            })
        })
    }

    callUpdateNotiApi = () => {
        const {isPrayer,isComment} = this.state
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'customer_notification_settings', body: {user_token: value,
                    prayer_notify: isPrayer ? "yes" : "no",
                    comment_notify: isComment ? "yes" : "no"}}
            new RequestService(params).callCreate().then(res => {
                console.log('pray response', res)
                Toast.show(res.message, Toast.LONG, Toast.BOTTOM)
            }).catch(err => {
                console.log('pray error', err)
                this.setState({pointsModal:false})
            })
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{marginLeft:10,marginVertical:10,color:'black'}}>Notify me when:</Text>
                <View style={{height:1,marginHorizontal:10,backgroundColor: 'black'}}/>
                <View style={{height:60,width:'100%'}}>
                    <View style={{height:59,justifyContent:'center',flexDirection:'row'}}>
                        <View style={{width:'80%',justifyContent:'center'}}>
                            <Text style={{marginLeft:40,color:'black'}}>I receive a prayer on my Healingg request</Text>
                        </View>
                        <View style={{width:'20%',justifyContent:'center'}}>
                            <ToggleSwitch
                                isOn={this.state.isPrayer}
                                onColor='#EE6B9A'
                                offColor='#F6C4D5'
                                size='medium'
                                onToggle={(isOn) => {
                                    this.setState({isPrayer:isOn}, () => {
                                        debugger;
                                        if(this.state.savedPrayer != isOn){
                                            this.props.settingAction(false,true)
                                            this.setState({isEdit:true})
                                        }else{
                                            this.props.settingAction(false,false)
                                            this.setState({isEdit:false})
                                        }
                                    })
                                }}
                            />
                        </View>
                    </View>
                    <View style={{height:1,marginHorizontal:10,backgroundColor: 'lightgray'}}/>
                </View>
                <View style={{height:60,width:'100%'}}>
                    <View style={{height:59,justifyContent:'center',flexDirection:'row'}}>
                        <View style={{width:'80%',justifyContent:'center'}}>
                            <Text style={{marginLeft:40,color:'black'}}>I receive a comment on my Healingg request</Text>
                        </View>
                        <View style={{width:'20%',justifyContent:'center'}}>
                            <ToggleSwitch
                                isOn={this.state.isComment}
                                onColor='#EE6B9A'
                                offColor='#F6C4D5'
                                size='medium'
                                onToggle={(isOn) => {
                                    this.setState({isComment:isOn}, () => {
                                        if(this.state.savedComment != isOn){
                                            this.props.settingAction(false,true)
                                            this.setState({isEdit:true})
                                        }else{
                                            this.props.settingAction(false,false)
                                            this.setState({isEdit:true})
                                        }
                                    })
                                }}
                            />
                        </View>
                    </View>
                    <View style={{height:1,marginHorizontal:10,backgroundColor: 'lightgray'}}/>
                </View>
                <TouchableOpacity disabled={!this.state.isEdit} onPress={() => this.callUpdateNotiApi()}  style={{marginTop: 150,width:'90%',alignSelf:'center',height: 50,backgroundColor:'#EE6B9A',justifyContent:'center'}}>
                    <Text  style={{fontSize:FontSize(16),color:'#FFF',alignSelf:'center'}}>Save</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

function mapStateToProps(state) {
    console.log("noti==", state)
    return{
        setting:state.settingData.isSave
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({settingAction}, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps) (NotificationScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});
