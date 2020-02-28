import React, {useEffect, useState} from 'react';
import {Header, Pagination, Grid, Container, Dropdown} from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import { getCommunities, setVersion, getCommunitiesCount } from 'imports/actions/community'
import CommunityList from 'imports/ui/components/communityList'
import HeaderComponent from 'imports/ui/components/Header'
const Home = () => {

    const versionOptions = [
        {key: 'v-1', value: 1, text: 'Version 1'},
        {key: 'v-2', value: 2, text: 'Version 2'},
    ]

    const dispatch = useDispatch()
    const pageNumberFromReducer = useSelector(state => state.community.currentPage)
    const loadingStatus = useSelector(state => state.community.loading)
    const totalCount = useSelector(state => state.community.total)

    const [ pageNumber, setPageNumber ] = useState(pageNumberFromReducer)
    useEffect(() => {
        initialLoading()
    }, [pageNumber])

    initialLoading = () => {
        dispatch(getCommunitiesCount())
        dispatch(getCommunities(pageNumber))
    }

    handlePaginationChange = (e, { activePage }) => setPageNumber(activePage)
    handleVersionChange = (e, {value}) => {
        dispatch(setVersion(value))
        initialLoading()
    }
    return (
        <Container fluid>
            <HeaderComponent />
            {loadingStatus && <Header align="center"><ReactLoading type="spin" color="#aaaaaa" /></Header>}
            {!loadingStatus && <CommunityList />}
            <Grid padded="vertically">
                <Grid.Column key='select' floated="left" width={3}>
                    <Dropdown options={versionOptions} fluid selection placeholder="Versions" onChange={handleVersionChange} />
                </Grid.Column>
                <Grid.Column key="pagination" width={12}>
                    <Header align="right">
                        <Pagination defaultActivePage={1} totalPages={totalCount / 10} onPageChange={handlePaginationChange} />
                    </Header>
                </Grid.Column>
            </Grid>
        </Container>
    )
}

export default Home;