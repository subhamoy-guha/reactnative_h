import {SHARE_APP} from '../Actions'


export function  shareAction(isShare)  {
    console.log("==method share called===",isShare)

    return(dispatch) => {
        dispatch(shareData(isShare))
    }
}

function shareData(isShare){
    return{
        type:SHARE_APP,
        isShare
    }
}