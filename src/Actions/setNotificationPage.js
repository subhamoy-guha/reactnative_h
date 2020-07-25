import {SET_NOTIFICATION_PAGE} from '../Actions'


export function  setNotifiationPage(isCaseToken)  {
    console.log("==method notification called===",isCaseToken)

    return(dispatch) => {
        dispatch(setNotification(isCaseToken))
    }
}

function setNotification(isCaseToken){
    return{
        type:SET_NOTIFICATION_PAGE,
        isCaseToken
    }
}