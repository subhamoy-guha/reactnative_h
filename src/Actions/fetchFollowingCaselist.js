import {FETCHING_FOLLOWINGCASELIST,FETCHING_FOLLWINGCASELIST_SUCCESS,FETCHING_FOLLWINGCASELIST_ERROR,FETCHING_FOLLWINGCASELIST_REFRESH} from '../Actions'
import RequestService from "../services/RequestService";


export function  fetchFollowingCaseList(params,isRefresh,offset)  {
    return(dispatch) => {
        dispatch(getFollowCaseList())

        return(
            new RequestService(params).callCreate().then(res => {
                console.log('myFollowingCases===', res.myFollowingCases,offset)
                if (res.myFollowingCases) {
                    if(res.myFollowingCases.length > 0){
                        if(isRefresh){
                            return(dispatch(getFollowCaseListRefresh(res.myFollowingCases,offset)))
                        }else{
                            return(dispatch(getFollowCaseListSuccess(res.myFollowingCases,offset)))
                        }
                    }else{
                        return dispatch(getFollowCaseListError())
                    }
                }else if(res.status == false) {
                    return(dispatch(getCaseListError()))
                }
            }).catch(err => {
                console.log(err.toString())
                return dispatch(getFollowCaseListError())
            })
        )
    }
}

function getFollowCaseList(){
    return{
        type:FETCHING_FOLLOWINGCASELIST
    }
}

function getFollowCaseListSuccess(data,offset){
    return{
        type:FETCHING_FOLLWINGCASELIST_SUCCESS,
        data,offset
    }
}
function getFollowCaseListRefresh(data,offset) {
    return{
        type:FETCHING_FOLLWINGCASELIST_REFRESH,
        data,offset
    }
}

function getFollowCaseListError() {
    return{
        type:FETCHING_FOLLWINGCASELIST_ERROR
    }
}
