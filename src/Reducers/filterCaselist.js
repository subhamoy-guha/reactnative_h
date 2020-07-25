import {FETCHING_FILTER_CASELIST,FETCHING_FILTER_CASELIST_SUCCESS,FETCHING_FILTER_CASELIST_ERROR,FETCHING_FILTER_CASELIST_REFRESH} from '../Actions'


const initialState = {
    caselist:[],
    isLoading:false,
    error:false,
    offset:0,
    currentlist:[],
    status:''
}

export default function sortCaselistReducer(state = initialState ,action) {
    switch(action.type){
        case FETCHING_FILTER_CASELIST:
            return{
                ...state,
                isLoading: true,
                error:false
            }
        case FETCHING_FILTER_CASELIST_SUCCESS:
            return {
                ...state,
                isLoading:false,
                caselist:  state.status != action.status ? action.data : [...state.caselist,...action.data],
                offset: action.offset,
                error:false,
                status:action.status,
                currentlist:  state.status != action.status ? action.arrIds : [...state.currentlist,...action.arrIds],
            }
        case FETCHING_FILTER_CASELIST_ERROR:
            return{
                ...state,
                isLoading:false,
                error:true
            }
        case FETCHING_FILTER_CASELIST_REFRESH:
            delete state.caselist
            return{
                ...state,
                isLoading:false,
                caselist: action.data,
                offset: action.offset,
                error:false,
                status:action.status,
                currentlist:action.arrIds
            }
        default:
            return  state
    }
}