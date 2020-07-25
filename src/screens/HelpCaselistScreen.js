import React,{Component} from 'react'
import {View, StyleSheet, Image, TouchableOpacity, Text, BackHandler} from 'react-native';

export default class HelpCaselistScreen extends Component{

    constructor(props) {
        super(props)
    }

    render(){
        const userToken=this.props.navigation.state.params?this.props.navigation.state.params.token :''
        return (
            <View style={styles.container}>
                <Image source={require('./../../assets/HEALINGG_Help_Screen.png')}
                       style={{width:'100%',height:'80%'}}
                       resizeMode={'contain'}/>
                <TouchableOpacity style={{position:'absolute',right:30,bottom:30}} onPress={() => {
                    this.props.navigation.navigate('ProfileScreen', {token: userToken || ''})}}>
                    <Text style={{fontSize:30,color:'white'}}>Get started ></Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FF5997',
    },
})