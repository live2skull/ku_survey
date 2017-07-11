exports.getMysqlTime = function () {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

exports.getBoolConfig = function (cName) {
    var cf = process.env[cName];

    // 설정되지 않으면 false, 그렇지 않으면 본래 값을 가져온다.
    return cf === undefined ? false : cf == 'true';
};