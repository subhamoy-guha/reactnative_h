import {MANAGE_EDIT_TEXT} from '../Actions'


const initialState = {
    isActiveTab: false,
    isFollow: false,
}

export default function editcaseManage(state = initialState ,action) {
    switch(action.type){
        case MANAGE_EDIT_TEXT:
            return{
                ...state,
                isActiveTab: action.isActiveTab,
                isFollow: action.isFollow,
            }
        default:
            return  state
    }
}