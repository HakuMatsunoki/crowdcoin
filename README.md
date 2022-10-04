# Crowd Coin Project
_Blockchain kickstarter inspired app_

#### Requirements:
Please, register an account on the https://infura.io/ and create rinkeby testing network to use this app.
Also, visit https://metamask.io/ to download and install the metamask extension to your browser.

#### Installation:
- run _`npm i`_ command to install modules
- add your metamask secret phrase and rinkeby key to the _`config.env.example`_ and rename file to _`config.env`_

#### Factory deployment:
- run _`npm run compile`_ command to compile contracts
- run _`npm run deploy`_ command to deploy factory contract into rinkeby network
- add received factory address key to the _`config.env`_ file

#### Development:
That's it! Now you can run _`npm run dev`_ command to start the developing server and try to create some campaigns and requests.

###### Available scripts:
- _`npm run test`_ - mocha tests