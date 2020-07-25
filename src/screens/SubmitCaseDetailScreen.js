import React, {Component} from 'react';
import {
    Platform,
    Animated,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    BackHandler,
    TouchableWithoutFeedback,
    View,
    ImageBackground,
    Image,
    TextInput,
    Text, AsyncStorage, Alert, KeyboardAvoidingView
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Height, Width, FontSize, isIphoneX, isIphone} from './../constants/dimensions'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Layout from './../constants/Layout'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import {ScrollView} from 'react-native-gesture-handler';
import {Collapse, CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import navigator from '../services/navigator';
import ImagePicker from 'react-native-image-picker';
import RequestService from '../services/RequestService';
import Toast from 'react-native-simple-toast';
import {Spinner} from './../component/spinner';
import ImagePickerNew from 'react-native-image-crop-picker';
import {setNotifiationPage} from '../Actions/setNotificationPage';
import {setPointsPage} from "../Actions/setPoint";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReedemModal from '../component/ReedemPointsAlert';
import PointImageModal from "../component/pointsImageModal";
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;


class SubmitCaseDetailScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            routes: [
                {key: 'first', title: 'All Cases'},
                {key: 'second', title: "Cases I've Prayed for (5)"}
            ],
            healingIndex: 0,
            caseIndex: 0,
            gender: '',
            photo: null,
            country_list: [],
            suffering_list: [],
            suffering: '',
            category_id: this.props.navigation.state.params.category_id,
            category_name: this.props.navigation.state.params.category_name,
            isGroup: this.props.navigation.state.params.isGroup,
            healing_for: this.props.navigation.state.params.healing_for,
            case_image_1: '',
            avatar_image_1: '',
            case_image_2: '',
            avatar_image_2: '',
            case_image_3: '',
            avatar_image_3: '',
            case_image_4: '',
            avatar_image_4: '',
            person_image: '',
            person_avatar: '',
            case_description:'',
            age:'',
            city:'',
            countryName:'- Select Country - *',
            sufferingText:'- Suffering since - *',
            userImage:'',
            redeemPoints:0,
            redeemModal:false,
            pointImageModal: false,
            enable: false,
        }
        this.user_token = ''
        console.log('this.props.navigation.state.params.healing_for', this.props.navigation.state.params.healing_for)
    }

    componentWillMount() {
        AsyncStorage.getItem('token').then((value) => {
            this.user_token = value;
        })
    }

    componentDidMount() {
        let self = this
        SplashScreen.hide()
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigator.navigate('SubmitCaseScreen')
            return true
        });
        AsyncStorage.getItem('token').then((value) => {
            let params = {url: 'country_list', body: {user_token: value}}
            new RequestService(params).callCreate().then(res => {
                if (res.country_list) {
                    self.setState({country_list: res.country_list})
                } else {

                }
            }).catch(err => {
                // alert(JSON.stringify(err))
            })
            let params2 = {url: 'suffering_since', body: {user_token: value}};
            new RequestService(params2).callCreate().then(res => {
                console.log('sinceee', res)
                if (res.suffering_since) {
                    this.setState({suffering_list: res.suffering_since})
                    this.forceUpdate()
                } else {

                }
            }).catch(err => {
                //alert(JSON.stringify(err))
            })
            let params3 = {url: 'viewcustomerprofile', body: {user_token: value}}
            new RequestService(params3).callCreate().then(res => {
                console.log('profile respone', res)
                if (res.message == 'success') {
                    console.log('view profile', res);
                    this.setState({
                        my_name: res.name,
                        my_gender: res.gender,
                        my_age: res.age,
                        my_country: res.country,
                        my_photo: res.photo
                    })

                } else {

                }
            }).catch(err => {
                //alert(JSON.stringify(err))
            })
        })

        if (this.state.healing_for == 'my self'){
            AsyncStorage.getItem('token').then((value) => {
                console.log('user token', value);
                if(value) {
                    let params1 = {url: 'viewcustomerprofile', body: {user_token: value}}
                    new RequestService(params1).callCreate().then(res => {
                        console.log('profile respone', res)
                        if (res.message == 'success') {
                            console.log('view profile', res);
                            self.setState({
                                person_name: res.name && res.name  || '',
                                gender: res.gender && res.gender || '',
                                age: res.age && res.age || '',
                                email: res.email && res.email || '',
                                countryName: res.country && res.country || '',
                                userImage: res.photo && res.photo || '',
                                city:res.city && res.city || ''
                            })
                        } else {

                        }
                    }).catch(err => {
                        //alert(JSON.stringify(err))
                    })
                }
            })
        }
    }

    _handleToggleMenu = () => {
        //alert('j')
        this.props.navigation.openDrawer();
    }

    onSelect(index, value) {
        this.setState({
            text: `Selected index: ${index} , value: ${value}`, healingIndex: index
        })
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        console.log("Profile Screen",nextProps)
        if(nextProps.notificationPage){
            this.props.setNotifiationPage(false)
            navigator.navigate('Home')
        }
    }

    // createCase = () => {
    //     if (this.state.person_name && this.state.age && this.state.case_title && this.state.case_description && this.state.suffering_since && this.state.country) {
    //         this.setState({loading: true})
    //         let self = this
    //         AsyncStorage.getItem('token').then((value) => {
    //             let body = {
    //                 user_token: value,
    //                 person_name: this.state.person_name,
    //                 age: this.state.age,
    //                 gender: this.state.gender,
    //                 case_title: this.state.case_title,
    //                 case_description: this.state.case_description,
    //                 suffering_since: this.state.suffering_since,
    //                 country: this.state.country.country,
    //                 case_image_1: this.state.case_image_1,
    //                 category_id: this.state.category_id
    //             }
    //             console.log(body);
    //             let params = {url: 'create_case', body: body}
    //             new RequestService(params).callCreate().then(res => {
    //                 self.setState({loading: false})
    //                 Toast.show(res.message, Toast.LONG, Toast.BOTTOM)
    //             }).catch(err => {
    //                 self.setState({loading: false})
    //                 setTimeout(() => {
    //                     alert(JSON.stringify(err))
    //                 }, 500)
    //             })
    //         })
    //     } else {
    //         Toast.show('Please fill up all details', Toast.LONG, Toast.BOTTOM)
    //     }
    // }

    createCase = () => {
        this.setState({enable:true})
        if (this.state.healing_for !== 'my self') {
            if(this.state.category_name == "Individual" || this.state.category_name == "Pets"){
                if (this.state.country && this.state.person_name && this.state.gender && this.state.age && this.state.case_title && this.state.case_description && this.state.suffering) {
                    this.setState({loading: true})
                    let self = this
                    AsyncStorage.getItem('token').then((value) => {
                            let formdata = new FormData();
                            formdata.append("user_token", value);
                            formdata.append("person_name", this.state.person_name);
                            formdata.append("case_title", this.state.case_title);
                            formdata.append("case_description", this.state.case_description);
                            formdata.append("category_id", this.state.category_id);
                            formdata.append("city", this.state.city.length > 0 ? this.state.city : "");
                            formdata.append("country", this.state.country.country);
                            formdata.append("gender", this.state.gender.toLocaleLowerCase());
                            formdata.append("age", this.state.age.toString());
                            formdata.append("suffering_since", this.state.suffering.id.toString());
                            formdata.append("healing_for", this.state.healing_for);
                            if (this.state.person_image) {
                                var vStr = this.state.person_image.path.split('/');
                                const fileName = this.state.person_image.fileName != undefined ? this.state.person_image.fileName : vStr[vStr.length - 1]
                                formdata.append("person_image", {
                                    uri: Platform.OS === "android" ? this.state.person_image.path : this.state.person_image.path.replace("file://", ""),
                                    type: this.state.person_image.mime,
                                    name: fileName,
                                });
                            }
                            if (this.state.case_image_1) {
                                var vStr = this.state.case_image_1.path.split('/');
                                const fileName = this.state.case_image_1.fileName != undefined ? this.state.case_image_1.fileName : vStr[vStr.length - 1]
                                formdata.append("case_image_1", {
                                    uri: Platform.OS === "android" ? this.state.case_image_1.path : this.state.case_image_1.path.replace("file://", ""),
                                    type: this.state.case_image_1.mime,
                                    name: fileName,
                                });
                            }
                            if (this.state.case_image_2) {
                                var vStr = this.state.case_image_2.path.split('/');
                                const fileName = this.state.case_image_2.fileName != undefined ? this.state.case_image_2.fileName : vStr[vStr.length - 1]
                                formdata.append("case_image_2", {
                                    uri: Platform.OS === "android" ? this.state.case_image_2.path : this.state.case_image_2.path.replace("file://", ""),
                                    type: this.state.case_image_2.mime,
                                    name: fileName,
                                });
                            }
                            if (this.state.case_image_3) {
                                var vStr = this.state.case_image_3.path.split('/');
                                const fileName = this.state.case_image_3.fileName != undefined ? this.state.case_image_3.fileName : vStr[vStr.length - 1]
                                formdata.append("case_image_3", {
                                    uri: Platform.OS === "android" ? this.state.case_image_3.path : this.state.case_image_3.path.replace("file://", ""),
                                    type: this.state.case_image_3.mime,
                                    name: fileName,
                                });
                            }
                            if (this.state.case_image_4) {
                                var vStr = this.state.case_image_4.path.split('/');
                                const fileName = this.state.case_image_4.fileName != undefined ? this.state.case_image_4.fileName : vStr[vStr.length - 1]
                                formdata.append("case_image_4", {
                                    uri: Platform.OS === "android" ? this.state.case_image_4.path : this.state.case_image_4.path.replace("file://", ""),
                                    type: this.state.case_image_4.mime,
                                    name: fileName,
                                });
                            }
                            console.log('formdata', formdata);
                            fetch('https://cms.healingg.com/api/create_case', {
                                method: 'post',
                                body: formdata,
                                headers: {
                                    //'Content-Type': 'application/x-www-form-urlencoded',
                                    // 'Accept': 'application/json',
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then((responseData) => {
                                responseData.json().then(res => {
                                    console.log('create case', res)
                                    this.setState({enable:false})
                                    this.props.setPointsPage(res.new_balance)
                                    AsyncStorage.getItem('registerTask').then((value) => {
                                        if(value == 'true') {
                                            this.setState({redeemPoints:res.points_awarded,pointImageModal:false,redeemModal:false},() => {
                                                this.timeoutHandle = setTimeout(()=>{
                                                    // Add your logic for the transition
                                                    this.setState({ pointImageModal: false })
                                                    navigator.navigate('Home')
                                                }, 1000);
                                            })
                                        }else{
                                            AsyncStorage.setItem('registerTask','true')
                                            this.setState({redeemPoints:res.points_awarded,redeemModal:true})
                                        }
                                    })

                                })

                                Toast.show('Thank You! Your case has been posted. ', Toast.LONG, Toast.BOTTOM)
                                this.setState({loading: false})
                                //navigator.navigate('Home')
                            }).catch(err => {
                                this.setState({loading: false, enable:false})
                                console.log(err)
                                Toast.show('Error while create case', Toast.LONG, Toast.BOTTOM)
                            })
                        }
                    )
                } else {
                    Toast.show('Fields marked with * are mandatory', Toast.LONG, Toast.BOTTOM)
                }
            }else{
                if (this.state.country && this.state.person_name  && this.state.case_title && this.state.case_description && this.state.suffering) {
                    this.setState({loading: true})
                    let self = this
                    AsyncStorage.getItem('token').then((value) => {
                            let formdata = new FormData();
                            formdata.append("user_token", value);
                            formdata.append("person_name", this.state.person_name);
                            formdata.append("city", this.state.city.length > 0 ? this.state.city : "");
                            formdata.append("country", this.state.country.country);
                            formdata.append("case_title", this.state.case_title);
                            formdata.append("case_description", this.state.case_description);
                            formdata.append("category_id", this.state.category_id);
                            formdata.append("suffering_since", this.state.suffering.id.toString());
                            formdata.append("healing_for", this.state.healing_for);
                            if (this.state.person_image) {
                                var vStr = this.state.person_image.path.split('/');
                                const fileName = this.state.person_image.fileName != undefined ? this.state.person_image.fileName : vStr[vStr.length - 1]
                                formdata.append("person_image", {
                                    uri: Platform.OS === "android" ? this.state.person_image.path : this.state.person_image.path.replace("file://", ""),
                                    type: this.state.person_image.mime,
                                    name: fileName,
                                });
                            }
                            if (this.state.case_image_1) {
                                var vStr = this.state.case_image_1.path.split('/');
                                const fileName = this.state.case_image_1.fileName != undefined ? this.state.case_image_1.fileName : vStr[vStr.length - 1]
                                formdata.append("case_image_1", {
                                    uri: Platform.OS === "android" ? this.state.case_image_1.path : this.state.case_image_1.path.replace("file://", ""),
                                    type: this.state.case_image_1.mime,
                                    name: fileName,
                                });
                            }
                            if (this.state.case_image_2) {
                                var vStr = this.state.case_image_2.path.split('/');
                                const fileName = this.state.case_image_2.fileName != undefined ? this.state.case_image_2.fileName : vStr[vStr.length - 1]
                                formdata.append("case_image_2", {
                                    uri: Platform.OS === "android" ? this.state.case_image_2.path : this.state.case_image_2.path.replace("file://", ""),
                                    type: this.state.case_image_2.mime,
                                    name: fileName,
                                });
                            }
                            if (this.state.case_image_3) {
                                var vStr = this.state.case_image_3.path.split('/');
                                const fileName = this.state.case_image_3.fileName != undefined ? this.state.case_image_3.fileName : vStr[vStr.length - 1]
                                formdata.append("case_image_3", {
                                    uri: Platform.OS === "android" ? this.state.case_image_3.path : this.state.case_image_3.path.replace("file://", ""),
                                    type: this.state.case_image_3.mime,
                                    name: fileName,
                                });
                            }
                            if (this.state.case_image_4) {
                                var vStr = this.state.case_image_4.path.split('/');
                                const fileName = this.state.case_image_4.fileName != undefined ? this.state.case_image_4.fileName : vStr[vStr.length - 1]
                                formdata.append("case_image_4", {
                                    uri: Platform.OS === "android" ? this.state.case_image_4.path : this.state.case_image_4.path.replace("file://", ""),
                                    type: this.state.case_image_4.mime,
                                    name: fileName,
                                });
                            }


                            console.log('formdata', formdata);


                            fetch('https://cms.healingg.com/api/create_case', {
                                method: 'post',
                                body: formdata,
                                headers: {
                                    //'Content-Type': 'application/x-www-form-urlencoded',
                                    // 'Accept': 'application/json',
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then((responseData) => {
                                responseData.json().then(res => {
                                    console.log('create case', res)
                                    this.props.setPointsPage(res.new_balance)
                                    AsyncStorage.getItem('registerTask').then((value) => {
                                        if(value == 'true') {
                                            this.setState({redeemPoints:res.points_awarded,pointImageModal:false},() => {
                                                this.timeoutHandle = setTimeout(()=>{
                                                    // Add your logic for the transition
                                                    this.setState({ pointImageModal: false })
                                                    navigator.navigate('Home')
                                                }, 1000);
                                            })
                                        }else{
                                            AsyncStorage.setItem('registerTask','true')
                                            this.setState({redeemPoints:res.points_awarded,redeemModal:true})
                                        }
                                    })
                                })
                                console.log('create case', responseData)
                                Toast.show('Thank You! Your case has been posted. ', Toast.LONG, Toast.BOTTOM)
                                this.setState({loading: false, enable:false})
                                //navigator.navigate('Home')
                            }).catch(err => {
                                this.setState({loading: false, enable:false})
                                console.log(err)
                                Toast.show('Error while create case', Toast.LONG, Toast.BOTTOM)
                            })
                        }
                    )
                } else {
                    Toast.show('Fields marked with * are mandatory', Toast.LONG, Toast.BOTTOM)
                }
            }

        } else {
            if (this.state.case_title && this.state.case_description && this.state.suffering) {
                this.setState({loading: true})
                let self = this
                AsyncStorage.getItem('token').then((value) => {
                        let formdata = new FormData();
                        formdata.append("user_token", value);
                        formdata.append("case_title", this.state.case_title);
                        formdata.append("case_description", this.state.case_description);
                        formdata.append("category_id", this.state.category_id);
                        formdata.append("suffering_since", this.state.suffering.id.toString());
                        formdata.append("healing_for", this.state.healing_for === 'my self' ? 'My Self' : '');
                        // formdata.append("photo", this.state.my_photo);
                        if (this.state.case_image_1) {
                            var vStr = this.state.case_image_1.path.split('/');
                            const fileName = this.state.case_image_1.fileName != undefined ? this.state.case_image_1.fileName : vStr[vStr.length - 1]
                            formdata.append("case_image_1", {
                                uri: Platform.OS === "android" ? this.state.case_image_1.path : this.state.case_image_1.path.replace("file://", ""),
                                type: this.state.case_image_1.mime,
                                name: fileName,
                            });
                        }
                        if (this.state.case_image_2) {
                            var vStr = this.state.case_image_2.path.split('/');
                            const fileName = this.state.case_image_2.fileName != undefined ? this.state.case_image_2.fileName : vStr[vStr.length - 1]
                            formdata.append("case_image_2", {
                                uri: Platform.OS === "android" ? this.state.case_image_2.path : this.state.case_image_2.path.replace("file://", ""),
                                type: this.state.case_image_2.mime,
                                name: fileName,
                            });
                        }
                        if (this.state.case_image_3) {
                            var vStr = this.state.case_image_3.path.split('/');
                            const fileName = this.state.case_image_3.fileName != undefined ? this.state.case_image_3.fileName : vStr[vStr.length - 1]
                            formdata.append("case_image_3", {
                                uri: Platform.OS === "android" ? this.state.case_image_3.path : this.state.case_image_3.path.replace("file://", ""),
                                type: this.state.case_image_3.mime,
                                name: fileName,
                            });
                        }
                        if (this.state.case_image_4) {
                            var vStr = this.state.case_image_4.path.split('/');
                            const fileName = this.state.case_image_4.fileName != undefined ? this.state.case_image_4.fileName : vStr[vStr.length - 1]
                            formdata.append("case_image_4", {
                                uri: Platform.OS === "android" ? this.state.case_image_4.path : this.state.case_image_4.path.replace("file://", ""),
                                type: this.state.case_image_4.mime,
                                name: fileName,
                            });
                        }
                        console.log('formdata', formdata);
                        fetch('https://cms.healingg.com/api/create_case', {
                            method: 'post',
                            body: formdata,
                            headers: {
                                //'Content-Type': 'application/x-www-form-urlencoded',
                                // 'Accept': 'application/json',
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then((responseData) => {
                            responseData.json().then(res => {
                                console.log('create case', res)
                                this.props.setPointsPage(res.new_balance)
                                AsyncStorage.getItem('registerTask').then((value) => {
                                    if(value == 'true') {
                                        this.setState({redeemPoints:res.points_awarded,pointImageModal:false},() => {
                                            this.timeoutHandle = setTimeout(()=>{
                                                // Add your logic for the transition
                                                this.setState({ pointImageModal: false })
                                                navigator.navigate('Home')
                                            }, 1000);
                                        })
                                    }else{
                                        AsyncStorage.setItem('registerTask','true')
                                        this.setState({redeemPoints:res.points_awarded,redeemModal:true})
                                    }
                                })
                            })
                            console.log('create case', responseData)
                            Toast.show('Thank You! Your case has been posted. ', Toast.LONG, Toast.BOTTOM)
                            this.setState({loading: false, enable:false})
                            //navigator.navigate('Home')
                        }).catch(err => {
                            this.setState({loading: false, enable:false})
                            console.log(err)
                            Toast.show('Error while create case', Toast.LONG, Toast.BOTTOM)
                        })
                    }
                )
            } else {
                Toast.show('Fields marked with * are mandatory', Toast.LONG, Toast.BOTTOM)
            }
        }
    }

    onSelectCaseIndex(index, value) {
        this.setState({
            text: `Selected index: ${index} , value: ${value}`, caseIndex: index
        })
    }

    __renderNavigationBar() {

        return (
            <View key="navbar" style={styles.navigationBarContainer}>
                <TouchableOpacity onPress={() => navigator.navigate('SubmitCaseScreen')} style={styles.navigationBarLeftButton}>
                    <Ionicons size={35} name="ios-arrow-round-back" color="#EE6B9A"/>
                </TouchableOpacity>
                <View style={styles.navigationBarTitleContainer}>
                    <TouchableWithoutFeedback

                    >
                        <View style={{flexDirection: 'row'}}>

                            <Text>Submit a Healing Request</Text>

                        </View>
                    </TouchableWithoutFeedback>
                </View>

            </View>
        );
    }

    sendAlert = (type) => {
        Alert.alert(
            'Healingg',
            'Select ailment Pic',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {text: 'Take Photo', onPress: () => this.openCamera(type)},
                {text: 'Choose from Library', onPress: () => this.openGallery(type)},
            ],
            { cancelable: false }
        )
    }

    openGallery = (type) => {
        ImagePickerNew.openPicker({
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
            cropping: true,
            includeBase64 : true,
        }).then(image => {
            this.assignImage(type,image)
        });
    }

    openCamera = (type) => {
        ImagePickerNew.openCamera({
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH,
            cropping: true,
        }).then(image => {
            this.assignImage(type,image)
        });
    }

    assignImage = (type,image) => {
        const source = {uri: image.path};
        switch(type){
            case 0:
                this.setState({
                    person_image: image,
                    person_avatar: source
                });
                break;
            case 1:
                this.setState({
                    case_image_1: image,
                    avatar_image_1: source
                });
                break;
            case 2:
                this.setState({
                    case_image_2: image,
                    avatar_image_2: source
                });
                break;
            case 3:
                this.setState({
                    case_image_3: image,
                    avatar_image_3: source
                });
                break;
            case 4:
                this.setState({
                    case_image_4: image,
                    avatar_image_4: source
                });
                break;
        }

    }

    person_image_picker = () => {
        if (this.state.healing_for !== 'my self'){
            // const options = {
            //     title: 'Select person Pic',
            //     storageOptions: {
            //         skipBackup: true,
            //         path: 'images',
            //         cropping: true
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
            //             person_avatar: source
            //         });
            //     }
            // });
            this.sendAlert(0)
        }
    }

    openPickerView_1 = () => {
        // const options = {
        //     title: 'Select ailment Pic',
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
        //             case_image_1: response,
        //             avatar_image_1: source
        //         });
        //     }
        // });
        this.sendAlert(1)
    }

    openPickerView_2 = () => {
        // const options = {
        //     title: 'Select ailment Pic',
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
        //             case_image_2: response,
        //             avatar_image_2: source
        //         });
        //     }
        // });

        this.sendAlert(2)
    }

    openPickerView_3 = () => {
        // const options = {
        //     title: 'Select ailment Pic',
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
        //             case_image_3: response,
        //             avatar_image_3: source
        //         });
        //     }
        // });
        this.sendAlert(3)
    }

    openPickerView_4 = () => {
        // const options = {
        //     title: 'Select ailment Pic',
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
        //             case_image_4: response,
        //             avatar_image_4: source
        //         });
        //     }
        // });
        this.sendAlert(4)
    }

    returnPlaceHolder = () => {
        const {category_name,isGroup} = this.state
        if(isGroup == "yes"){
            return "Name of the group to be healed *"
        }else if(category_name == "Individual"){
            return "Name of the person to be healed *"
        }else if(category_name == "Pets"){
            return "Name of the pet to be healed *"
        }else {
            return ""
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? <Spinner/> : null}
                {this.__renderNavigationBar()}
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1}}>
                    <ReedemModal isOpen={this.state.redeemModal} onCloseModal={() => navigator.navigate('Home')}
                                 points={this.state.redeemPoints} name={this.state.person_name} isFromCreatecase={true}
                    />
                    <PointImageModal visible={this.state.pointImageModal} />
                    <ScrollView>
                        {/*{*/}
                        {/*    this.state.healing_for !== 'my self' ?*/}
                        <View>
                            <View style={{height: Height(15), backgroundColor: '#F6C4D5'}}></View>
                            <TouchableOpacity style={{
                                alignSelf: 'center',
                                height: Height(20),
                                width: Height(20),
                                borderRadius: 5,
                                borderWidth: 2,
                                borderColor: '#EE6B9A',
                                overflow: 'hidden',
                                zIndex: 99,
                                bottom: Height(8),
                                backgroundColor:'white'
                            }} onPress={() => {
                                this.person_image_picker()
                            }}>
                                {this.state.person_avatar ?
                                    <Image source={this.state.person_avatar}
                                           style={{height: '100%', width: '100%'}}
                                           resizeMode={'stretch'}/> :
                                    this.state.userImage ?
                                        <Image source={{uri:this.state.userImage}}
                                               style={{height: '100%', width: '100%'}}
                                               resizeMode={'stretch'} onError={(e) => this.setState({userImage: 'https://s3.us-east-2.amazonaws.com/healinggimagestest/default.png'})}/> :
                                        <View style={{flex:1,alignItems:'center'}}>
                                            <Image source={require('./../../assets/upload.png')}
                                                   style={{marginTop:Height(5),height: Height(5), width: Height(5), tintColor: '#EE6B9A'}}
                                                   resizeMode={'contain'}/>
                                            <Text style={{marginTop:10}}>Upload Picture</Text>
                                        </View>}


                            </TouchableOpacity>

                            <View style={{bottom: Height(8)}}>
                                <Text style={{alignSelf: 'center', paddingTop: Height(2)}}>Details</Text>
                            </View>
                            <View style={{bottom: Height(8)}}>
                                <View style={{
                                    marginTop: Height(2),
                                    height: Height(8),
                                    backgroundColor: '#EBF0F0',
                                    justifyContent: 'center',
                                    marginHorizontal: Width(8)
                                }}>
                                    <TextInput onChangeText={(person_name) => {
                                        if(person_name.length <= 30){
                                            this.setState({person_name})
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
                                    }}
                                               value={this.state.person_name}  maxLength={31} style={{paddingLeft: Width(5)}}
                                               placeholder={this.returnPlaceHolder()} editable={this.state.healing_for == 'my self' ? false : true}/>
                                </View>
                                {(this.state.category_name == "Individual"  || this.state.category_name == "Pets") &&
                                <View style={{
                                    marginTop: Height(2),
                                    flexDirection: 'row',
                                    height: Height(8),
                                    backgroundColor: '#EBF0F0',
                                    justifyContent: 'center',
                                    marginHorizontal: Width(8)
                                }}>
                                    <View style={{flex: 1, justifyContent: 'center'}}><Text
                                        style={{paddingLeft: Width(5)}}>Gender *</Text></View>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}><TouchableOpacity
                                        onPress={() => {this.state.healing_for == 'my self' ? '' : this.setState({gender: 'MALE'})  }}
                                        style={[{flex: 1}, this.state.gender == 'MALE' ? {
                                            borderColor: '#8B8D92',
                                            borderWidth: 1,
                                            height: '100%',
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems:'center',
                                            backgroundColor:'#A9AFB3'
                                        } : {}]}><Text
                                        style={[{width:'100%',height:'100%',textAlign:'center'}, Platform.OS === 'ios' ? {marginTop:'40%'} : {textAlignVertical:'center'},this.state.gender == 'MALE' ? {color: 'white'} : {}]}>Male</Text></TouchableOpacity><TouchableOpacity
                                        onPress={() => {this.state.healing_for == 'my self' ? '' :this.setState({gender: 'FEMALE'})}}
                                        style={[{flex: 1}, this.state.gender == 'FEMALE' ? {
                                            borderColor: '#8B8D92',
                                            borderWidth: 1,
                                            height: '100%',
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems:'center',
                                            backgroundColor:'#A9AFB3'
                                        } : {}]}><Text
                                        style={[{width:'100%',height:'100%',textAlign:'center'},Platform.OS === 'ios' ? {marginTop:'40%'} : {textAlignVertical:'center'}, this.state.gender == 'FEMALE' ? {color: 'white'} : {}]}>Female</Text></TouchableOpacity></View>
                                </View>}
                                {(this.state.category_name == "Individual"  || this.state.category_name == "Pets") &&
                                <View style={{
                                    marginTop: Height(2),
                                    flexDirection: 'row',
                                    height: Height(8),
                                    backgroundColor: '#EBF0F0',
                                    justifyContent: 'center',
                                    marginHorizontal: Width(8)
                                }}>
                                    <View style={{flex: 0.4, justifyContent: 'center'}}><Text
                                        style={{paddingLeft: Width(5)}}>Age *</Text></View>
                                    <View style={{flex: 1,justifyContent: 'center'}}><TextInput onChangeText={(age) => this.setState({age})}
                                                                                                keyboardType='number-pad'
                                                                                                textAlign={'center'}
                                                                                                value={this.state.age.toString()}
                                                                                                style={{}}  editable={this.state.healing_for == 'my self' ? false : true}/>
                                    </View>
                                    {this.state.healing_for != 'my self' &&
                                    <View style={{flex: 1, justifyContent: 'center',alignItems:'center'}}><Text ellipsizeMode={'tail'} numberOfLines={3}
                                                                                                                style={{marginTop:Height(4),width:'100%',height:'100%',textAlign:'center',fontSize:10,textColor: 'black',alignSelf:'center',marginRight:15}}>For infants under 1 year, please enter age as 0  </Text></View>}
                                </View>}
                                {
                                    (this.state.healing_for == 'my self') ?
                                        this.state.city.length > 0 ?
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
                                            </View> : null
                                        :
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
                                }
                                <Collapse isCollapsed={this.state.healing_for == 'my self' ? false : this.state.collapsed}
                                          onToggle={(isCollapsed) => this.setState({collapsed: isCollapsed})}
                                          style={{marginTop: Height(2), marginHorizontal: Width(8)}}>
                                    <CollapseHeader
                                        style={{
                                            height: Height(8),
                                            flexDirection: 'row',
                                            backgroundColor: '#EBF0F0'
                                        }}>
                                        <View style={{flex: 1, justifyContent: 'center'}}>
                                            <Text style={{paddingLeft: Width(5)}}>{this.state.countryName}</Text>
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
                                                country: country,
                                                countryName:country.country,
                                                collapsed: false
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
                                {/*        style={{paddingLeft: Width(5)}}>{this.state.country.country}</Text></View>*/}
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
                            </View>
                        </View>
                        {/*:*/}
                        {/*        null*/}
                        {/*}*/}
                        <View style={{bottom: Height(6)}}>
                            <View style={{
                                marginTop: Height(6),

                                justifyContent: 'center',
                            }}>
                                <Text style={{alignSelf: 'center', paddingTop: Height(2)}}>About this healing request</Text>
                            </View>
                            <View style={{
                                marginTop: Height(2),
                                height: Height(8),
                                backgroundColor: '#EBF0F0',
                                justifyContent: 'center',
                                marginHorizontal: Width(8)
                            }}>

                                <TextInput onChangeText={(case_title) => {
                                    if(case_title.length <= 30){
                                        this.setState({case_title})
                                    } else{
                                        Alert.alert(
                                            'Healingg',
                                            "Case Title Cannot be more than 30 characters", [{
                                                text: 'Ok',
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel'
                                            }], {
                                                cancelable: false
                                            })
                                    }
                                }}
                                           value={this.state.case_title} maxLength={31} style={{paddingLeft: Width(5)}}
                                           placeholder={"Title *"}/>
                            </View>

                            <View style={{
                                marginTop: Height(2),
                                height: Height(16),
                                backgroundColor: '#EBF0F0',
                                marginHorizontal: Width(8)
                            }}>
                                <TextInput multiline={true}
                                           onChangeText={(case_description) => {
                                               console.log("length===",case_description.length)
                                               if(case_description.length <= 300){
                                                   this.setState({case_description})
                                               } else{
                                                   Alert.alert(
                                                       'Healingg',
                                                       "You can add description up to 300 characters", [{
                                                           text: 'Ok',
                                                           onPress: () => console.log('Cancel Pressed'),
                                                           style: 'cancel'
                                                       }], {
                                                           cancelable: false
                                                       })
                                               }
                                           }}
                                           maxLength={301}
                                           value={this.state.case_description}
                                           style={{
                                               paddingLeft: Width(5),
                                               height: Height(16),
                                               textAlignVertical: "top"
                                           }}
                                           placeholder={"Description (Up to 300 characters) *"}/>
                            </View>
                            <Collapse isCollapsed={this.state.sufferCollapsed}
                                      onToggle={(isCollapsed) => this.setState({sufferCollapsed: isCollapsed})}
                                      style={{marginTop: Height(2), marginHorizontal: Width(8)}}>
                                <CollapseHeader
                                    style={{height: Height(8), flexDirection: 'row', backgroundColor: '#EBF0F0'}}>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={{paddingLeft: Width(5)}}>{this.state.sufferingText}</Text>
                                    </View>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginRight: Width(2)
                                    }}>
                                        <AntDesign name={this.state.sufferCollapsed ? "up" : "down"} size={25}/>
                                    </View>
                                </CollapseHeader>
                                <CollapseBody>
                                    {this.state.suffering_list.map((country, index) => {
                                        return <TouchableOpacity key={index} onPress={() => this.setState({
                                            suffering: country,
                                            sufferCollapsed: false,
                                            sufferingText:country.suffering
                                        })} style={{
                                            height: Height(6),
                                            borderBottomColor: '#ccc',
                                            borderBottomWidth: 1,
                                            justifyContent: 'center'
                                        }}>
                                            <Text style={{marginLeft: Width(4)}}>{country.suffering}</Text>
                                        </TouchableOpacity>
                                    })}
                                </CollapseBody>
                            </Collapse>
                            {/*{this.state.suffering ? <View style={{*/}
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
                            {/*        style={{paddingLeft: Width(5)}}>{this.state.suffering.suffering}</Text></View>*/}
                            {/*    <View style={{*/}
                            {/*        flex: 1,*/}
                            {/*        justifyContent: 'flex-end',*/}
                            {/*        flexDirection: 'row',*/}
                            {/*        alignItems: 'center',*/}
                            {/*        marginRight: Width(2)*/}
                            {/*    }}><Entypo onPress={() => {*/}
                            {/*        this.setState({suffering: undefined})*/}
                            {/*    }} name="circle-with-cross" size={25}/></View>*/}
                            {/*</View> : null}*/}
                            <View style={{
                                marginTop: Height(2),
                                backgroundColor: '',
                                borderRadius: 2,
                                borderColor: '#ccc',
                                borderWidth: 1,
                                marginHorizontal: Width(2)
                            }}>
                                <Text style={{alignSelf: 'center'}}>Additional pictures for this healing request</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    marginVertical: Height(2.5),
                                    marginLeft: '5%',
                                    marginRight: '5%',
                                    justifyContent: 'space-evenly'
                                }}>
                                    <TouchableOpacity style={{
                                        height: Height(9),
                                        width: Height(9),
                                        borderColor: '#000',
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#ccc'
                                    }} onPress={() => {
                                        this.openPickerView_1()
                                    }}>
                                        {this.state.avatar_image_1 ? <Image source={this.state.avatar_image_1}
                                                                            style={{
                                                                                height: Height(9),
                                                                                width: Height(9),
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',

                                                                            }}
                                                                            resizeMode={'stretch'}
                                                                            borderRadius={3}
                                        /> : <Image source={require('./../../assets/upload.png')}
                                                    style={{height: Height(2.5), width: Height(2.5), tintColor: '#EE6B9A'}}
                                                    resizeMode={'contain'}/>}


                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        height: Height(9),
                                        width: Height(9),
                                        borderColor: '#000',
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#ccc'
                                    }} onPress={() => {
                                        this.openPickerView_2()
                                    }}>
                                        {this.state.avatar_image_2 ? <Image source={this.state.avatar_image_2}
                                                                            style={{
                                                                                height: Height(9),
                                                                                width: Height(9),
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',

                                                                            }}
                                                                            resizeMode={'stretch'}
                                                                            borderRadius={3}
                                        /> : <Image source={require('./../../assets/upload.png')}
                                                    style={{height: Height(2.5), width: Height(2.5), tintColor: '#EE6B9A'}}
                                                    resizeMode={'contain'}/>}


                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        height: Height(9),
                                        width: Height(9),
                                        borderColor: '#000',
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#ccc'
                                    }} onPress={() => {
                                        this.openPickerView_3()
                                    }}>
                                        {this.state.avatar_image_3 ? <Image source={this.state.avatar_image_3}
                                                                            style={{
                                                                                height: Height(9),
                                                                                width: Height(9),
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',

                                                                            }}
                                                                            resizeMode={'stretch'}
                                                                            borderRadius={3}
                                        /> : <Image source={require('./../../assets/upload.png')}
                                                    style={{height: Height(2.5), width: Height(2.5), tintColor: '#EE6B9A'}}
                                                    resizeMode={'contain'}/>}


                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        height: Height(9),
                                        width: Height(9),
                                        borderColor: '#000',
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#ccc'
                                    }} onPress={() => {
                                        this.openPickerView_4()
                                    }}>
                                        {this.state.avatar_image_4 ? <Image source={this.state.avatar_image_4}
                                                                            style={{
                                                                                height: Height(9),
                                                                                width: Height(9),
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',

                                                                            }}
                                                                            resizeMode={'stretch'}
                                                                            borderRadius={3}
                                        /> : <Image source={require('./../../assets/upload.png')}
                                                    style={{height: Height(2.5), width: Height(2.5), tintColor: '#EE6B9A'}}
                                                    resizeMode={'contain'}/>}


                                    </TouchableOpacity>


                                </View>
                            </View>
                            <TouchableOpacity disabled={this.state.enable} onPress={() => this.createCase()} style={{
                                marginHorizontal: Width(8),
                                marginTop: Height(4),
                                height: Height(9),
                                backgroundColor: '#EE6A93',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{color: '#FFF',fontSize:16}}>Submit Healing Request</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop:Height(0)}}>
                            <View style={{zIndex: -1, justifyContent: 'flex-end', height: 50, flex: 1}}>
                                <View style={{flexDirection: 'row', height: 50}}>
                                    <TouchableOpacity
                                        onPress={()=>navigator.navigate('Home')}
                                        style={{
                                            width: '50%',
                                            backgroundColor: '#CCC',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}><Text style={{fontSize: FontSize(16), color: '#EE6B9A'}}>Send Prayers</Text></TouchableOpacity>
                                    <TouchableOpacity style={{
                                        width: '50%',
                                        backgroundColor: "#EE6B9A",
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}><Text style={{fontSize: FontSize(16), color: '#FFF'}}>Request Healing</Text></TouchableOpacity>
                                </View>
                                <Image source={require('./../../assets/H_Logo_Bottom_Center.png')} style={{
                                    position: 'absolute',
                                    zIndex: 99,
                                    height: 40,
                                    width: 40,
                                    borderRadius: 20,
                                    backgroundColor: 'white',
                                    alignSelf: 'center',
                                    bottom: 5
                                }}/>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return{
        ...bindActionCreators({setNotifiationPage,setPointsPage}, dispatch)
    }
}

function mapStateToProps(state) {
    return{
        notificationPage: state.notificationPageManage.isCaseToken
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (SubmitCaseDetailScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F7F9',
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
        flexDirection:'row',
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
