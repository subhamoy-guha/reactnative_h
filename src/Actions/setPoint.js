import {SET_POINTS} from '../Actions'


export function  setPointsPage(points)  {
    console.log("==method points called===",points)

    return(dispatch) => {
        dispatch(setPoints(points))
    }
}

function setPoints(points){
    return{
        type:SET_POINTS,
        points
    }
}
