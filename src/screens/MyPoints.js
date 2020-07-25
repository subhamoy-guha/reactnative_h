import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    TouchableWithoutFeedback,
    View,
    Text, TouchableOpacity, Animated, Image
} from 'react-native';
import {Height, Width, FontSize, isIphoneX, isIphone} from './../constants/dimensions'
import { ScrollView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Layout from './../constants/Layout'
import {Spinner} from './../component/spinner'
var SCREEN_WIDTH = Dimensions.get('window').width;
import HistoryScreen from "./HistoryScreen";
import ReedemScreen from "./ReedemScreen";
import { TabView, SceneMap,PagerPan } from 'react-native-tab-view';
import redeem from '../../assets/Reward_Points_Icon.png'
import navigator from "../services/navigator";
import {connect} from "react-redux";

class MyPointScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:false,
            points:[1,2],
            index: 0,
            routes: [
                { key: 'first', title: "Redeem" },
                { key: 'second', title: "History" },
            ]
        }
    }

    _handleToggleMenu = () => {
        //alert('j')
        this.props.navigation.openDrawer();
    }

    __renderNavigationBar() {
        return (
            <View key="navbar" style={[styles.navigationBarContainer]}>
                <TouchableHighlight underlayColor='transparent' onPress={this._handleToggleMenu}
                                    style={styles.navigationBarLeftButton}>
                    <Ionicons size={35} name="ios-menu" color="#EE6B9A"/>
                </TouchableHighlight>
                <View style={styles.navigationBarTitleContainer}>
                    <TouchableWithoutFeedback>
                        <View style={{flexDirection: 'row'}}>
                            <Text>My Points</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <TouchableHighlight onPress={() => this.setState({search: true, autofocus: true})}
                                    underlayColor='transparent'
                                    style={styles.navigationBarRightButton}>
                    <Image source={redeem} style={{height:30,width:30}} />

                </TouchableHighlight>
                <TouchableOpacity style={styles.navigationBarRightButton} onPress={() => navigator.navigate('MyPointScreen')}>
                    <Text style={{fontSize:12,color:'pink',fontWeight:'bold'}}>{this.props.points}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        console.log('render tab bar===',this.state.index)
        if(this.props.isChange){
            this.setState({index:this.props.Tab},() => {
                this.props.setMyCaselistTab(this.props.tab,false)
                return (
                    <View style={styles.tabBar}>
                        {props.navigationState.routes.map((route, i) => {
                            const color = props.position.interpolate({
                                inputRange,
                                outputRange: inputRange.map(inputIndex => (inputIndex === i ? '#333333' : '#767676'))
                            });
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.tabItem, this.state.index == i ? styles.selectedTab : {}]}
                                    onPress={() => {
                                        this.setState({ index: i })
                                    }}
                                >
                                    <Animated.Text style={{ color,fontSize:FontSize(12) }}>{route.title}</Animated.Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                );
            })
        }else{
            return (
                <View style={styles.tabBar}>
                    {props.navigationState.routes.map((route, i) => {
                        const color = props.position.interpolate({
                            inputRange,
                            outputRange: inputRange.map(inputIndex => (inputIndex === i ? '#333333' : '#767676'))
                        });
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[styles.tabItem, this.state.index == i ? styles.selectedTab : {}]}
                                onPress={() => {
                                    console.log("index===",i)
                                    this.setState({ index: i })
                                }}
                            >
                                <Animated.Text style={{ color,fontSize:FontSize(12) }}>{route.title}</Animated.Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            );
        }

    };

    tabViewIndexChange = (index) => {
        this.setState({ index });
    };

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? <Spinner/> : null}
                {this.__renderNavigationBar()}
                <View style={{height:1,wifth:'100%',backgroundColor:'#E2D5D9'}}/>
                <View style={{height:Height(15),width:'100%',backgroundColor:'#FFEAF0',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:20}}>Total Points</Text>
                    <Text style={{fontSize:30,fontWeight:'bold'}}>{this.props.points}</Text>
                </View>
                <View style={{height:1,wifth:'100%',backgroundColor:'#FFF'}}/>
                <TabView
                    navigationState={this.state}
                    onIndexChange={(index) => this.tabViewIndexChange(index)}
                    renderScene={SceneMap({
                        first: ReedemScreen,
                        second: HistoryScreen,
                    })}
                    renderTabBar={this.renderTabBar}
                    renderPager={(props) => <PagerPan {...props}/>}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return{
        points:state.points.points
    }
}

export default connect(mapStateToProps, null) (MyPointScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
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
    navigationBarTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop:Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/3 : 0,
        alignItems: 'center',
        justifyContent: Platform.OS === 'ios' ? 'center' : 'center',
    },
    navigationBarTitle: {
        fontSize: 17,
        letterSpacing: -0.5,
    },
    navigationBarRightButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/2.5 : 15,
        right: 15,
        height: 30,
        width: 30,
        alignItems:'center',
        justifyContent:'center'
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
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#f5f7f9'
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16
    },
    selectedTab: {
        borderBottomColor: '#000',
        borderBottomWidth: 2
    },
    scene: {
        flex: 1,
    },

});
