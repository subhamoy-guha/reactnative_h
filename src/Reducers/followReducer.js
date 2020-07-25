import {SET_FOLLOW_TEXT} from '../Actions'


const initialState = {
    isFollowTab:false,
    isSearch:false,
    searchWord:'',
    isFilter:false
}

export default function followClick(state = initialState ,action) {
    switch(action.type){
        case SET_FOLLOW_TEXT:
            return{
                isFollowTab:action.data,
                isSearch:action.isSearch,
                searchWord:action.searchWord,
                isFilter:action.isFilter
            }
        default:
            return  state
    }
}