import {SAVE_SETTING_DATA} from '../Actions'


export function  settingAction(isSave,isEdit)  {
    console.log("==method save called===",isSave, isEdit)

    return(dispatch) => {
        dispatch(saveShare(isSave, isEdit))
    }
}

function saveShare(isSave, isEdit){
    return{
        type:SAVE_SETTING_DATA,
        isSave, isEdit
    }
}
