import {LOGOUT_APP} from '../Actions'


export function  logoutAPP()  {
    console.log("==method logout called===")

    return(dispatch) => {
        dispatch(logoutNew())
    }
}

function logoutNew(){
    return{
        type:LOGOUT_APP
    }
}

