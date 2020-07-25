import {SET_FILTER_TEXT} from '../Actions'


export function  setFilterStatus(filterType,filter_type,tabIndex,filterText)  {
    console.log("==method filter called===",filterType)

    return(dispatch) => {
        dispatch(filterData(filterType,filter_type,tabIndex,filterText))
    }
}

function filterData(filterType,filter_type,tabIndex,filterText){
    return{
        type:SET_FILTER_TEXT,
        filterType,filter_type,tabIndex,filterText
    }
}
