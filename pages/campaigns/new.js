import { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Button, Input, Message } from 'semantic-ui-react';

import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

const CampaignNew = () => {
  const router = useRouter();
  const [minContrib, setMinContrib] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrMsg('');

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minContrib).send({ from: accounts[0] });

      router.push('/');
    } catch (err) {
      setErrMsg(err.message);
    }

    setLoading(false);
  };

  return (
    <Fragment>
      <h3>New Campaign!</h3>
      <Form onSubmit={submitHandler} error={!!errMsg}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minContrib}
            onChange={(event) => setMinContrib(event.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errMsg} />
        <Button loading={loading} primary>
          OK
        </Button>
      </Form>
    </Fragment>
  );
};

export default CampaignNew;
