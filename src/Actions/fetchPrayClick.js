import {FETCHING_PRAYER_CLICK} from '../Actions'


export function  fetchPrayClick(isPray,caseId)  {
    console.log("==method Prayer called===")

    return(dispatch) => {
        dispatch(prayer(isPray,caseId))
    }
}

function prayer(isPray,caseId){
    return{
        type:FETCHING_PRAYER_CLICK,
        isPray,caseId
    }
}

