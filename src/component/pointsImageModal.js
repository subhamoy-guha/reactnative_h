import React, {Component} from 'react';
import {
    Modal,
    Image
} from 'react-native';

import ImageViewer from "react-native-image-zoom-viewer";
import {Height} from "../constants/dimensions";



export default class ImageModal extends Component {
    constructor (props){
        super(props);
        this.state = {
            selectedIndex: []
        }
    }


    render() {
        return (
            <Modal animationType = {"none"} transparent = {true}
                   visible = {this.props.visible}
                   onRequestClose = {() => { this.props.onCloseModal() } }>
                <Image style={{height: Height(100), width: Height(100)}}
                source={require('../../assets/source.gif')}
                resizeMode={'contain'}/>
            </Modal>
        );
    }
}


