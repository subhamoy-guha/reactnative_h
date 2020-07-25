import React, {Component} from 'react';
import {
    Modal, View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import {FontSize, Height, Width} from "../constants/dimensions";

export default class reedemAlert extends Component {
    constructor (props){
        super(props);
    }

    render() {
        const cases = this.props.cases
        return (
            <Modal animationType = {"none"} transparent = {true}
                   visible = {this.props.isOpen}
                   onRequestClose = {() => {
                       this.props.oncloseAlert()
                       console.log("Modal has been closed.") } }>

                <View  style = {styles.modal} onPress={() => {this.props.onCloseModal()}}>
                    <View style={[{height: 200},
                        styles.listViewStyle]} >
                        <Text style={{marginTop:20,color:'#EE6B9A',fontWeight:'bold'}}>Boost your healing request?</Text>
                        <Text style={{marginTop:20,color:'black',paddingHorizontal:20,textAlign:'center'}}>You are about to reedem {this.props.points} points to boost your case until {this.props.points} additional
                        prayers.</Text>
                        <Text style={{marginTop:20,color:'black',fontWeight:'bold'}}>Are you sure?</Text>
                        <View style={{height:50,width: '100%',position:'absolute',bottom:0}}>
                            <View style={{backgroundColor:'gray',height:1,width:'100%'}}/>
                            <View style={{flexDirection:'row',height:'100%'}}>
                                <TouchableOpacity onPress={() => this.props.oncloseAlert()} style={{width: '50%',height:'100%',alignItems:'center',justifyContent: 'center'}}>
                                    <Text style={{color:'gray'}}>Go back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.onApiCall()} style={{borderBottomRightRadius:10,width: '50%',height:'100%',alignItems:'center',justifyContent: 'center',backgroundColor:'#EE6B9A'}}>
                                    <Text style={{color:'white'}}>Boost</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
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
        borderRadius:10
    },
    pointText:{
        fontSize: FontSize( 22),
        color:'#FFF'
    }
})


