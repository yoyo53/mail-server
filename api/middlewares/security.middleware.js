function verifyAuthorization(request, response, next) {
    // NB: no `WWW-Authenticate: Basic` header is sent — it would make the browser
    // hijack the UI's fetch() calls with its own native login popup (and loop on it).
    // The web UI supplies credentials via the Authorization header itself.
    const auth = request.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
        return response.status(401).send('Authentication required.');
    }

    const [username, password] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
        return next();
    } else {
        return response.status(401).send('Invalid credentials.');
    }
}


module.exports = { verifyAuthorization };
