function verifyAuthorization(request, response, next) {
    const authorization = request.get("Authorization");
    if (authorization === process.env.AUTHORIZATION) {
        next();
    } else {
        response.status(401).json({ error: "Unauthorized" });
    }
}

module.exports = { verifyAuthorization };