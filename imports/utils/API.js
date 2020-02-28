import Web3 from 'web3'
import * as Administrative from 'const/Administrative'
import store from 'imports/store'
const web3 = new Web3(window.ethereum);

export const getCommunitiesAPI = async (communityID) => {
    const state = store.getState();
    const NameContract = new web3.eth.Contract(Administrative.ETHERLOANS_ABI, state.community.address);
    return NameContract.methods.Communities(communityID).call().then(e => ({community: e, communityID}));
}

export const getCommunitySize = async () => {
    const state = store.getState();
    const NameContract = new web3.eth.Contract(Administrative.ETHERLOANS_ABI, state.community.address);
    return NameContract.getPastEvents('communityCreated', {filter: {}, fromBlock: 0, toBlock: 'latest'}).then((res) => res.length)
}

export const getLoansFromCommunity = async (_communityID) => {
    const state = store.getState();
    const NameContract = new web3.eth.Contract(Administrative.ETHERLOANS_ABI, state.community.address);
    const loans = await NameContract.getPastEvents('loanRequested', {filter: {_communityID: [_communityID]}, fromBlock: 0, toBlock: 'latest'})
    const loanResult = Promise.all(loans.map(async (loan) => {
        const status = await NameContract.methods.loanStatus(loan.returnValues._communityID, loan.returnValues._loanID).call()
        return {status, loan: loan.returnValues._loanID}
    }))
    return {communityID: _communityID, loan: await loanResult}
}

// export const getActiveLoans = async (communityID, loa)