import {SET_MYCASELIST_TEXT} from '../Actions'


export function  setMyCaselistTab(tab,isChange)  {
    console.log("==method caselist set called===")

    return(dispatch) => {
        dispatch(setTab(tab,isChange))
    }
}

function setTab(data,isChange){
    return{
        type:SET_MYCASELIST_TEXT,
        data,isChange
    }
}