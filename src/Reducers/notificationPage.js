import {SET_NOTIFICATION_PAGE} from '../Actions'


const initialState = {
    isCaseToken:false
}

export default function notificationPage(state = initialState ,action) {
    switch(action.type){
        case SET_NOTIFICATION_PAGE:
            return{
                ...state,
                isCaseToken:action.isCaseToken
            }
        default:
            return  state
    }
}