import { Table, Button } from 'semantic-ui-react';

import web3 from '../ethereum/web3';
import campaign from '../ethereum/campaign';

const RequestRow = ({ address, request, id, approvers }) => {
  const { Row, Cell } = Table;
  const readyToFinalize = request.approvalCount > approvers / 2;

  const approveHandler = async () => {
    const cmp = campaign(address);

    const accounts = await web3.eth.getAccounts();
    await cmp.methods.approveRequest(id).send({ from: accounts[0] });
  };

  const finalizeHandler = async () => {
    const cmp = campaign(address);

    const accounts = await web3.eth.getAccounts();
    await cmp.methods.finalizeRequest(id).send({ from: accounts[0] });
  };

  return (
    <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount}/{approvers}
      </Cell>
      <Cell>
        {!request.complete && (
          <Button color="green" basic onClick={approveHandler}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {!request.complete && (
          <Button color="teal" basic onClick={finalizeHandler}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
