import React, {Component} from 'react';
import {
    Modal
} from 'react-native';

import ImageViewer from "react-native-image-zoom-viewer";



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
                <ImageViewer index={0} imageUrls={this.props.imageProfile} enableImageZoom={true} enableSwipeDown={true} onSwipeDown={() => this.props.onSwipeDown()}/>
            </Modal>
        );
    }
}


