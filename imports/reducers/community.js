import produce from 'immer';
import _ from 'lodash';
import * as constants from '../constants';
import * as Administrative from '../../const/Administrative'
const initialState = {
  loading: false,
  communities: [],
  error: false,
  currentPage: 1,
  version: 1,
  total: 0,
  address: Administrative.ETHERLOANS_ADDRESS_V1
};

export const communityReducer = (state = initialState, action = {}) =>
    produce(state, draft =>{
        switch (action.type) {
            case constants.SET_LOADING:
                draft.loading = true;
                break;
            case constants.SET_COMMUNITIES:
                draft.loading = false;
                draft.communities = action.payload;
                break;
            case constants.SET_CURRENT_PAGE:
                draft.page = action.payload;
                break;
            case constants.SET_LOANS:
                draft.communities.map(community => {
                    const loansForCommunity = _.filter(action.payload, loan => loan.communityID === community.communityID)
                    community.loans = loansForCommunity[0].loan
                })
                break;
            case constants.SET_VERSION:
                if (action.payload === 1)
                    draft.address = Administrative.ETHERLOANS_ADDRESS_V1
                else if (action.payload === 2)
                    draft.address = Administrative.ETHERLOANS_ADDRESS_V1_1
                draft.version = action.payload;
                break;
            case constants.SET_COMMUNITY_SIZE:
                draft.total = action.payload;
                break;
        }
    });

export default communityReducer;