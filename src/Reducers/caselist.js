import {FETCHING_CASELIST,FETCHING_CASELIST_SUCCESS,FETCHING_CASELIST_ERROR,FETCHING_CASELIST_REFRESH} from '../Actions'


const initialState = {
    caselist:[],
    isLoading:false,
    error:false,
    offset:0,
    currentlist:[]
}

export default function caselistReducer(state = initialState ,action) {
    switch(action.type){
        case FETCHING_CASELIST:
            return{
                ...state,
                isLoading: true,
                error:false
            }
        case FETCHING_CASELIST_SUCCESS:
            return {
                ...state,
                isLoading:false,
                caselist: [...state.caselist,...action.data],
                offset: action.offset,
                error:false,
                currentlist:[...state.currentlist,...action.arrIds]
            }
        case FETCHING_CASELIST_ERROR:
            return{
                ...state,
                isLoading:false,
                error:true
            }
        case FETCHING_CASELIST_REFRESH:
            delete state.caselist
            return{
                ...state,
                isLoading:false,
                caselist: action.data,
                offset: action.offset,
                error:false,
                currentlist:action.arrIds
            }
        default:
            return  state
    }
}