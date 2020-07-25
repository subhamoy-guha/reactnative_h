import React,{Component} from 'react'
import {View, StyleSheet, Image, TouchableOpacity, Text, BackHandler, AsyncStorage} from 'react-native';

export default class HelpCaselistScreen extends Component{

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        AsyncStorage.setItem('isHelpScreen', "true")
    }

    render(){
        const userToken=this.props.navigation.state.params?this.props.navigation.state.params.token :''
        return (
            <View style={styles.container}>
                <Image source={require('./../../assets/infographics.png')}
                       style={{width:'100%',height:'80%'}}
                       resizeMode={'contain'}/>
                <TouchableOpacity style={{position:'absolute',bottom:20,left:30,right:30,
                    alignItems:'center',justifyContent: 'center'}}
                                  onPress={() => {
                                      console.log("button click")
                                      this.props.navigation.navigate('LoginScreen')
                                  }}>
                    <Image source={require('./../../assets/Intro_button.png')}
                           style={{width:'100%',height:100}}
                           resizeMode={'contain'}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F7F9',
    },
})