import { Form, Input, Button, Message } from 'semantic-ui-react';
import { useState } from 'react';
import { useRouter } from 'next/router';

import campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

const ContributeForm = (props) => {
  const [value, setValue] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitHandler = async (event) => {
    event.preventDefault();

    const cmp = campaign(props.address);

    setLoading(true);
    setErrMsg('');

    try {
      const accounts = await web3.eth.getAccounts();
      await cmp.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei(value, 'ether') });

      router.replace(`/campaigns/${props.address}`);
    } catch (err) {
      setErrMsg(err.message);
    }

    setLoading(false);
    setValue('');
  };

  return (
    <Form onSubmit={submitHandler} error={!!errMsg}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input label="ether" labelPosition="right" value={value} onChange={(event) => setValue(event.target.value)} />
      </Form.Field>
      <Message error header="Oops!" content={errMsg} />
      <Button loading={loading} primary>
        Contribute
      </Button>
    </Form>
  );
};

export default ContributeForm;
