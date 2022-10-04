import { Fragment, useEffect, useState } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import ContributeForm from '../../../components/ContributeForm';

const CampaignShow = () => {
  const router = useRouter();
  const { address } = router.query;
  const [minContribution, setMinContribution] = useState('');
  const [balance, setBalance] = useState('');
  const [requestsCount, setRequestCount] = useState('');
  const [approversCount, setApproversCount] = useState('');
  const [manager, setManager] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      if (!router.isReady) return;

      const cmp = campaign(address);

      const summary = await cmp.methods.getSummary().call();

      setMinContribution(summary[0]);
      setBalance(summary[1]);
      setRequestCount(summary[2]);
      setApproversCount(summary[3]);
      setManager(summary[4]);
    };
    fetchSummary();
  });

  const items = [
    {
      header: manager,
      meta: 'Address of Manager',
      description: 'Manager created this campaign and can create request to withdraw money.',
      style: { overflowWrap: 'break-word' },
    },
    {
      header: minContribution,
      meta: 'Minimum Contribution (wei)',
      description: 'You must contribute at least this much wei to become an approver.',
    },
    {
      header: requestsCount,
      meta: 'Number of Requests',
      description: 'Request tries to withdraw money from the contract. Request must be approved by approvers.',
    },
    {
      header: approversCount,
      meta: 'Number of Approvers',
      description: 'Number of people who already donated to this campaign.',
    },
    {
      header: web3.utils.fromWei(balance, 'ether'),
      meta: 'Campaign Balance (ether)',
      description: 'Amount of money, this campaign has left to spend.',
    },
  ];

  return (
    <Fragment>
      <h3>Campaign Details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <Button primary>View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Fragment>
  );
};

export default CampaignShow;
