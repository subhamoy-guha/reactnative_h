import React, {Component} from 'react';
import {
    Modal, View, Text, TouchableOpacity, StyleSheet,Image
} from 'react-native';
import {FontSize, Height, Width} from "../constants/dimensions";
import redeem from "../../assets/Reward_Points_Icon.png";

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
                       this.props.onCloseModal()
                       console.log("Modal has been closed.") } }>

                <View  style = {styles.modal} onPress={() => {this.props.onCloseModal()}}>
                    <View style={[{height: 230},
                        styles.listViewStyle]} >
                        <View style={{position:'absolute',top:10,alignItems:'center',justifyContent: 'center'}}>
                            <Image source={redeem} size={{height:100,width:100}} />
                        </View>
                        <View style={{position:'absolute',top:10,alignItems:'center',justifyContent: 'center',height:60,width:60}}>
                            <Text style={{fontSize:25,color:'#EE6B9A',textAlign:'center',textAlignVertical:'center',fontWeight:'bold'}}>{this.props.points}</Text>
                        </View>
                        <Text style={{marginTop:80,color:'#EE6B9A',fontWeight:'bold'}}>Congratulations!</Text>
                        {this.props.isFromCreatecase == true ?
                            <Text style={{marginTop: 10, color: 'black', paddingHorizontal: 20, textAlign: 'center'}}>
                                You just earned {this.props.points} {this.props.points > 1 ?  "points" : "point"} for posting a case.
                            </Text> :
                            this.props.isComment == true ?
                            <Text style={{marginTop: 10, color: 'black', paddingHorizontal: 20, textAlign: 'center'}}>
                                You just earned {this.props.points} {this.props.points > 1 ?  "points" : "point"} for commenting on the case.
                            </Text> :
                                <Text style={{marginTop: 10, color: 'black', paddingHorizontal: 20, textAlign: 'center'}}>
                                    You just earned {this.props.points} {this.props.points > 1 ?  "points" : "point"} for sending your prayers to {this.props.name}
                                </Text>

                        }
                        <View style={{height:50,width: '100%',position:'absolute',bottom:0}}>
                            <View style={{backgroundColor:'gray',height:1,width:'100%'}}/>
                            <View style={{flexDirection:'row',height:'100%'}}>
                                <TouchableOpacity onPress={() => this.props.onCloseModal()} style={{borderBottomRightRadius:10,borderBottomLeftRadius:10,width: '100%',height:'100%',alignItems:'center',justifyContent: 'center',backgroundColor:'#EE6B9A'}}>
                                    <Text style={{color:'white'}}>OK</Text>
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


