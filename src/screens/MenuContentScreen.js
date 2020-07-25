import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Platform,
    ScrollView, Dimensions, BackHandler, Share
} from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import Layout from "../constants/Layout";
import { Width} from "../constants/dimensions";
import HTML from 'react-native-render-html';
import navigator from "../services/navigator";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {shareAction} from "../Actions/shareAction";
import {SHARE_MESSAGE,SHARE_TITLE,SHARE_URL} from '../constants/config'



class MenuContentScreen extends Component{
    backHandler
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigator.navigate('Home')
            return true
        });
    }
    componentWillUpdate(nextProps, nextState, nextContext) {
        console.log("Profile Screen",nextProps)
        if(nextProps.isShare == true ){
            this.props.shareAction(false)
            this.onShare()
        }
    }

    onShare() {
        Share.share({
            message: SHARE_MESSAGE,
            url: SHARE_URL,
            title: SHARE_TITLE
        }, {
            // Android only:
            dialogTitle: SHARE_TITLE,
            // iOS only:
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToFacebook'
            ]
        })
    }

    _handleToggleMenu = ()=> {
        this.props.navigation.openDrawer();
    }

    __renderNavigationBar() {
        const pages = this.props.navigation.state.params.pages[0]
        return (
            <View key="navbar" style={[styles.navigationBarContainer]}>
                <TouchableHighlight underlayColor='transparent' onPress={this._handleToggleMenu}
                                    style={styles.navigationBarLeftButton}>
                    <Ionicons size={35} name="ios-menu" color="#EE6B9A"/>
                </TouchableHighlight>
                <View style={styles.navigationBarTitleContainer}>
                    <TouchableWithoutFeedback>
                        <View style={{flexDirection: 'row'}}>
                            <Text>{pages.pagetitle}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }

    render(){
        const pages = this.props.navigation.state.params.pages[0]
        return(
            <View style={styles.container}>
                {this.__renderNavigationBar()}
                <ScrollView style={{ flex: 1,marginLeft:10,marginRight:10 }} showsVerticalScrollIndicator={false}>
                    <HTML html={pages.content} imagesMaxWidth={Dimensions.get('window').width} />
                </ScrollView>
            </View>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({shareAction}, dispatch)
    }
}

function mapStateToProps(state) {
    return{
        isShare: state.shareData.isShare
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MenuContentScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    navigationBarContainer: {
        backgroundColor: '#fff',
        height: Layout.HEADER_HEIGHT,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        overflow: 'hidden',
        top: 0,
        left: 0,
        right: 0,
    },
    navigationBarLeftButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/5 : 0,
        left: Width(4),
        bottom: 0,
        height: Layout.HEADER_HEIGHT,
        width: Layout.HEADER_HEIGHT,
        justifyContent: 'center',
        zIndex: 2,
    },
    navigationBarTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop:Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/3 : 0,
        alignItems: 'center',
        justifyContent: Platform.OS === 'ios' ? 'center' : 'center',
    },
})