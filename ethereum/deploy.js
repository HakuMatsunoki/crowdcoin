const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const dotenv = require('dotenv');

const compiledFactory = require('./build/CampaignFactory.json');

dotenv.config({ path: './config.env' });

const provider = new HDWalletProvider(
  process.env.METAMASK_PHRASE,
  `https://rinkeby.infura.io/v3/${process.env.RINKEBY_KEY}`
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('deploying from account: ', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('contract deployed to: ', result.options.address);

  provider.engine.stop();
};
deploy();
