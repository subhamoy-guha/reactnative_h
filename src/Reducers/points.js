import {SET_POINTS} from '../Actions'


const initialState = {
    points:0
}

export default function pointsPage(state = initialState ,action) {
    switch(action.type){
        case SET_POINTS:
            return{
                ...state,
                points:action.points
            }
        default:
            return  state
    }
}
