import {SET_MYCASELIST_TEXT} from '../Actions'


const initialState = {
    Tab:1,
    isChange:false
}

export default function followClick(state = initialState ,action) {
    switch(action.type){
        case SET_MYCASELIST_TEXT:
            return{
                ...state,
                Tab:action.data,
                isChange:action.isChange
            }
        default:
            return  state
    }
}