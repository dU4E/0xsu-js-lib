# 0xSU - Ethereum Short URLs (JS Lib)

Finally, the thing you've been waiting for your entire adult life. Decentralized URL shortener. It's like `goo.gl` except it can't be taken down. It's hosted on [QuikNode](https://quiknode.io/) and integrated with [Wyre](https://www.sendwyre.com/). This is the JS client you can use for integration with your web3 front-end.

Here's how it works:

```js
import Du4e from '@jonbiro/0xsu-js-lib'
let oxsu = new Du4e()
```

Then it will automatically ask for permissions when necessary and pick up the appropriate version of web3. Now you can do things like, get the long version of a link based on a short slug:

```js
const short = "0x"

oxsu.getUrl(short).then(url => {
  console.log(url) // https://twitter.com/ETHNewYork/status/1125830316730519556
}) 

// or with await
let url = await oxsu.getUrl(short)
```

or if you want to redirect the browser:

```js
oxsu.forward("0x") // https://twitter.com/ETHNewYork/status/1125830316730519556
```

or just shorten a URL:

```js
const url = "https://twitter.com/ETHNewYork/status/1125830316730519556"
// with zero config
oxsu.shortenURL(url)
// with more control 
oxsu.shortenURL(
  url,
  {
    slug: "vitalik", // [optional] do you know what you want your shortened slug to be?
    acct: "0x....", // [optional] do you want to send from some different address?
    cb: (success) => { // [optional] using an older version of web3 lib?
      console.log("Successfully shortened URL?", success) 
    }
  }
)
```

Thanks. This project was made by [@jonathanbiro](https://twitter.com/jonathanbiro) and [@bunsen](https://twitter.com/bunsen)