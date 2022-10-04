import { useState, Fragment } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';

const RequestNew = () => {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const router = useRouter();
  const { address } = router.query;

  const submitHandler = async (event) => {
    if (!router.isReady) return;

    event.preventDefault();

    const cmp = campaign(address);

    setLoading(true);
    setErrMsg('');

    try {
      const accounts = await web3.eth.getAccounts();

      await cmp.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrMsg(err.message);
    }

    setLoading(false);
  };

  return (
    <Fragment>
      <Link href={`/campaigns/${address}/requests`}>Back</Link>
      <h3>Create a Request</h3>
      <Form onSubmit={submitHandler} error={!!errMsg}>
        <Form.Field>
          <label>Description</label>
          <Input value={description} onChange={(event) => setDescription(event.target.value)} />
        </Form.Field>

        <Form.Field>
          <label>Value in Ether</label>
          <Input value={value} onChange={(event) => setValue(event.target.value)} />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input value={recipient} onChange={(event) => setRecipient(event.target.value)} />
        </Form.Field>

        <Message error header="Oops!" content={errMsg} />

        <Button primary loading={loading}>
          Create!
        </Button>
      </Form>
    </Fragment>
  );
};

export default RequestNew;
