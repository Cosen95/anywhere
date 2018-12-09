const http = require('http');
const chalk = require('chalk');
const conf = require('./config/defaultConf');

const server = http.createServer((req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    res.write('<html><body><h2>anywhere</h2></body></html>');
    res.end();
});

server.listen(conf.port,conf.host, () => {
    const addr = `http://${conf.host}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`);
});