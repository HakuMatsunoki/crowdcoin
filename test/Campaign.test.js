const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

const web3 = new Web3(ganache.provider());
const { toWei, fromWei } = web3.utils;
const description = 'Buy some parts..';

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1000000' });
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaigns', () => {
  it('Should deploy factory and campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('Should mark caller as campaign manager', async () => {
    const manager = await campaign.methods.manager().call();

    assert.equal(manager, accounts[0]);
  });

  it('Should allow people to contribute and marks them as approvers', async () => {
    await campaign.methods.contribute().send({ value: '200', from: accounts[1] });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();

    assert(isContributor);
  });

  it('Should require a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({ value: '5', from: account[1] });

      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('Should allow manager to make a payment request', async () => {
    await campaign.methods.createRequest(description, '100', accounts[1]).send({ from: accounts[0], gas: '1000000' });
    const request = await campaign.methods.requests(0).call();

    assert.equal(description, request.description);
  });

  it('Should process the request', async () => {
    let initBal = await web3.eth.getBalance(accounts[1]);
    await campaign.methods.contribute().send({ from: accounts[0], value: toWei('10', 'ether') });

    await campaign.methods
      .createRequest(description, toWei('5', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: '1000000' });

    await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: '1000000' });
    await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: '1000000' });
    let currBal = await web3.eth.getBalance(accounts[1]);

    initBal = parseFloat(fromWei(initBal, 'ether'));
    currBal = parseFloat(fromWei(currBal, 'ether'));

    assert(currBal >= initBal + 5);
  });
});
