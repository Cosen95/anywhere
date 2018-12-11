const path = require('path');
const mimeTypes = {
    'css': { 
        text: 'text/css',
        icon: ''
    },
    'gif': { 
        text: 'image/gif',
        icon: ''
    },
    'html': {
        text: 'text/html',
        icon: ''
    },
    'ico': {
        text: 'image/x-icon',
        icon: ''
    },
    'jpeg': {
        text: 'image/jpeg',
        icon: ''
    },
    'jpg': {
        text: 'image/jpeg',
        icon: ''
    },
    'js': {
        text: 'text/javascript',
        icon: ''
    },
    'json': {
        text: 'application/json',
        icon: ''
    },
    'pdf': {
        text: 'application/pdf',
        icon: ''
    },
    'png': {
        text: 'image/png',
        icon: ''
    },
    'svg': {
        text: 'image/svg+xml',
        icon: ''
    },
    'swf': {
        text: 'application/x-shockwave-flash',
        icon: ''
    },
    'tiff': {
        text: 'image/tiff',
        icon: ''
    },
    'txt': {
        text: 'text/plain',
        icon: ''
    },
    'wav': {
        text: 'audio/x-wav',
        icon: ''
    },
    'wma': {
        text: 'audio/x-ms-wma',
        icon: ''
    },
    'wmv': {
        text: 'video/x-ms-wmv',
        icon: ''
    },
    'xml': {
        text: 'text/xml',
        icon: ''
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
