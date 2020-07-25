import React,{Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Modal, SafeAreaView, BackHandler} from 'react-native';
import {FontSize, Height} from "../constants/dimensions";
import BoostedModal from "./BoostedModal";

export default class PrayerScreen extends Component{

    constructor(props) {
        super(props)
        this.state = {
            seconds : 10,
            isTimer:false,
            text:'Tap on the picture',
            text1:'to start praying',
            isApiCall:false,
            boostedModal:false
        }
        this.timer = 0;

    }

    backToNavigate = () => {
        clearInterval(this.timer);
        this.timer = 0;
        this.setState({
            isTimer:false,
            seconds : 10,
            text:'Tap on the picture',
            text1:'to start praying',
            isApiCall:false
        },()=>{
            this.props.onCloseModal()
        })
    }

    onImageClick = (cases) => {
        this.props.onPrayerApiClick(cases)
        setTimeout( () => {
            this.setState({
                text:'Tap on the picture',
                text1:'to start praying',
                isApiCall:false
            })
        },2000);
    }

    startTimer = () => {
        this.setState({
            isTimer: true,
            text: "Tap on the picture again",
            text1: "when you are done sending prayers"
        },() => {
            if (this.timer == 0 && this.state.seconds > 0) {
                this.timer = setInterval(this.countDown, 1000);
            }
        })
        // setTimeout(this.onImageClick(), 1000);
    }
    countDown = () => {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
            seconds: seconds,
        });

        // Check if we're at zero.
        if (seconds == 0) {
            clearInterval(this.timer);
            this.resetTimer()
        }
    }

    resetTimer = () => {
        this.timer = 0
        this.setState({
            isTimer:false,
            seconds: 10,
            isApiCall:true,
            text: "Tap on the picture again",
            text1: "when you are done sending prayers"
        })
    }

    render(){
        const cases = this.props.cases
        var personImage,personName,countryName,isMySelf,age,gender,city;
        if(!this.props.casedetail && cases != undefined){
            personImage =  cases.person_name == null ? cases.photo ? cases.photo : cases.person_image : cases.person_image ? cases.person_image : cases.photo
            personName = cases.person_name ? cases.person_name : cases.name;
            countryName = cases.country ? cases.country : cases.user_country;
            isMySelf = cases.healing_for == "myself" ? true : false
            age =  (cases.isGroup == "yes") ? "Group" : isMySelf ?  cases.ownerAge : cases.age
            gender = isMySelf ? cases.ownerGender : cases.gender
            city = isMySelf ? cases.city : cases.caseCity
        }else if(cases != undefined){
            personName = cases.person_name ? cases.person_name : cases.ownerName
            personImage =  cases.healing_for == "myself" ? cases.ownerPhoto ? cases.ownerPhoto : cases.person_image :  cases.person_image ? cases.person_image : cases.ownerPhoto
            countryName = cases.country ? cases.country : cases.ownerCountry
            gender =  cases.healing_for == "myself" ? cases.ownerGender : cases.gender
            age =  (cases.isGroup == "yes") ? "Group" : cases.healing_for == "myself" ?  cases.ownerAge : cases.age
            city = cases.healing_for == "myself" ? cases.ownerCity : cases.caseCity
        }
        console.log("Prayer Cases====",cases)
        return(
            <Modal animationType = {"slide"} transparent = {false}
                   visible = {this.props.visible}
                   onRequestClose = {() => this.backToNavigate()}>
                <SafeAreaView style={styles.container}>
                    <BoostedModal isOpen={this.state.boostedModal}
                                  message="Tap on the picture. Spend 10 seconds or more praying. Tap on the picture again when you are finished praying."
                                  onCloseModal={() => this.setState({boostedModal:false})}/>
                    <View style={{width:'100%',height:'80%',backgroundColor:'#FF5997'}}>
                        <View style={{flexDirection:'row',width:'100%',bacgroundColor:'red'}}>
                            <Image source={require('../../assets/PrayerSummary.png')}
                                   style={{width:50,height:50,marginTop:15,marginLeft:25}}
                                   resizeMode={'contain'}/>
                            <TouchableOpacity onPress={() => {this.backToNavigate()}} style={{position:'absolute',top:25,right:25}}>
                                <Image source={require('../../assets/Close_Icon.png')}
                                       style={{width:35,height:35}}
                                       resizeMode={'contain'}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop:20,alignItems:'center'}}>
                            <Text style={{marginTop:30,color:'white',fontSize:30}}>I'm praying for</Text>
                            <TouchableOpacity style={{
                                height: Height(35),
                                width: Height(35),
                                borderWidth:5,
                                borderColor:'white',
                                overflow: 'hidden',
                                marginTop:5
                            }} onPress={() => {
                                if(!this.state.isTimer && this.state.isApiCall){
                                    this.onImageClick(this.props.cases)
                                }else if(!this.state.time){
                                    this.startTimer()
                                }
                            }}>
                                {personImage &&
                                <Image style={{
                                    width: Height(35), height: Height(35)
                                }} resizeMode={'cover'}
                                       source={{uri: personImage}}
                                /> ||
                                <Image style={{
                                    width: Height(35), height: Height(35)
                                }} resizeMode={'cover'}
                                       source={require('../../assets/HEALINGG_Logo_Pink.png')}

                                />
                                }
                            </TouchableOpacity>
                            <Text style={{marginTop:10,color:'white',fontSize:30,textAlign: 'center'}}>{personName}</Text>
                            {(age >= 0 && age != "Group")?
                                city ?
                                    <Text
                                        style={{
                                            fontSize: FontSize(15),
                                            color: 'white'
                                        }}>{gender &&
                                    `${gender.charAt(0).toUpperCase() + gender.toLowerCase().slice(1)},`} {age > 0  ?  age == 1 ? `${age} yr ` :  `${age} yrs ` : 'Infant '}
                                        {`from ${city}, ${countryName}`} </Text> : <Text
                                        style={{
                                            fontSize: FontSize(15),
                                            color: 'white'
                                        }}>{gender &&
                                    `${gender.charAt(0).toUpperCase() + gender.toLowerCase().slice(1)},`} {age > 0  ?  age == 1 ? `${age} yr ` :  `${age} yrs ` : 'Infant '}
                                        {`from ${countryName}`} </Text> :
                                city ?
                                    <Text
                                        style={{
                                            fontSize: FontSize( 15),
                                            color: 'white'
                                        }}>{`From ${city}, ${countryName}`} </Text> :
                                    <Text
                                        style={{
                                            fontSize: FontSize( 15),
                                            color: 'white'
                                        }}>{`From  ${countryName}`} </Text>
                            }
                        </View>
                    </View>
                    <View style={{width:'100%',height:'20%',backgroundColor:'#FF72A7',alignItems:'center'}}>
                        { !this.state.isTimer &&
                        <TouchableOpacity onPress={() => this.setState({boostedModal:true})}>
                            <Image source={require('../../assets/info.png')}
                                   style={{width:30,height:30,marginTop:5, tintColor:'white'}}
                                   resizeMode={'contain'}/>
                        </TouchableOpacity> }
                        <View style={{alignItems:'center',justifyContent:'center'}}>
                            <Text style={{marginTop:20,color:'white',fontSize:30,fontWeight:'bold'}}>{this.state.text}</Text>
                            <Text style={{marginTop:5,color:'white',fontSize:20,}}>{this.state.text1}</Text>
                        </View>
                        { this.state.isTimer &&
                        <Text style={{marginTop:5,color:'white',fontSize:15,}}>Please wait for {this.state.seconds} seconds</Text>
                        }
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})


