function success(res, data) {
    data = data || {};
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
}

function fail(res, msg, code) {
    code = code || 500;
    msg = msg || '';
    res.status(code);
    res.set('Content-Type', 'application/json');
    res.send({ error: msg, msg });
}

module.exports = {
    success, fail
};
