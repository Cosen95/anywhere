# anywhere
## node构建本地服务器

## 命令介绍

1.`supervisor src/app.js`
* 启动服务

## 项目依赖

### supervisor

### chalk

### handlebars

### yargs

## 项目结构

`src/app.js`
项目主入口
```
const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConf');
const route = require('./helper/route');

const server = http.createServer((req,res) => {
    const filePath = path.join(conf.root,req.url);
    route(req, res, filePath, conf);
});
        
server.listen(conf.port,conf.host, () => {
    const addr = `http://${conf.host}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`);
});

```

`src/helper/route.js`
通过fs模块下的stat和readdir分别区分文件类型（目录或文件）并读取文件目录下的所有文件和具体文件的内容
```
const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

module.exports = async function (req, res, filePath, config) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain'); 
            fs.createReadStream(filePath).pipe(res);           
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(files.join(','));
        }
    } catch (error) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file`);
    }
}

```

引入模板引擎`handlebars`对目录进行处理
`yarn add handlebars`
在`src/helper/route.js`中添加如下代码
```
+const path = require('path');
+const Handlebars = require('handlebars');

+const tplPath = path.join(__dirname,'../template/dir.tpl');
+const source = fs.readFileSync(tplPath);
+const template = Handlebars.compile(source.toString());

...
...

} else if (stats.isDirectory()) {
   const files = await readdir(filePath);
   res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
+    const dir = path.relative(config.root, filePath);
+    const data = {
+        title: path.basename(filePath),
+        dir: dir ? `/${dir}` : '',
+        files: files.map(file => {
+            return {
+                file,
+                icon: mime(file).icon
+            }
+        })
+    };
+    res.end(template(data));
    // res.end(files.join(','));
}

```

添加tpl模板文件
`src/template/dir.tpl`
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{title}}</title>
    <style>
        body {
            margin: 30px;
        }
        a {
            display: block;
            cursor: pointer;
            font-size: 24px;
        }
    </style>
</head>
<body>
    {{#each files}}
        <a href="{{../dir}}/{{file}}"><img src={{icon}} alt="" />{{file}}</a>
    {{/each}}
</body>
</html>

```

添加mimeType类型识别，针对不同类型请求返回不同的Content-type，并依据不同文件类型在文件名前面添加不同图标
`src/helper/mime.js`
```
const path = require('path');
const mimeTypes = {
    'css': { 
        text: 'text/css',
        icon: 'src/static/images/CSS.png'
    },
    'gif': { 
        text: 'image/gif',
        icon: 'src/static/images/GIF.png'
    },
    'html': {
        text: 'text/html',
        icon: 'src/static/images/html.png'
    },
    'ico': {
        text: 'image/x-icon',
        icon: 'src/static/images/ICO.png'
    },
    'jpeg': {
        text: 'image/jpeg',
        icon: 'src/static/images/JPEG.png'
    },
    'jpg': {
        text: 'image/jpeg',
        icon: 'src/static/images/JPG.png'
    },
    'js': {
        text: 'text/javascript',
        icon: 'src/static/images/JS.png'
    },
    'json': {
        text: 'application/json',
        icon: 'src/static/images/json.png'
    },
    'pdf': {
        text: 'application/pdf',
        icon: 'src/static/images/pdf.png'
    },
    'png': {
        text: 'image/png',
        icon: 'src/static/images/PNG.png'
    },
    'svg': {
        text: 'image/svg+xml',
        icon: 'src/static/images/SVG.png'
    },
    'swf': {
        text: 'application/x-shockwave-flash',
        icon: 'src/static/images/SWF.png'
    },
    'tiff': {
        text: 'image/tiff',
        icon: 'src/static/images/Tiff.png'
    },
    'txt': {
        text: 'text/plain',
        icon: 'src/static/images/txt.png'
    },
    'wav': {
        text: 'audio/x-wav',
        icon: 'src/static/images/WAV.png'
    },
    'wma': {
        text: 'audio/x-ms-wma',
        icon: 'src/static/images/Wma-Doc.png'
    },
    'wmv': {
        text: 'video/x-ms-wmv',
        icon: 'src/static/images/wmv.png'
    },
    'xml': {
        text: 'text/xml',
        icon: 'src/static/images/XML.png'
    }
};

module.exports = (filePath) => {
    let ext = path.extname(filePath)
        .split('.')
        .pop()
        .toLowerCase();

    if (!ext) {
        ext = filePath
    }

    return mimeTypes[ext] || mimeTypes['txt']
}


```

对文件压缩，减少请求资源损耗
`src/helper/compress.js`

```
const { createGzip, createDeflate } = require('zlib');

module.exports = (rs, req, res) => {
    const acceptEncoding = req.headers['accept-encoding'];
    if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
        return rs;
    } else if (acceptEncoding.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding','gzip');
        return rs.pipe(createGzip());
    } else if (acceptEncoding.match(/\bdeflate\b/)) {
        res.setHeader('Content-Encoding', 'deflate');
        return rs.pipe(createDeflate());
    }

}

```

http请求头range(用于请求头中，指定第一个字节的位置和最后一个字节的位置)
`src/helper/range.js`
```
module.exports = (totalSize, req, res) => {
    const range = req.headers['range'];
    if (!range) {
        return { code: 200 };
    }

    const sizes = range.match(/bytes=(\d*)-(\d*)/);
    const end = sizes[2] || totalSize -1;
    const start = sizes[1] || totalSize - end;

    if (start > end || start < 0 || end > totalSize) {
        return { code: 200 };
    }

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Range',`bytes ${start}-${end}/${totalSize}`);
    res.setHeader('Content-Length', end - start);
    return {
        code: 206,
        start: parseInt(start),
        end: parseInt(end)
    }
}

```

缓存（本地缓存和浏览器缓存）
`src/helper/cache.js`

```
const { cache } = require('../config/defaultConf');

function refreshRes(stats, res) {
    const { maxAge, expires, cacheControl, lastModified, etag } = cache;
    if (expires) {
        res.setHeader('Expires', new Date(Date.now() + maxAge * 1000).toUTCString());
    }

    if (cacheControl) {
        res.setHeader('Cache-Control', `public,max-age=${maxAge}`);
    }

    if (lastModified) {
        res.setHeader('Last-Modified', stats.mtime.toUTCString());
    }

    if (etag) {
        res.setHeader('ETag', `${stats.size}-${stats.mtime}`);
    }
}

module.exports = function isFresh(stats, req, res) {
    refreshRes(stats, res);

    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    if (!lastModified && !etag) {
        return false;
    }

    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
        return false;
    }

    if (etag && etag !== res.getHeader('ETag')) {
        return false;
    }

    return true;

}

```
