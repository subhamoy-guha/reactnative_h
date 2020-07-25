import React, {Component} from 'react';
import {
    Platform,
    Animated,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
    TouchableHighlight,
    Dimensions,
    TouchableWithoutFeedback,
    View,
    ImageBackground,
    Image,
    TextInput,
    Text,
    AsyncStorage, Alert, Share,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Height, Width, FontSize, isIphoneX, isIphone} from './../constants/dimensions'
import {RotationGestureHandler, ScrollView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Layout from './../constants/Layout'
import {Collapse, CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import navigator from '../services/navigator';
import RequestService from '../services/RequestService';
import Toast from 'react-native-simple-toast';
import {Spinner} from './../component/spinner'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { manageEditCase } from '../Actions/manageEditCase';
import {shareAction} from "../Actions/shareAction";
import {setNotifiationPage} from '../Actions/setNotificationPage';
import ImagePickerNew from 'react-native-image-crop-picker';
var SCREEN_WIDTH = Dimensions.get('window').width;
import {SHARE_MESSAGE,SHARE_TITLE,SHARE_URL} from '../constants/config'

class ProfileScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            routes: [
                {key: 'first', title: 'All Cases'},
                {key: 'second', title: "Cases I've Prayed for (5)"}
            ],
            gender: 'FEMALE',
            photo: '',
            city:'',
            country_list: [],
            usertype: false,
            person_image:'',
            person_avatar:'',
            countryName:'- Select Country -',
            age:'',
            isMenu:true
        }
        this.user_token=''
    }

    componentWillMount() {
        AsyncStorage.getItem('token').then((value) => {
            console.log('========',value)
            this.user_token=value;
        })
        console.log('========',this.user_token)
    }

    componentDidMount() {
        let self = this
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            AsyncStorage.getItem('healer').then((value2) => {
                if(value2) {
                    navigator.navigate('Home')
                }
                // }  else{
                //     navigator.navigate('HealerAnsScreen')
                //
                // }
            })
            return true
        });
        const healer = this.props.navigation != undefined && this.props.navigation.state.params ? (this.props.navigation.state.params.healer !== undefined ? this.props.navigation.state.params.healer : '' ): ''
        console.log("Healler==",healer)
        if(healer.length > 0){
            this.setState({usertype: healer == "HEALER" ? true : false})
        }

        AsyncStorage.getItem('token').then((value) => {
            console.log('user token profile setting', value);
            if(value) {
                let params = {url: 'country_list', body: {user_token: value}}
                new RequestService(params).callCreate().then(res => {
                    if (res.country_list) {
                        self.setState({country_list: res.country_list})
                    } else {

                    }
                }).catch(err => {
                    // alert(JSON.stringify(err))
                })

                let params1 = {url: 'viewcustomerprofile', body: {user_token: value}}
                new RequestService(params1).callCreate().then(res => {
                    console.log('profile respone', res)
                    if (res.message == 'success') {
                        console.log('view profile', res);
                        if (res.usertype) {
                            self.setState({
                                name: res.name && res.name || '',
                                gender: res.gender && res.gender || '',
                                age: res.age && res.age || '',
                                email: res.email && res.email || '',
                                country: res.country && res.country || '',
                                countryName: res.country && res.country || '',
                                usertype: res.usertype && res.usertype == "HEALER" ? true : false || false,
                                photo: res.photo && res.photo || '',
                                city: res.city && res.city || '',
                                isMenu: true
                            })
                        } else {
                            self.setState({
                                name: res.name && res.name || '',
                                gender: res.gender && res.gender || '',
                                age: res.age && res.age || '',
                                email: res.email && res.email || '',
                                country: res.country && res.country || '',
                                countryName: res.country && res.country || '',
                                photo: res.photo && res.photo || '',
                                city: res.city && res.city || '',
                                isMenu:false
                            })
                        }
                    } else {

                    }
                }).catch(err => {
                    //alert(JSON.stringify(err))
                })

            } else {
                let params = {url: 'country_list', body: {user_token: this.props.navigation.state.params.token}}
                new RequestService(params).callCreate().then(res => {
                    if (res.country_list) {
                        self.setState({country_list: res.country_list})
                    } else {

                    }
                }).catch(err => {
                    //alert(JSON.stringify(err))
                })
                let params1 = {url: 'viewcustomerprofile', body: {user_token: this.props.navigation.state.params.token}}
                new RequestService(params1).callCreate().then(res => {
                    console.log('profile respone', res)
                    if (res.message == 'success') {
                        console.log('view profile', res);
                        if (res.usertype) {
                            self.setState({
                                name: res.name && res.name || '',
                                gender: res.gender && res.gender || '',
                                age: res.age && res.age || '',
                                email: res.email && res.email || '',
                                country: res.country && res.country || '',
                                usertype: res.usertype && res.usertype == "HEALER" ? true : false || false,
                                photo: res.photo && res.photo || '',
                                city: res.city && res.city || '',
                                isMenu: true
                            })
                        } else {
                            self.setState({
                                name: res.name && res.name || '',
                                gender: res.gender && res.gender || '',
                                age: res.age && res.age || '',
                                email: res.email && res.email || '',
                                country: res.country && res.country || '',
                                photo: res.photo && res.photo || '',
                                city: res.city && res.city || '',
                                isMenu:false
                            })
                        }

                    } else {

                    }
                }).catch(err => {
                    // alert(JSON.stringify(err))
                })

            }
        })
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        console.log("Profile Screen",nextProps)
        if(nextProps.isShare == true ){
            this.props.shareAction(false)
            this.onShare()
        }
        if(nextProps.notificationPage){
            this.props.setNotifiationPage(false)
            navigator.navigate('Home')
        }
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    _handleToggleMenu = () => {
        //alert('j')
        this.props.navigation.openDrawer();
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

    editProfile = () => {
        var vStr;
        if (this.state.person_image.path != undefined){
            vStr = this.state.person_image.path.split('/');
        }
        const photo = this.state.photo ? this.state.photo : vStr
        console.log(this.state.age && this.state.name && this.state.gender && this.state.country && photo)
        if ( this.state.age.length > 0 && this.state.age < 18) {
            Toast.show("Age must be greater than 18", Toast.LONG, Toast.BOTTOM)
        } else if(this.state.age && this.state.name && this.state.gender && this.state.country && photo){
            this.setState({loading: true})
            AsyncStorage.getItem('token').then((value) => {
                let userToken;
                if(value){
                    userToken=value;
                } else{
                    userToken= this.props.navigation.state.params.token;
                }
                let formdata = new FormData();
                formdata.append("user_token", userToken);
                formdata.append("name",this.state.name);
                formdata.append("age", this.state.age);
                formdata.append("gender", this.state.gender.toLowerCase());
                formdata.append('status', 'active');
                formdata.append("email", this.state.email);
                formdata.append("city", this.state.city.length > 0 ? this.state.city : '' );
                formdata.append("country", this.state.country);
                formdata.append("heals", this.state.healer);
                formdata.append("user_type", this.state.usertype ? "HEALER" : "NON-HEALER");
                if(this.state.person_image) {
                    const fileName = this.state.person_image.fileName != undefined ? this.state.person_image.fileName : vStr[vStr.length - 1]
                    formdata.append("photo", {
                        uri: Platform.OS === "android" ? this.state.person_image.path : this.state.person_image.path.replace("file://", ""),
                        type: this.state.person_image.mime,
                        name: fileName,
                    });
                }
                console.log('profile form data',formdata)
                AsyncStorage.setItem('username',this.state.name)
                fetch('https://cms.healingg.com/api/edit_customerprofile',{
                    method: 'post',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formdata
                }).then(response => {
                    console.log('profile res', response);
                    if(response.status == 200){
                        this.setState({loading: false,usertype:true})
                        this.props.manageEditCase(true,true)
                        AsyncStorage.setItem('healer', 'true')
                        if(!this.state.isMenu){
                            this.props.navigation.push('DrawerScreenNew',{navigation:this.props.navigation})
                        }else{
                            this.props.navigation.push('DrawerScreen',{navigation:this.props.navigation})
                        }

                    }else {
                        Toast.show("something went on server.", Toast.LONG, Toast.BOTTOM)
                        this.setState({loading: false,usertype:true})
                        this.props.manageEditCase(true,true)
                        AsyncStorage.setItem('healer', 'true')
                    }

                }).catch(err => {
                    console.log('profile err', err)
                    //   alert(JSON.stringify(err))
                    this.setState({loading: false})
                })
                // let params1 = {
                //     url: 'edit_customerprofile',
                //     body: {
                //         user_token: value,
                //         name: this.state.name,
                //         gender: this.state.gender,
                //         age: this.state.age,
                //         status: 'active',
                //         email: this.state.email,
                //         country: this.state.country,
                //         user_type: this.props.navigation.state.params ? this.props.navigation.state.params.healer : '',
                //     }
                // }
                // console.log('edsit profile', params1);
                // new RequestService(params1).callCreate().then(res => {
                //     console.log('profile res', res);
                //     this.setState({loading: false,usertype:true})
                //     navigator.navigate('Home')
                //     Toast.show(res.message, Toast.LONG, Toast.BOTTOM)
                // }).catch(err => {
                //     console.log('profile err', err)
                //     setTimeout(() => {
                //         alert(JSON.stringify(err))
                //     }, 500)
                //     this.setState({loading: false})
                //
                // })
            })
        } else {
            Toast.show("Please fill all details", Toast.LONG, Toast.BOTTOM)
        }
    }

    sendAlert = () => {
        Alert.alert(
            'Healingg',
            'Select your profile image',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'Take Photo', onPress: () => this.openCamera()},
                {text: 'Choose from Library', onPress: () => this.openGallery()},
            ],
            { cancelable: false }
        )
    }

    openGallery = () => {
        ImagePickerNew.openPicker({
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
            cropping: true
        }).then(image => {
            const source = {uri: image.path};
            console.log('image response', image)
            this.setState({
                person_image: image,
                person_avatar:source
            });
        });
    }

    openCamera = () => {
        ImagePickerNew.openCamera({
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
            cropping: true,
        }).then(image => {
            const source = {uri: image.path};
            console.log('image response', image)
            this.setState({
                person_image: image,
                person_avatar:source
            });
        });
    }

    selcetProfile = () => {
        // const options = {
        //     title: 'Select Profile Pic',
        //     storageOptions: {
        //         skipBackup: true,
        //         path: 'images',
        //     },
        // }
        // ImagePicker.showImagePicker(options, (response) => {
        //     console.log('Response = ', response);
        //
        //     if (response.didCancel) {
        //         console.log('User cancelled image picker');
        //     } else if (response.error) {
        //         console.log('ImagePicker Error: ', response.error);
        //     } else if (response.customButton) {
        //         console.log('User tapped custom button: ', response.customButton);
        //     } else {
        //         const source = {uri: response.uri};
        //
        //         // You can also display the image using data:
        //         // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        //
        //         this.setState({
        //             photo: response.uri,
        //         });
        //     }
        // });
        this.sendAlert()
    }

    __renderNavigationBar() {
        return (
            <View key="navbar" style={[styles.navigationBarContainer]}>
                {this.state.isMenu &&
                <TouchableHighlight underlayColor='transparent' onPress={this._handleToggleMenu}
                                    style={styles.navigationBarLeftButton}>
                    <Ionicons size={35} name="ios-menu" color="#EE6B9A"/>
                </TouchableHighlight>
                }
                <View style={styles.navigationBarTitleContainer}>
                    <TouchableWithoutFeedback

                    >
                        <View style={{flexDirection: 'row'}}>
                            <Text>Profile Settings</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }

    person_image_picker = () => {
        // const options = {
        //     title: 'Select profile Pic',
        //     storageOptions: {
        //         skipBackup: true,
        //         path: 'images',
        //     },
        // }
        // ImagePicker.showImagePicker(options, (response) => {
        //     console.log('Response = ', response);
        //     if (response.didCancel) {
        //         console.log('User cancelled image picker');
        //     } else if (response.error) {
        //         console.log('ImagePicker Error: ', response.error);
        //     } else if (response.customButton) {
        //         console.log('User tapped custom button: ', response.customButton);
        //     } else {
        //         const source = {uri: response.uri};
        //         console.log('image response', response)
        //         //You can also display the image using data: 
        //         //const source = {uri: 'data:image/jpeg;base64,' + response.data};
        //         this.setState({
        //             person_image: response,
        //             person_avatar:source
        //         });
        //     }
        // });
        this.sendAlert()
    }

    checkImageURL = (url) => {
        console.log("URL===", url)
        return <Image style={{height: Height(8), width: Height(8), tintColor: '#EE6B9A', alignSelf: 'center'}}
                      source={require('./../../assets/upload.png')}
                      resizeMode={'contain'}/>
        // fetch(url)
        //     .then(res => {
        //         debugger;
        //         if(res.status == 200){
        //             debugger;
        //             return <Image style={{height: '100%', width: '100%'}}
        //                           source={{uri: url }}/>
        //         }else{
        //             debugger;
        //             return <Image style={{height: Height(8), width: Height(8), tintColor: '#EE6B9A', alignSelf: 'center'}}
        //                           source={require('./../../assets/upload.png')}
        //                           resizeMode={'contain'}/>
        //         }
        //     })
        //     .catch(err=>{
        //         return <Image style={{height: Height(8), width: Height(8), tintColor: '#EE6B9A', alignSelf: 'center'}}
        //                       source={require('./../../assets/upload.png')}
        //                       resizeMode={'contain'}/>
        //     })
    }

    render() {
        console.log("photo",this.state.photo)
        return (
            <View style={styles.container}>
                {this.state.loading ? <Spinner/> : null}
                {!this.state.isMenu &&
                this.__renderNavigationBar()  }
                <ScrollView>
                    <View style={{height: Height(15), backgroundColor: '#F6C4D5'}}></View>
                    <TouchableOpacity style={{
                        alignSelf: 'center',
                        height: Height(20),
                        width: Height(20),
                        borderRadius: 2,
                        borderWidth: 2,
                        borderColor: '#EE6B9A',
                        justifyContent:'center',
                        alignItems:'center',
                        overflow: 'hidden',
                        zIndex: 99,
                        bottom: Height(8)
                    }} onPress={() => {
                        this.person_image_picker()
                    }}>
                        {this.state.person_avatar ? <Image source={this.state.person_avatar}
                                                           style={{height: '100%', width: '100%'}}
                                                           resizeMode={'stretch'}
                        />  : this.state.photo ? <Image style={{height: '100%', width: '100%'}}
                                                      source={{uri: this.state.photo }} onError={(e) => this.setState({photo: 'https://s3.us-east-2.amazonaws.com/healinggimagestest/default.png'})}/>
                                                      : <Image style={{height: Height(8), width: Height(8), tintColor: '#EE6B9A', alignSelf: 'center'}}
                                                                                                          source={require('./../../assets/upload.png')}
                                                                                                          resizeMode={'contain'}/>}


                    </TouchableOpacity>
                    <View style={{bottom: Height(8)}}>
                        <Text style={{alignSelf: 'center', paddingTop: Height(2)}}>Personal Details</Text>
                    </View>
                    <View style={{bottom: Height(8)}}>
                        <View style={{
                            marginTop: Height(2),
                            height: Height(8),
                            backgroundColor: '#EBF0F0',
                            justifyContent: 'center',
                            marginHorizontal: Width(8)
                        }}>
                            <TextInput value={this.state.name} onChangeText={(name) => {
                                if(name.length <= 30){
                                    this.setState({name})
                                } else{
                                    Alert.alert(
                                        'Healingg',
                                        "Name Cannot be more than 30 characters", [{
                                            text: 'Ok',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel'
                                        }], {
                                            cancelable: false
                                        })
                                }
                            }} style={{paddingLeft: Width(5)}} placeholder={"Name"}/>
                        </View>
                        <View style={{
                            marginTop: Height(2),
                            flexDirection: 'row',
                            height: Height(8),
                            backgroundColor: '#EBF0F0',
                            justifyContent: 'center',
                            marginHorizontal: Width(8)
                        }}>
                            <View style={{flex: 1, justifyContent: 'center'}}><Text
                                style={{paddingLeft: Width(5)}}>Gender</Text></View>
                            <View
                                style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}><TouchableOpacity
                                onPress={() => this.setState({gender: 'MALE'})}
                                style={[{flex: 1}, this.state.gender == 'MALE' ? {
                                    borderColor: '#8B8D92',
                                    borderWidth: 1,
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                    backgroundColor:'#A9AFB3'
                                } : {}]}><Text
                                style={[{width:'100%',height:'100%',textAlign:'center'},Platform.OS === 'ios' ? {marginTop:'40%'} : {textAlignVertical:'center'}, this.state.gender == 'MALE' ? {color: 'white'} : {}]}>Male</Text></TouchableOpacity><TouchableOpacity
                                onPress={() => this.setState({gender: 'FEMALE'})}
                                style={[{flex: 1}, this.state.gender == 'FEMALE' ? {
                                    borderColor: '#8B8D92',
                                    borderWidth: 1,
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                    backgroundColor:'#A9AFB3'
                                } : {}]}><Text
                                style={[{width:'100%',height:'100%',textAlign:'center'},Platform.OS === 'ios' ? {marginTop:'40%'} : {textAlignVertical:'center'}, this.state.gender == 'FEMALE' ? {color: 'white'} : {}]}>Female</Text></TouchableOpacity></View>
                        </View>
                        <View style={{
                            marginTop: Height(2),
                            height: Height(8),
                            backgroundColor: '#EBF0F0',
                            justifyContent: 'center',
                            marginHorizontal: Width(8)
                        }}>
                            <TextInput onChangeText={(age) => {
                                if(isNaN(age)){
                                    Alert.alert(
                                        'Healingg',
                                        "Please enter a valid age", [{
                                            text: 'Ok',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel'
                                        }], {
                                            cancelable: false
                                        })
                                }else{
                                    this.setState({age})
                                }}
                            } style={{paddingLeft: Width(5)}}
                                       keyboardType='number-pad' value={this.state.age.toString()}  placeholder={"Age"}/>
                        </View>
                        <View style={{
                            marginTop: Height(2),
                            height: Height(8),
                            backgroundColor: '#EBF0F0',
                            justifyContent: 'center',
                            marginHorizontal: Width(8)
                        }}>
                            <TextInput onChangeText={(city) => {
                                this.setState({city})
                            }}
                                       value={this.state.city}   style={{paddingLeft: Width(5)}}
                                       placeholder={"City/Town"} editable={this.state.healing_for == 'my self' ? false : true}/>
                        </View>
                        <Collapse isCollapsed={this.state.collapsed}
                                  onToggle={(isCollapsed) => this.setState({collapsed: isCollapsed})}
                                  style={{marginTop: Height(2), marginHorizontal: Width(8)}}>
                            <CollapseHeader
                                style={{height: Height(8), flexDirection: 'row', backgroundColor: '#EBF0F0'}}>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text style={{paddingLeft: Width(5)}}>{this.state.countryName == '' ? "--Select Country--" : this.state.countryName}</Text>
                                </View>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginRight: Width(2)
                                }}>
                                    <AntDesign name={this.state.collapsed ? "up" : "down"} size={25}/>
                                </View>
                            </CollapseHeader>
                            <CollapseBody>
                                {this.state.country_list.map((country, index) => {
                                    return <TouchableOpacity key={index} onPress={() => this.setState({
                                        country: country.country,
                                        collapsed: false,
                                        countryName:country.country
                                    })} style={{
                                        height: Height(6),
                                        borderBottomColor: '#ccc',
                                        borderBottomWidth: 1,
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{marginLeft: Width(4)}}>{country.country}</Text>
                                    </TouchableOpacity>
                                })}
                            </CollapseBody>
                        </Collapse>
                        <View style={{
                            marginTop: Height(2),
                            flexDirection: 'row',
                            height: Height(8),
                            backgroundColor: '#EBF0F0',
                            justifyContent: 'center',
                            marginHorizontal: Width(8)
                        }}>
                            <View style={{flex: 1, justifyContent: 'center'}}><Text
                                style={{paddingLeft: Width(5)}}>Are you a Professional Healer?</Text></View>
                            <View
                                style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}><TouchableOpacity
                                onPress={() => this.setState({usertype: true})}
                                style={[{flex: 1}, this.state.usertype == true ? {
                                    borderColor: '#8B8D92',
                                    borderWidth: 1,
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                    backgroundColor:'#A9AFB3'
                                } : {}]}><Text
                                style={[{width:'100%',height:'100%',textAlign:'center'},Platform.OS === 'ios' ? {marginTop:'40%'} : {textAlignVertical:'center'}, this.state.usertype == true ? {color: 'white'} : {}]}>YES</Text></TouchableOpacity><TouchableOpacity
                                onPress={() => this.setState({usertype: false})}
                                style={[{flex: 1}, this.state.usertype == false ? {
                                    borderColor: '#8B8D92',
                                    borderWidth: 1,
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                    backgroundColor:'#A9AFB3'
                                } : {}]}><Text
                                style={[{width:'100%',height:'100%',textAlign:'center'},Platform.OS === 'ios' ? {marginTop:'40%'} : {textAlignVertical:'center'}, this.state.usertype == false ? {color: 'white'} : {}]}>NO</Text></TouchableOpacity></View>
                        </View>
                        {/*{this.state.country ? <View style={{*/}
                        {/*    marginTop: Height(2),*/}
                        {/*    flexDirection: 'row',*/}
                        {/*    height: Height(8),*/}
                        {/*    backgroundColor: '#EBF0F0',*/}
                        {/*    justifyContent: 'center',*/}
                        {/*    marginHorizontal: Width(8),*/}
                        {/*    borderColor: '#be0055',*/}
                        {/*    borderWidth: 2*/}
                        {/*}}>*/}
                        {/*    <View style={{flex: 1, justifyContent: 'center'}}><Text*/}
                        {/*        style={{paddingLeft: Width(5)}}>{this.state.country}</Text></View>*/}
                        {/*    <View style={{*/}
                        {/*        flex: 1,*/}
                        {/*        justifyContent: 'flex-end',*/}
                        {/*        flexDirection: 'row',*/}
                        {/*        alignItems: 'center',*/}
                        {/*        marginRight: Width(2)*/}
                        {/*    }}><Entypo onPress={() => {*/}
                        {/*        this.setState({country: undefined})*/}
                        {/*    }} name="circle-with-cross" size={25}/></View>*/}
                        {/*</View> : null}*/}
                        <TouchableOpacity onPress={() => this.editProfile()} style={{
                            marginHorizontal: Width(14),
                            marginTop: Height(4),
                            height: Height(8),
                            backgroundColor: '#EE6A93',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{color: '#FFF'}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({manageEditCase,setNotifiationPage,shareAction}, dispatch)
    }
}

function mapStateToProps(state) {
    return{
        notificationPage: state.notificationPageManage.isCaseToken,
        isShare: state.shareData.isShare
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (ProfileScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
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
        top: Platform.OS === 'ios' ? Layout.HEADER_HEIGHT/5 : 0,
        right: 15,
        bottom: 0,
        height: Layout.HEADER_HEIGHT,
        width: Layout.HEADER_HEIGHT,
        justifyContent: 'center',
        zIndex: 2,
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
