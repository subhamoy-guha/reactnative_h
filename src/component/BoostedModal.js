import React, {Component} from 'react';
import {
    Modal, View, Text, TouchableOpacity, StyleSheet,Image
} from 'react-native';
import {FontSize, Height, Width} from "../constants/dimensions";
import redeem from "../../assets/Reward_Points_Icon.png";

export default class BoostedModal extends Component {
    constructor (props){
        super(props);
    }

    render() {
        const cases = this.props.cases
        return (
            <Modal animationType = {"none"} transparent = {true}
                   visible = {this.props.isOpen}
                   onRequestClose = {() => {
                       this.props.onCloseModal()
                       console.log("Modal has been closed.") } }>

                <View  style = {styles.modal} onPress={() => {this.props.onCloseModal()}}>
                    <View style={[{height: 200},
                        styles.listViewStyle]} >
                        <Text style={{marginTop:10,color:'#EE6B9A',fontWeight:'bold'}}>Boosted Cases</Text>
                        <Text style={{marginTop:10,color:'black',paddingHorizontal:50,textAlign:'center'}}>
                            {this.props.message}</Text>
                        <View style={{height:50,width: '100%',position:'absolute',bottom:0}}>
                            <View style={{backgroundColor:'gray',height:1,width:'100%'}}/>
                            <View style={{flexDirection:'row',height:'100%'}}>
                                <TouchableOpacity onPress={() => this.props.onCloseModal()} style={{borderBottomRightRadius:10,borderBottomLeftRadius:10,width: '100%',height:'100%',alignItems:'center',justifyContent: 'center',backgroundColor:'#EE6B9A'}}>
                                    <Text style={{color:'white'}}>Continue</Text>
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


