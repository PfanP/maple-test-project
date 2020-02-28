import React from 'react';
import {Container} from 'semantic-ui-react'
import { Provider } from 'react-redux';
import styled from 'styled-components';
import store from 'imports/store'
window.ethereum.enable();

const StyledDiv = styled.div`
    background-color: '#fff';
    padding: '-20px -20px';
    margin: '-20px -20px';
`
export const MainLayout = ({component}) => (
    <Provider store={store}>
        <StyledDiv>
            <Container>
                <div style={{minHeight: '700px'}}>
                    {component}
                </div>
        </Container>
        </StyledDiv>
    </Provider>
)