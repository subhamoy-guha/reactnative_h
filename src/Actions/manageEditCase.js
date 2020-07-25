import {MANAGE_EDIT_TEXT} from '../Actions'


export function  manageEditCase(isActiveTab,isFollow)  {
    console.log("==method edit case called===")

    return(dispatch) => {
        dispatch(manageCase(isActiveTab,isFollow))
    }
}

function manageCase(isActiveTab,isFollow){
    return{
        type:MANAGE_EDIT_TEXT,
        isActiveTab,isFollow
    }
}