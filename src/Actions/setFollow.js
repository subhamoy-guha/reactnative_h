import {SET_FOLLOW_TEXT} from '../Actions'


export function  setFollowStatus(isFollow,isSearch,searchWord,isFilter)  {
    console.log("==method follow called===",isSearch)

    return(dispatch) => {
        dispatch(follow(isFollow,isSearch,searchWord,isFilter))
    }
}

function follow(data,isSearch,searchWord,isFilter){
    return{
        type:SET_FOLLOW_TEXT,
        data,isSearch,searchWord,isFilter
    }
}