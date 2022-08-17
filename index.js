/* MODULES ////////////////////////////// */
// Core
const http = require('http');
const fs = require('fs');
const url = require('url');
// Third party
const slugify = require('slugify');
// Personal
const replaceTemplate = require('./modules/replaceTemplate');

// FILES ////////////////////////////// */
// Templates
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

/* DATA ////////////////////////////// */
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

/* SERVER - CREATE ////////////////////////////// */
const server = http.createServer((req, res) => {
  /* ROUTER ////////////////////////////// */
  const { query, pathname } = url.parse(req.url, true);
  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCTCARD%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'HELLLLOOOOOOO-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

/* SERVER - LISTEN //////////////////////////////
  Listens for incoming requests; Basically starts up the server */
server.listen(8001, '127.0.0.1', () => {
  console.log('Listening to requests on port : http://127.0.0.1:8001/');
});
