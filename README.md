# 0xSU - Ethereum Short URLs (JS Lib)

Finally, the thing you've been waiting for your entire adult life. Decentralized URL shortener. It's like `goo.gl` except it can't be taken down. It's hosted on [QuikNode](https://quiknode.io/) and integrated with [Wyre](https://www.sendwyre.com/). This is the JS client you can use for integration with your web3 front-end.

Install: `npm install @jonbiro/0xsu-js-lib --save`

Here's how it works:

```js
import Du4e from '@jonbiro/0xsu-js-lib'
let oxsu = new Du4e()
```

Then it will automatically ask for permissions when necessary and pick up the appropriate version of web3. Now you can do things like, get the long version of a link based on a short slug:

```js
const short = "0x397997"

oxsu.getUrl(short).then(url => {
  console.log(url) // https://twitter.com/ETHNewYork/status/1125830316730519556
}) 

// or with await
let url = await oxsu.getUrl(short) // https://twitter.com/ETHNewYork/status/1125830316730519556
```

or if you want to redirect the browser:

```js
oxsu.forward("0x397997") // https://twitter.com/ETHNewYork/status/1125830316730519556
```

or just shorten a URL:

```js
const url = "https://twitter.com/ETHNewYork/status/1125830316730519556"
// with zero config
await oxsu.shortenURL(url) // 0xe8d142c0d547f254be15e4aa3a8b7e45139c7b74e7cf425269d63990bb602a8a
// with more control 
oxsu.shortenURL(
  url,
  {
    slug: "vitalik", // [optional] do you know what you want your shortened slug to be?
    acct: "0x31D583a494af597B53eB49B62FCaAb4BAF7f2e69", // [optional] do you want to send from some different address?
    cb: (txID) => { // [optional] using an older version of web3 lib?
      console.log("0xSU TX ID: ", txID) // 0xSU TX ID: 0xe8d142c0d547f254be15e4aa3a8b7e45139c7b74e7cf425269d63990bb602a8a
    }
  }
)
```

and then you can listen for a shortenedURL:

```js
oxsu.onURLShorten = (slug) => {
  console.log("Slug is ", slug) // Slug is 0x397997
}
```

or grab all the shortened URLs for a particular Ethereum account:

```js
oxsu.listOfUrls((urls) => {
  console.log(urls) // list of short url slugs useable on any forwarder
}) // gets web3 account urls
oxsu.listOfUrls("0x31D583a494af597B53eB49B62FCaAb4BAF7f2e69", (urls) => {
  console.log(urls) // list of short url slugs useable on any forwarder
}) // gets web3 account urls
```



Thanks. This project was made by [@jonathanbiro](https://twitter.com/jonathanbiro) and [@bunsen](https://twitter.com/bunsen)
