const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConf');
const route = require('./helper/route');

const server = http.createServer((req,res) => {
    const filePath = path.join(conf.root,req.url);
    route(req, res, filePath);
});

server.listen(conf.port,conf.host, () => {
    const addr = `http://${conf.host}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`);
});