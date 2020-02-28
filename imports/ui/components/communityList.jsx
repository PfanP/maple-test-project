import React from "react";
import { useSelector } from "react-redux";
import { Card, Header, List } from "semantic-ui-react";
import Collapsible from "react-collapsible";
import ReactLoading from "react-loading";
import styled from 'styled-components'

const StyledList = styled(List)`
    padding: 20px !important;
`

const StsyledHeader = styled(Header)`
    padding: 20px !important;
`

const CommunityList = () => {
  const communities = useSelector(state => state.community.communities);
  return (
    <React.Fragment>
      {communities.map((community, index) => (
        <div key={`card-${index}`}>
          <Collapsible trigger={<CommunityCard {...community} />}>
            <LoanInfo {...community} />
          </Collapsible>
        </div>
      ))}
    </React.Fragment>
  );
};

const LoanInfo = community => {
  const { loans } = community;
  if (loans === undefined)
    return (
      <StsyledHeader align="center">
        <ReactLoading type="spin" color="#aaaaaa" />
      </StsyledHeader>
    );
        if (loans.length <= 0)
        return (<StsyledHeader textAlign="center" as="h1" size="medium">No LoanInfo!</StsyledHeader>)
  return (
      <StyledList link divided className="loan-info">
        {loans.map((loan, index) => (
            <List.Item key={`loan-info-${index}`}>
                <List.Content floated="left">
                    <Header>
                        <span>ID: {loan.loan}</span>
                    </Header>
                </List.Content>
                <List.Content floated="right">
                    <Header>
                        <span>Status: {loan.status["0"]}</span>
                    </Header>
                </List.Content>
            </List.Item>
        ))}
    </StyledList>
  )
};

const CommunityCard = ({ community }) => (
  <Card fluid>
    <Card.Content>
      <Card.Header>{`"${community.Community_Name}" Community`}</Card.Header>
      <Card.Meta>{`Loans Count: ${community.Loans_Count}`}</Card.Meta>
      <Card.Meta>{`Loan Offers Count: ${community.Loan_Offers_Count}`}</Card.Meta>
    </Card.Content>
  </Card>
);

export default CommunityList;
