import {FETCHING_CASELIST,FETCHING_CASELIST_ERROR,FETCHING_CASELIST_SUCCESS,FETCHING_CASELIST_REFRESH} from '../Actions'
import RequestService from "../services/RequestService";


export function  fetchCaseList(params,isRefresh,offset)  {
    console.log("All Case Params====",params)
    return(dispatch) => {
        dispatch(getCaseList())

        return(
            new RequestService(params).callCreate().then(res => {
                console.log("caselist res===",res)
                if (res.caselist) {
                    let filterCases = [];
                    var arrIds = [];
                    if (Object.values(res.caselist_boosted).length !== 0) {
                        Object.values(res.caselist_boosted).map((data, index) => {
                            filterCases.push(data);
                        });
                    }
                    if (Object.values(res.caselist).length !== 0) {
                        Object.values(res.caselist).map((data, index) => {
                            filterCases.push(data);
                        });
                    }
                    if(res.caselist.length > 0){
                        res.caselist.map(e => {
                            arrIds.push(e.caseID)
                        })
                    }

                    console.log("All Case RES====",filterCases,offset)
                    if(filterCases.length > 0){
                        if(isRefresh){
                            return(dispatch(getCaseListRefresh(filterCases,offset,arrIds)))
                        }else{
                            return(dispatch(getCaseListSuccess(filterCases,offset,arrIds)))
                        }
                    }else{
                        return(dispatch(getCaseListError()))
                    }
                } else if(res.status == false) {
                  return(dispatch(getCaseListError()))
                }
            }).catch(err => {
                return(dispatch(getCaseListError()))
            })
        )
    }
}

function getCaseList(){
    return{
        type:FETCHING_CASELIST
    }
}

function getCaseListSuccess(data,offset,arrIds){
    return{
        type:FETCHING_CASELIST_SUCCESS,
        data,offset,arrIds
    }
}

function getCaseListRefresh(data,offset,arrIds) {
    return{
        type:FETCHING_CASELIST_REFRESH,
        data,offset,arrIds
    }
}

function getCaseListError() {
    return{
        type:FETCHING_CASELIST_ERROR
    }
}