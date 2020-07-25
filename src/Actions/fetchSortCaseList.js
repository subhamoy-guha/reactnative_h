import {FETCHING_SORT_CASELIST,FETCHING_SORT_CASELIST_SUCCESS,FETCHING_SORT_CASELIST_ERROR,FETCHING_SORT_CASELIST_REFRESH} from '../Actions'
import RequestService from "../services/RequestService";


export function  fetchSortCaseList(status,params,isRefresh,offset)  {
    console.log("All Case Params====",status)
    return(dispatch) => {
        dispatch(getSortCaseList())
        return(
            new RequestService(params).callCreate().then(res => {
                console.log("caselist res===",res)
                if (status === 'latest') {
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
                                return (dispatch(getSortCaseListRefresh(filterCases, offset, arrIds, status)))
                            } else {
                                return (dispatch(getSortCaseListSuccess(filterCases, offset, arrIds, status)))
                            }
                        } else {
                            return (dispatch(getSortCaseListError()))
                        }
                    } else if (res.status == false) {
                        return (dispatch(getSortCaseListError()))
                    }
                }else {
                    if (res.caselist_most_least_healed) {
                        let filterCases = [];
                        var arrIds = [];
                        if (Object.values(res.caselist_most_least_healed).length !== 0) {
                            Object.values(res.caselist_most_least_healed).map((data, index) => {
                                filterCases.push(data);
                            });
                        }
                        if (res.caselist_most_least_healed.length > 0) {
                            res.caselist_most_least_healed.map(e => {
                                arrIds.push(e.caseID)
                            })
                        }

                        console.log("All Case RES====", filterCases, offset)
                        if (filterCases.length > 0) {
                            if (isRefresh) {
                                return (dispatch(getSortCaseListRefresh(filterCases, offset, arrIds, status)))
                            } else {
                                return (dispatch(getSortCaseListSuccess(filterCases, offset, arrIds, status)))
                            }
                        } else {
                            return (dispatch(getSortCaseListError()))
                        }
                    }else if (res.status == false) {
                        return (dispatch(getSortCaseListError()))
                    }
                }
            }).catch(err => {
                return(dispatch(getSortCaseListError()))
            })
        )
    }
}

function getSortCaseList(){
    return{
        type:FETCHING_SORT_CASELIST
    }
}

function getSortCaseListSuccess(data,offset,arrIds,status){
    return{
        type:FETCHING_SORT_CASELIST_SUCCESS,
        data,offset,arrIds,status
    }
}

function getSortCaseListRefresh(data,offset,arrIds,status) {4
    return{
        type:FETCHING_SORT_CASELIST_REFRESH,
        data,offset,arrIds,status
    }
}

function getSortCaseListError() {
    return{
        type:FETCHING_SORT_CASELIST_ERROR
    }
}