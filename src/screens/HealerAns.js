import React, {Component} from 'react';
import {View, Text, ImageBackground, Image, TouchableOpacity} from 'react-native';
import {FontSize, Height} from "../constants/dimensions";
import navigator from './../services/navigator';

export default class HealerAns extends Component{

    render(){
        const userToken=this.props.navigation.state.params?this.props.navigation.state.params.token :''
        return(
            <View>
                <ImageBackground style={{ height: '100%',width:'100%' }} source={require('./../../assets/background.png')}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: Height(5), height: Height(25) }}>
                        <Image style={{ height: Height(20), width: Height(20) }} resizeMode='contain' source={require('./../../assets/white_logo.png')} />
                    </View>
                    <View style={{alignItems:'center',marginTop:50}}>
                        <Text style={{fontSize:FontSize(25),color:'#fff'}}>Are you a</Text>
                        <Text style={{fontSize:FontSize(30),color:'#fff',fontWeight: 'bold'}}>Professional Healer?</Text>
                        <View style={{height:60,width:200,backgroundColor:'rgba(52, 52, 52, 0.5)',borderRadius:10,marginTop:20,
                            flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => {
                                navigator.navigate('ProfileScreen',{healer:'HEALER',token:userToken || ''})
                            }} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:FontSize(25),color:'#fff'}}>YES</Text>
                            </TouchableOpacity>
                            <View style={{width:1,backgroundColor:'grey'}}/>
                            <TouchableOpacity onPress={() => {

                                navigator.navigate('ProfileScreen',{healer:'NON-HEALER',token:userToken || ''})
                            }} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:FontSize(25),color:'#fff',fontWeight: 'bold'}}>NO</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}