import { Fragment, useEffect, useState } from 'react';
import { Button, Table } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import campaign from '../../../../ethereum/campaign';
import RequestRow from '../../../../components/RequestRow';

const Request = () => {
  const router = useRouter();
  const { address } = router.query;
  const [requests, setRequests] = useState([]);
  const [requestsCount, setRequestsCount] = useState('');
  const [approversCount, setApproversCount] = useState('');

  useEffect(() => {
    const fetchRequestsData = async () => {
      if (!router.isReady) return;

      const cmp = campaign(address);

      const approversCount = await cmp.methods.approversCount().call();
      const requestsCount = await cmp.methods.getRequestsCount().call();

      const requests = await Promise.all(
        Array(+requestsCount)
          .fill()
          .map((_, idx) => cmp.methods.requests(idx).call())
      );

      setRequests(requests);
      setRequestsCount(requestsCount);
      setApproversCount(approversCount);
    };

    fetchRequestsData();
  });

  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () =>
    requests.map((item, idx) => (
      <RequestRow key={idx} id={idx} address={address} request={item} approvers={approversCount} />
    ));

  return (
    <Fragment>
      <h3>Pending Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <Button primary floated="right" style={{ marginBottom: 10 }}>
          Add Request
        </Button>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestsCount} requests</div>
    </Fragment>
  );
};

export default Request;
