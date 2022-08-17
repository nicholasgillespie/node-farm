/* MODULES ////////////////////////////// */
const http = require('http');
const fs = require('fs');

/* FUNCTION ////////////////////////////// */
const replaceTemplate = (temp, product) => {
  let output = temp.replaceAll('{%PRODUCTNAME%}', product.productName);
  output = output.replaceAll('{%IMAGE%}', product.image);
  output = output.replaceAll('{%PRICE%}', product.price);
  output = output.replaceAll('{%FROM%}', product.from);
  output = output.replaceAll('{%NUTRIENTS%}', product.nutrients);
  output = output.replaceAll('{%QUANTITY%}', product.quantity);
  output = output.replaceAll('{%DESCRIPTION%}', product.description);
  output = output.replaceAll('{%ID%}', product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

// FILES - TEMPLATES ////////////////////////////// */
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
// const tempProduct = fs.readFileSync(
//   `${__dirname}/templates/template-product.html`,
//   'utf-8'
// );

/* DATA - API ////////////////////////////// */
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

/* SERVER - CREATE ////////////////////////////// */
const server = http.createServer((req, res) => {
  /* ROUTER ////////////////////////////// */
  const pathName = req.url;
  // Overview page
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCTCARD%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathName === '/product') {
    res.end('PRODUCT');

    // API
  } else if (pathName === '/api') {
    // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
    // when send JSON, need to say application
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
    // });

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
  Listens for incoming requests; Basically starts up the server
  */
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port : http://127.0.0.1:8000/');
});
