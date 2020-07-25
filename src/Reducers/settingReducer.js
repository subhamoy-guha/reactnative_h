import {SAVE_SETTING_DATA} from '../Actions'


const initialState = {
    isSave:false,
    isEdit: false
}

export default function settingReducer(state = initialState ,action) {
    console.log("Reducer==123",action)
    switch(action.type){
        case SAVE_SETTING_DATA:
            return{
                ...state,
                isSave:action.isSave,
                isEdit:action.isEdit
            }
        default:
            return  state
    }
}
