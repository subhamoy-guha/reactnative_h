import navigator from "../services/navigator";
import {Image, Text, TouchableOpacity, View, Platform} from "react-native";
import {FontSize, Height, Width} from "../constants/dimensions";
import React from "react";

const CaseListItem = (props) => {
    const cases = props.cases.item;
    let personImageUrl=  cases.person_name == null ? cases.photo ? cases.photo : cases.person_image : cases.person_image ? cases.person_image : cases.photo
    let personImage = personImageUrl.includes('fbsbx') ? 'https://s3.us-east-2.amazonaws.com/healinggimagestest/default.png' : personImageUrl
    const thumbnail = isMySelf ? cases.ownerThumbnail : cases.thumbnail
    const personName= cases.person_name ? cases.person_name : cases.name;
    const countryName = cases.country ? cases.country : cases.user_country;
    const isMySelf = cases.healing_for == "myself" ? true : false
    const age =  (cases.isGroup == "yes") ? "Group" : isMySelf ?  cases.ownerAge : cases.age
    const gender = isMySelf ? cases.ownerGender : cases.gender
    const city = isMySelf ? cases.city : cases.caseCity
    const arrImages = []
    if(personImage){
        const dict = {url:personImage}
        arrImages.push(dict)
    }else{
        const dict = {url:'http://profilepicturesdp.com/wp-content/uploads/2018/07/mustache-dp-2-1.jpg'}
        arrImages.push(dict)
    }
    return (
        <TouchableOpacity onPress={() => {
            console.log("search props===",props)
            global.case_token = cases.token;
            if(props.isMyCases){
                navigator.navigate('CaseDetailScreen', {...cases, root: 'mycases' , tab:props.tab})
            }else{
                if(props.isFilter == true){
                    if(props.myFollow == "follow") {
                        navigator.navigate('CaseDetailScreen', {
                            ...cases,
                            root: 'home',
                            isFollowCases: true,
                            isSearch: false,
                            searchWord: '',
                            isFilter: true
                        })
                    }else{
                        navigator.navigate('CaseDetailScreen', {
                            ...cases,
                            root: 'home',
                            isFollowCases: false,
                            isSearch: false,
                            searchWord: '',
                            isFilter: true
                        })
                    }
                }else if(props.isSearch == true){
                    navigator.navigate('CaseDetailScreen', {...cases, root: 'home', isSearch:true, searchWord:props.searchWord})
                }else if(props.myFollow == "follow"){
                    navigator.navigate('CaseDetailScreen', {...cases, root: 'home', isFollowCases:true,isSearch:false, searchWord:''})
                }else{
                    navigator.navigate('CaseDetailScreen', {...cases, root: 'home', isFollowCases:false,isSearch:false, searchWord:''})
                }
            }
        }}  style={{flexDirection: 'row',marginBottom:
                props.isMyCase != undefined ? props.isMyCase == true ? cases.boosted != undefined ? cases.boosted == 1 ? 5 : 15 : 15 : 15 : 15,
            backgroundColor: props.isMyCase != undefined ? props.isMyCase == true ? cases.boosted != undefined ? cases.boosted == 1 ? '#fccedd' : 'white' : 'white' : 'white' : 'white'}}>
            <View style={{width: Width(18), marginTop: Height(1.5), marginHorizontal: Width(2)}}>
                <TouchableOpacity style={{
                    height: Height(10.5),
                    overflow: 'hidden',
                }} onPress={() => {
                    props.onImageClick(arrImages)
                }}>
                    {thumbnail &&
                    <Image style={{
                        width: Height(8), height: Height(8), borderRadius: Height(8) / 2
                    }} resizeMode={'cover'}
                           source={{uri: thumbnail}}
                    /> || personImage &&
                    <Image style={{
                        width: Height(8), height: Height(8), borderRadius: Height(8) / 2
                    }} resizeMode={'cover'}
                           ref={image => this.image = image}
                           source={{uri: personImage}}  /> ||
                    <Image style={{
                        width: Height(8),
                        height: Height(8), borderRadius: Height(8) / 2
                    }} resizeMode={'cover'}
                           source={require('../../assets/HEALINGG_Logo_Pink.png')}

                    />
                    }
                </TouchableOpacity>
            </View>

            <View style={{width: Width(52), marginTop: Height(2)}}>
                <Text style={{fontSize: FontSize(14)}} numberOfLines = { 1 }>{cases.category}</Text>
                {(age >= 0 && age != "Group") ?
                    city ?
                        <Text
                            style={{
                                fontSize: FontSize(14),
                                color: '#000'
                            }}>{gender &&
                        `${gender.charAt(0).toUpperCase() + gender.toLowerCase().slice(1)},`}{age > 0  ?  age == 1 ? ` ${age} yr ` :  ` ${age} yrs ` : gender ? ' Infant ' : 'Infant '}
                            {`from ${city}, ${countryName}`} </Text> : <Text
                            style={{
                                fontSize: FontSize(14),
                                color: '#000'
                            }}>{gender &&
                        `${gender.charAt(0).toUpperCase() + gender.toLowerCase().slice(1)},`}{age > 0  ?  age == 1 ? ` ${age} yr ` :  ` ${age} yrs ` : gender ? ' Infant ' : 'Infant '}
                            {`from ${countryName}`} </Text>:
                    city  ?
                        <Text
                            style={{
                                fontSize: FontSize( 14),
                                color: '#000'
                            }}>{`From ${city}, ${countryName}`} </Text> :
                        <Text
                            style={{
                                fontSize: FontSize( 14),
                                color: '#000'
                            }}>{`From  ${countryName}`} </Text>
                }
                <Text style={{
                    fontSize: FontSize(16),
                    fontWeight: '700',
                    color: '#000'
                }}>{personName}</Text>
                <View style={{flexDirection:'row',marginTop: 3,alignItems:'center'}}>
                    <View style={{
                        height: Height(1.2),
                        width: Height(1.2),
                        borderRadius: Height(1.2),
                        borderColor: '#EE6A93',
                        borderWidth: 2,
                        marginTop: 2
                    }}/>

                    <Text style={{

                        fontSize: FontSize(16),
                        paddingLeft:5,
                        color: '#000',
                        fontWeight:'500'
                    }}>{cases.title}</Text>
                </View>

                <View style={{height: Height(0.8)}}/>

                <View style={{width: Width(100), height: 1, backgroundColor: '#ccc'}}></View>
                <View style={{height: Height(0.5)}}/>

                <View
                    style={{flexDirection: 'row', justifyContent: 'flex-start', width: Width(55),alignItems: 'center'}}>
                    <TouchableOpacity onPress={()=> {props.onNoofPrayerClick(cases)}}  style={{flexDirection: 'row'}}>
                        <Text
                            style={{
                                fontSize: FontSize(14),
                                color: '#EE6B9A',
                                fontStyle: 'italic'
                            }}>{cases.total_prays}</Text>
                        <Text
                            style={{fontSize: FontSize(13),fontStyle: 'italic'}}>{cases.total_prays > 1 ? " prayers received" : " prayer received"}</Text></TouchableOpacity>
                    <Text style={{
                        fontSize: FontSize(14),
                        color: '#EE6B9A',
                        paddingLeft: Width(4),
                        fontStyle: 'italic'
                    }}>{cases.total_comments}</Text><Text
                    style={{fontSize: FontSize(13),fontStyle: 'italic'}}> {cases.total_comments > 1 ? 'comments' :  'comment'}</Text>
                </View>
                <View style={{height: Height(1.5)}}/>
                {/* <View style={{height:Height(15),width:1,backgroundColor:'#ccc'}}></View> */}
            </View>

            {/*<View style={{*/}
            {/*    height: Height(12),*/}
            {/*    width: 1,*/}
            {/*    backgroundColor: props.myFollow === 'follow' ? '#ccc' : cases.status === 'active' ? '#ccc' : '#00000000'*/}
            {/*}}/>*/}

            {props.myFollow === 'follow' ?
                <View
                    style={{
                        width: Width(15),
                        marginTop: Height(2),
                        marginHorizontal: Width(4),
                        zIndex: 100
                    }}
                >
                    <Image style={{height: Height(9), width: Height(9),alignSelf: 'center'}}
                           source={require('../../assets/praysent.png')}
                           resizeMode={'contain'}/>

                </View> :
                cases.status === 'active' ? <TouchableOpacity
                    style={{
                        width: Width(15),
                        marginTop: Height(2),
                        marginHorizontal: Width(4),
                        zIndex: 100,
                    }}
                    onPress={() => {
                        props.onPrayClick(cases)
                    }}>
                    {cases.isPray ?
                        cases.isPray == "0" ?
                            <Image style={{height: Height(9), width: Height(9),alignSelf: 'center'}}
                                   source={require('../../assets/pray.png')}
                                   resizeMode={'contain'}/>
                            : <Image style={{height: Height(9), width: Height(9),alignSelf: 'center'}}
                                     source={require('../../assets/praysent.png')}
                                     resizeMode={'contain'}/>
                        :
                        <Image style={{height: Height(9), width: Height(9),alignSelf: 'center'}}
                               source={require('../../assets/pray.png')}
                               resizeMode={'contain'}/>
                    }
                </TouchableOpacity> : <View
                    style={{
                        width: Width(15),
                        marginTop: Height(2),
                        marginHorizontal: Width(4),
                        zIndex: 100
                    }}
                >

                </View>
            }
        </TouchableOpacity>);
}

export default CaseListItem
