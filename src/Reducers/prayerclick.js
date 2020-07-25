import {FETCHING_PRAYER_CLICK} from '../Actions'


const initialState = {
    isPrayerClick:false,
    caseId:''
}

export default function prayerReducer(state = initialState ,action) {
    switch(action.type){
        case FETCHING_PRAYER_CLICK:
            return{
                ...state,
                isPrayerClick:action.isPray,
                caseId:action.caseId
            }
        default:
            return  state
    }
}