import {combineReducers} from 'redux'
import caselist from './caselist'
import followingcaselist from './followingcaselist'
import mycaselist from './mycaselist'
import prayerclick from './prayerclick'
import followClick from './followReducer'
import mycaselisttab from './mycaselistTab'
import editcaseManage from './editcaseManage'
import notificationPageManage from './notificationPage'
import shareData from './shareReducer'
import filterData from './filterReducer'
import sortCaselistData from './sortCaselist'
import filterCaselistData from './filterCaselist'
import points from './points';
import settingData from './settingReducer'
import {LOGOUT_APP} from '../Actions'

const appReducer = combineReducers({
    caselist,
    followingcaselist,
    mycaselist,
    prayerclick,
    followClick,
    mycaselisttab,
    notificationPageManage,
    editcaseManage,
    shareData,
    filterData,
    sortCaselistData,
    filterCaselistData,
    points,
    settingData
})

const rootReducer = (state, action) => {``
    if (action.type === 'LOGOUT_APP') {
        state = undefined
    }

    return appReducer(state, action)
}

export default rootReducer
