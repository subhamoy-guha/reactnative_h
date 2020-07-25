import {FETCHING_FILTER_CASELIST,FETCHING_FILTER_CASELIST_SUCCESS,FETCHING_FILTER_CASELIST_ERROR,FETCHING_FILTER_CASELIST_REFRESH} from '../Actions'
import RequestService from "../services/RequestService";


export function  fetchFilterCaseList(status,params,isRefresh,offset)  {
    console.log("All Case Params====",status)
    return(dispatch) => {
        dispatch(getFilterCaseList())
        return(
            new RequestService(params).callCreate().then(res => {
                console.log("caselist res===",res)
                if (res.caselist) {
                    let filterCases = [];
                    var arrIds = [];
                    if (Object.values(res.caselist).length !== 0) {
                        Object.values(res.caselist).map((data, index) => {
                            filterCases.push(data);
                        });
                    }
                    if (res.caselist.length > 0) {
                        res.caselist.map(e => {
                            arrIds.push(e.caseID)
                        })
                    }

                    console.log("All Case RES====", filterCases, offset)
                    if (filterCases.length > 0) {
                        if (isRefresh) {
                            return (dispatch(getFilterCaseListRefresh(filterCases, offset, arrIds, status)))
                        } else {
                            return (dispatch(getFilterCaseListSuccess(filterCases, offset, arrIds, status)))
                        }
                    } else {
                        return (dispatch(getFilterCaseListError()))
                    }
                } else if (res.status == false) {
                    return (dispatch(getFilterCaseListError()))
                }
            }).catch(err => {
                return(dispatch(getFilterCaseListError()))
            })
        )
    }
}

function getFilterCaseList(){
    return{
        type:FETCHING_FILTER_CASELIST
    }
}

function getFilterCaseListSuccess(data,offset,arrIds,status){
    return{
        type:FETCHING_FILTER_CASELIST_SUCCESS,
        data,offset,arrIds,status
    }
}

function getFilterCaseListRefresh(data,offset,arrIds,status) {4
    return{
        type:FETCHING_FILTER_CASELIST_REFRESH,
        data,offset,arrIds,status
    }
}

function getFilterCaseListError() {
    return{
        type:FETCHING_FILTER_CASELIST_ERROR
    }
}