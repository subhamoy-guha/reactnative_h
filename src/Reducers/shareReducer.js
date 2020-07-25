import {SHARE_APP} from '../Actions'


const initialState = {
    isShare:false
}

export default function shareReducer(state = initialState ,action) {
    switch(action.type){
        case SHARE_APP:
            return{
                isShare:action.isShare
            }
        default:
            return  state
    }
}