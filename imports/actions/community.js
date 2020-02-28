import _ from 'lodash'
import * as constants from '../constants'
import {getCommunitiesAPI, getCommunitySize, getLoansFromCommunity} from '../utils/API'

export const getCommunities = (pageNumber) => {
    return async dispatch => {
            dispatch(setCommunitiesStart())
            let getCommunities = []
            for (let i = (pageNumber-1) * 10; i < pageNumber * 10; i ++) {
                getCommunities.push(getCommunitiesAPI(i))
            }
            Promise.all(getCommunities).then(async communities => {
                getCommunities = _.filter(communities, ({community}) => community.Community_Name.length > 0)
                dispatch(setCommunities(getCommunities))
                dispatch(setLoans(await getLoans(pageNumber)))
            })
    }
}

export const getLoans = async (pageNumber) => {
        const loanCall = []
        for (let i = (pageNumber-1) * 10; i < pageNumber * 10; i ++)
            loanCall.push(await getLoansFromCommunity(i))
        const allLoans = await Promise.all(loanCall)
        return allLoans
}

export const getCommunitiesCount = () => {
    return async dispatch => {
        dispatch(setCommunitiesStart())
        const totalCount = await getCommunitySize()
        dispatch(setCommunitySize(totalCount))
    }
}

const setCommunitiesStart = () => ({
    type: constants.SET_LOADING
})

const setCommunities = (communities) => ({
    type: constants.SET_COMMUNITIES,
    payload: communities
})

export const setVersion = (version) => ({
    type: constants.SET_VERSION,
    payload: version
})

const setCommunitySize = (size) => ({
    type: constants.SET_COMMUNITY_SIZE,
    payload: size
})

const setLoans = (loans) => ({
    type: constants.SET_LOANS,
    payload: loans
})