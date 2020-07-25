import React, {Component} from 'react';
import {
    Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator, AsyncStorage,TouchableWithoutFeedback
} from 'react-native';
import {FontSize, Height, Width} from "../constants/dimensions";
import ReedemAlert from "./reedemAlert";

export default class pointsModal extends Component {
    constructor (props){
        super(props);
        this.state = {
            index: -1,
            isAlertOpen:false,
            points:[],
            id:'',
            selectedPoint:0
        }
    }

    closeAlert = () => {
        this.setState({isAlertOpen:false})
    }



    renderPoints = () => {
        const {index} = this.state
        return this.props.pointData.map((item,indexi) => {
            debugger;
            return(
                <TouchableOpacity onPress={() => item.points <= this.props.points ?
                    this.setState({index:indexi,id:item.id,selectedPoint:item.points}) : null} style={{backgroundColor: this.props.points >= item.points ? index == indexi?  '#FFF' : 'transparent' : 'transparent',width:'25%',height: '60%',alignItems:'center',justifyContent:'center'}}>
                    <Text style={[styles.pointText,{color:this.props.points >= item.points ? index == indexi ? '#d1266b' : 'white' : 'rgba(255,255,255,0.5)'}]}>+{item.points}</Text>
                    <Text style={{fontSize: FontSize( 10),color:this.props.points >= item.points ? index == indexi ?'black':'white' : 'rgba(255,255,255,0.5)'}}>Prayers</Text>
                </TouchableOpacity>
            )
        })
    }

    render() {
        const cases = this.props.cases
        return (
            <Modal animationType = {"none"} transparent = {true}
                   visible = {this.props.visible}
                   onRequestClose = {() => {
                       this.props.onCloseModal()
                       console.log("Modal has been closed.") } }>
                <ReedemAlert isOpen={this.state.isAlertOpen}
                             oncloseAlert={() => this.closeAlert()}
                             points={this.state.selectedPoint}
                             onApiCall={() => this.setState({isAlertOpen:false}, () => {
                                 this.props.onBoostPress(cases,this.state.id)
                             })}/>
                <TouchableOpacity  style = {styles.modal} onPress={() => {this.props.onCloseModal()}}>
                    <View style={[{height: '70%'},
                        styles.listViewStyle]} >
                        <Text style={{marginTop:20,color:'white'}}>Boost this case to receive additional prayers</Text>
                        <Text style={{marginTop:20,color:'white'}}>(1 point = 1 prayer)</Text>
                        <Text style={{marginTop:50,color:'white',fontSize:20}}>{this.props.points}</Text>
                        <Text style={{marginTop:20,color:'white'}}>Available Points</Text>
                        <View style={{width: Width(55), marginTop: Height(5),justifyContent:'center',flexDirection:'row'}}>
                            {this.renderPoints()}
                        </View>
                        <TouchableOpacity disabled={this.state.id.length == 0} onPress={() => {
                            this.setState({isAlertOpen:true})
                        }} style={{width:'80%',height:50,alignItems:'center',justifyContent: 'center',backgroundColor:'white'}}>
                            <Text style={{color:'#d1266b',fontSize: 15}}>Boost</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
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
        width: '100%',
        backgroundColor:'#d1266b',
        alignItems: 'center'
    },
    pointText:{
        fontSize: FontSize( 22),
        color:'#FFF'
    }
})


