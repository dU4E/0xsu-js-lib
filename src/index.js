const Web3 = require('web3')

class Du4e {
  constructor() {
    this.checkForWeb3 = this.checkForWeb3.bind(this);
    this.grabShortened = this.grabShortened.bind(this);
    this.addUrl = this.addUrl.bind(this);
    this.urlCreated = this.urlCreated.bind(this);
    this.onTxSend = null;
    this.onURLShortened = null;
    this.checkForWeb3();
  }

  checkForWeb3() {
    if (window.web3 && web3.currentProvider && window.ethereum) {
      this.initialize();
      return;
    }
    window.setTimeout(this.checkForWeb3, 100);
  }

  initialize() {
    ethereum.enable().then(() => {
      this.contractAddr = "0x5b56438000bac5ed2c6e0c1ecff4354abffaf889";
      this.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
      this.contract = new this.web3.eth.Contract(
        this.abi(),
        this.contractAddr
      );
    });
  }

  abi() {
    // correct ABI thanks Vitalik
    return [
      {
        constant: false,
        inputs: [],
        name: "kill",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            name: "url",
            type: "string"
          },
          {
            name: "paid",
            type: "bool"
          }
        ],
        name: "shortenURL",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            name: "_url",
            type: "string"
          },
          {
            name: "_short",
            type: "bytes"
          },
          {
            name: "paid",
            type: "bool"
          }
        ],
        name: "shortenURLWithSlug",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function"
      },
      {
        inputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: "url",
            type: "string"
          },
          {
            indexed: false,
            name: "slug",
            type: "bytes"
          },
          {
            indexed: false,
            name: "owner",
            type: "address"
          }
        ],
        name: "URLShortened",
        type: "event"
      },
      {
        constant: true,
        inputs: [
          {
            name: "_short",
            type: "bytes"
          }
        ],
        name: "getURL",
        outputs: [
          {
            name: "",
            type: "string"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "listAccts",
        outputs: [
          {
            name: "",
            type: "address[]"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            name: "",
            type: "address"
          },
          {
            name: "",
            type: "uint256"
          }
        ],
        name: "shortenedURLs",
        outputs: [
          {
            name: "",
            type: "bytes"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      }
    ];
  }

  grabShortened(acct, index = 0, cb, urls, devCb) {
    this.contract.methods.shortenedURLs(acct, index, (x, short) => {
      this.addUrl(short, urls, acct, index + 1, devCb);
    });
  }

  addUrl(short, urls, acct, index, devCb) {
    if (short) {
      urls.push(short);
      this.grabShortened(acct, index, this.addUrl, urls, devCb);
    } else {
      console.log("urls", urls)
      devCb(urls)
    }
  }

  urlCreated(x, txId) {
    let event = new Event("urlCreated");
    if (this.onTxSend) {
      this.onTxSend(txId);
    }
  }

  async shortenUrl(url, opts = {}) {
    let { slug, acct, cb } = opts;
    let accounts = await ethereum.request({ method: 'eth_accounts' });
    let account = acct || accounts[0];
    let tx = { from: account };
    
    // watch for url shortening :)
    this.contract.events.URLShortened({ address: account }, this.onURLShortened)
  
    slug
      ? this.contract.methods
          .shortenURLWithSlug(url, slug, true)
          .send(tx, this.urlCreated)
      : this.contract.methods.shortenURL(url, true).send(tx, this.urlCreated);
  }

  async getUrl(slug, cb) {
    const destination = await this.contract.methods.getURL(slug).call();
    return destination;
  }

  async listOfUrls(acct, cb) {
    let accounts = await ethereum.request({ method: 'eth_accounts' });
    let account = typeof(acct) == 'string' && acct || accounts[0];
    let callback = typeof(acct) == 'function' ? acct : cb;
    const urls = [];
    let url = await this.contract.methods.shortenedURLs(account, 0).call();

    let i = 1;
    while (url) {
      try {
        url = await this.contract.methods.shortenedURLs(account, i).call();
        urls.push(url);
        i += 1;
      } catch (e) {
        url = null;
      }
    }

    callback(urls);
  }

  async forward(slug) {
    window.location.href = await this.getUrl(slug);
  }
}

module.exports = Du4e
