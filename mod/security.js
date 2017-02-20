var crypto = require('crypto');

exports.buildHash = function (plain) {
    return crypto.createHash('md5').update(plain).digest('hex');
};