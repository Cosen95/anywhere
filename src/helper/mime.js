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
