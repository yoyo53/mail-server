const emailController = require("../controllers/emails.controller");
const emailQueries = require("../database/queries/emails.queries");
const attachmentsQueries = require("../database/queries/attachments.queries");
const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        if (req.body) {
            const { text, html, textAsHtml, subject, date, sender, senderName, senderEmail, recipient, attachments } = await emailController.parseRawEmail(req.body);
            const email = await emailQueries.saveEmail(text, html, textAsHtml, subject, date, sender, senderName, senderEmail, recipient, req.body);
            for (const attachment of attachments ?? []) {
                await attachmentsQueries.saveAttachment(email.id, attachment.filename, attachment.contentType, attachment.size, attachment.content);
            }
            res.status(201).end();
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

router.get("/:recipient/:emailId", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        const email = await emailQueries.getEmailByRecipientAndId(recipient, req.params.emailId);
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

router.get("/:recipient/:emailId/text", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        const textEmail = await emailQueries.getTextEmailByRecipientAndId(recipient, req.params.emailId);
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

router.get("/:recipient/:emailId/html", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        const htmlEmail = await emailQueries.getHtmlEmailByRecipientAndId(recipient, req.params.emailId);
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

router.get("/:recipient/:emailId/raw", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        const rawEmail = await emailQueries.getRawEmailByRecipientAndId(recipient, req.params.emailId);
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

router.delete("/:recipient/:emailId", async (req, res) => {
    try {
        const recipient = req.params.recipient + "@" + process.env.HOSTNAME;
        const id = await emailQueries.deleteEmailByRecipientAndId(recipient, req.params.emailId);
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

router.use("/:recipient/:emailId/attachments", require("./attachments.routes"));

module.exports = router;