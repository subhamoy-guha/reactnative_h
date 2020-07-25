import {FETCHING_FOLLOWINGCASELIST,FETCHING_FOLLWINGCASELIST_SUCCESS,FETCHING_FOLLWINGCASELIST_ERROR,FETCHING_FOLLWINGCASELIST_REFRESH,FETCHING_MYCASELIST_NODATA} from '../Actions'

const initialState = {
    followingCaselist:[],
    isLoading:false,
    error:false,
    offset:0
}

export default function caselistReducer(state = initialState ,action) {
    switch(action.type){
        case FETCHING_FOLLOWINGCASELIST:
            return{
                ...state,
                isLoading: true,
                error:false
            }
        case FETCHING_FOLLWINGCASELIST_SUCCESS:
            console.log("===data Success====")
            return {
                ...state,
                isLoading:false,
                followingCaselist: [...state.followingCaselist,...action.data],
                offset:action.offset,
                error:false
            }
        case FETCHING_FOLLWINGCASELIST_ERROR:
            return{
                ...state,
                isLoading:false,
                error:true,
            }
        case FETCHING_FOLLWINGCASELIST_REFRESH:
            delete state.followingCaselist
            return{
                ...state,
                isLoading:false,
                followingCaselist: action.data,
                offset:action.offset,
                error:false
            }
        default:
            return  state
    }
}