const emailQueries = require("../database/queries/emails.queries");
const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        if (req.body) {
            const email = await emailQueries.saveEmail(req.body);
            res.status(201).json(email);
        } else {
            res.status(400).json({ error: "Bad request" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const emails = await emailQueries.getMailboxes();
        res.status(200).json(emails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/", async (req, res) => {
    try {
        await emailQueries.deleteEmails();
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:recipient", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        const emails = await emailQueries.getEmailsByRecipient(recipient);
        res.status(200).json(emails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:recipient", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        await emailQueries.deleteEmailsByRecipient(recipient);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:recipient/:id", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        const email = await emailQueries.getEmailByRecipientAndId(recipient, req.params.id);
        if (email) {
            res.status(200).json(email);
        } else {
            res.status(404).json({ error: "Email not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:recipient/:id/text", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        const textEmail = await emailQueries.getTextEmailByRecipientAndId(recipient, req.params.id);
        if (textEmail) {
            res.status(200).send(textEmail);
        } else {
            res.status(404).json({ error: "Email not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:recipient/:id/html", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        const htmlEmail = await emailQueries.getHtmlEmailByRecipientAndId(recipient, req.params.id);
        if (htmlEmail) {
            res.status(200).send(htmlEmail);
        } else {
            res.status(404).json({ error: "Email not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:recipient/:id/raw", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        const rawEmail = await emailQueries.getRawEmailByRecipientAndId(recipient, req.params.id);
        if (rawEmail) {
            res.status(200).send(rawEmail);
        } else {
            res.status(404).json({ error: "Email not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:recipient/:id", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        const id = await emailQueries.deleteEmailByRecipientAndId(recipient, req.params.id);
        if (id) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: "Email not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;