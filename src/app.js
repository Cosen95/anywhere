const http = require('http');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const conf = require('./config/defaultConf');

const server = http.createServer((req,res) => {
    const filePath = path.join(conf.root,req.url);
    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`${filePath} is not a directory or file`);
            return;
        }

        if (stats.isFile()) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            // fs.readFile(filePath, (err, data) => {
            //     res.end(data);
            // })
            fs.createReadStream(filePath).pipe(res);
        } else if (stats.isDirectory()) {
            fs.readdir(filePath, (err, files) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(files.join(','));
            });
        }
    });
});

server.listen(conf.port,conf.host, () => {
    const addr = `http://${conf.host}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`);
});