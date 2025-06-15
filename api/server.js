const app = require("./app");
const emailQueries = require("./database/queries/emails.queries");


require("./database/db.init")
    .createTables()
    .then(() => {
        const EMAIL_EXPIRATION_TIME = process.env.EMAIL_EXPIRATION_TIME || 1440;
        emailQueries.deleteEmailsBeforeDate(new Date(Date.now() - EMAIL_EXPIRATION_TIME * 60 * 1000));
        setInterval(() => {
            emailQueries.deleteEmailsBeforeDate(new Date(Date.now() - EMAIL_EXPIRATION_TIME * 60 * 1000));
        }, 24 * 60 * 60 * 1000);
    })
    .then(() => {
        const PORT = process.env.API_PORT || 3000;
        app.listen(PORT, () => console.log(`API running on port ${PORT}`));
    });
