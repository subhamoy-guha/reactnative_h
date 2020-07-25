import {FETCHING_MYCASELIST,FETCHING_MYCASELIST_ERROR,FETCHING_MYCASELIST_SUCCESS,FETCHING_MYCASELIST_REFRESH,FETCHING_MYCASELIST_NODATA} from '../Actions'

function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(new Error("timeout"))
        }, ms)
        promise.then(resolve, reject)
    })
}

export function  fetchMyCaseList(data,isRefresh,offset)  {
    console.log("==method fetch called===",isRefresh)



    return(dispatch) => {
        dispatch(getMyCaseList())

        return(
             timeout(10000, fetch('https://cms.healingg.com/api/my_cases', {
                method: 'post',
                body: data,
                headers: {
                    //'Content-Type': 'application/x-www-form-urlencoded',
                    // 'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => response.json())
                .then((responseData) => {
                    if (responseData.mySubmittedCases) {
                        let filterCases = [];
                        if(responseData.mySubmittedCases.length !== 0) {
                            responseData.mySubmittedCases.map((data, index) => {
                                filterCases.push(data);
                            });
                        }
                        console.log("===Active====",filterCases)
                        if(isRefresh){
                            return(dispatch(getMyCaseListRefresh(filterCases)))
                        }else{
                            return(dispatch(getMyCaseListSuccess(filterCases,offset)))
                        }
                    }else{
                        console.log("==no data found===")
                        return(dispatch(getMyCaseListError()))
                    }
                }).catch(err => {
                return(dispatch(getNoData()))
                console.log('my cases err', err);
            }).catch(err=> {
                console.log(err)
            })
        )).catch(err => {
            console.log("Timeout active===")
            return(dispatch(getMyCaseListError()))
        })
    }
}

function getMyCaseList(){
    return{
        type:FETCHING_MYCASELIST
    }
}

function getMyCaseListSuccess(data,offset){
    return{
        type:FETCHING_MYCASELIST_SUCCESS,
        data,offset
    }
}

function getMyCaseListRefresh(data) {
    return{
        type:FETCHING_MYCASELIST_REFRESH,
        data
    }
}

function getMyCaseListError() {
    return{
        type:FETCHING_MYCASELIST_ERROR
    }
}

function getNoData(){
    return{
        type:FETCHING_MYCASELIST_NODATA
    }
}
