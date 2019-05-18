const Web3 = require('web3')

class Du4e {
  constructor(){
    this.checkForWeb3 = this.checkForWeb3.bind(this)
    this.grabShortened = this.grabShortened.bind(this)
    this.addURL = this.addURL.bind(this)
    this.checkForWeb3()
  }

  checkForWeb3(){
    if (window.web3 && web3.currentProvider && window.ethereum) {
      this.initialize()
      return
    }
    window.setTimeout(this.checkForWeb3, 100)

  }

  initialize(){
    ethereum.enable().then(() => {
      this.contractAddr = "0x5fc4c5ba2e1d22191fb239a1afe513f7ff892c9c"
      this.web3 = window.web3 || new Web3(Web3.givenProvider)
      if (this.web3.version.api.startsWith("0")){
        this.contract = this.web3.eth.contract(this.abi()).at(this.contractAddr)
      } else {
        this.contract = new this.web3.eth.Contract(this.abi(), this.contractAddr)
      }
    })
  }

  abi() {
    return [
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          },
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "shortenedURLs",
        "outputs": [
          {
            "name": "",
            "type": "bytes"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "kill",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "listAccts",
        "outputs": [
          {
            "name": "",
            "type": "address[]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_url",
            "type": "string"
          },
          {
            "name": "_short",
            "type": "bytes"
          },
          {
            "name": "paid",
            "type": "bool"
          }
        ],
        "name": "shortenURLWithSlug",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "paid",
            "type": "bool"
          }
        ],
        "name": "shortenURL",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_short",
            "type": "bytes"
          }
        ],
        "name": "getURL",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "url",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "slug",
            "type": "bytes"
          },
          {
            "indexed": false,
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "URLShortened",
        "type": "event"
      }
    ]
  }

  shortenUrl(url, slug){

  }

  async getUrl(slug, cb){
    if (this.web3.version.api.startsWith("0")) {
      this.contract.getURL.call(slug, cb)
      return
    } else {
      const destination = await this.contract.methods.getURL(slug).call()
    }
    return destination
  }

  grabShortened(acct, index=0, cb, urls){
    this.contract.shortenedURLs(acct, index, (x, short) => {
      this.addURL(short, urls, acct, index+1)
    })
  }

  addUrl(short, urls, acct, index) {
    if(short){
      urls.push(short)
      this.grabShortened(acct, index, this.addUrl, urls)
    } else {

    }
  }

  async listOfUrls(acct){
    let account = acct || web3.eth.accounts[0]
    const urls = []
    if (this.web3.version.api.startsWith("0")) {
      this.grabShortened(account, 0, this.addUrl, urls)
    } else {
      let url = await this.contract.shortenedURLs(account, 0).call()
      let i  = 1
      while (url){
        url = await this.contract.shortenedURLs(account, i).call()
        urls.push(url)
        i += 1
      }
    }

    return urls
  }

  async forward(slug){
    window.location.href = await this.getUrl(slug)
  }
}

module.exports = Du4e
