import {FETCHING_MYCASELIST,FETCHING_MYCASELIST_ERROR,FETCHING_MYCASELIST_SUCCESS,FETCHING_MYCASELIST_REFRESH} from '../Actions'


const initialState = {
    mycaselist:[],
    isLoading:false,
    error:false,
    allData:[],
    isRefresh:false,
}

export default function caselistReducer(state = initialState ,action) {
    switch(action.type){
        case FETCHING_MYCASELIST:
            return{
                ...state,
                isLoading: true,
                isRefresh:false,
                error:false
            }
        case FETCHING_MYCASELIST_SUCCESS:
            return {
                ...state,
                isLoading:false,
                mycaselist: [...action.data],
                allData: action.offset == 0 ? action.data :[...state.allData,...action.data],
                isRefresh:false,
                error:false
            }
        case FETCHING_MYCASELIST_ERROR:
            return{
                ...state,
                isLoading:false,
                error:true,
                isRefresh:false
            }
        case FETCHING_MYCASELIST_REFRESH:
            delete state.mycaselist
            delete state.allData
            return{
                ...state,
                isLoading:false,
                mycaselist: action.data,
                allData: action.data,
                isRefresh:true,
                error:false
            }
        default:
            return  state
    }
}