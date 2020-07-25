import {SET_FILTER_TEXT} from '../Actions'


const initialState = {
    filter:'',
    filter_type:'',
    index:'',
    filterText:''
}

export default function filterClick(state = initialState ,action) {
    switch(action.type){
        case SET_FILTER_TEXT:
            return{
                filter:action.filterType,
                filter_type:action.filter_type,
                index:action.tabIndex,
                filterText:action.filterText
            }
        default:
            return state
    }
}
