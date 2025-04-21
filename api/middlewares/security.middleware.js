function verifyAuthorization(request, response, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        res.set('WWW-Authenticate', 'Basic realm="Secure Area"');
        return res.status(401).send('Authentication required.');
    }

    const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
        return next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm="Secure Area"');
        return res.status(401).send('Invalid credentials.');
    }
}


module.exports = { verifyAuthorization };