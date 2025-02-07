const attachmentsQueries = require("../database/queries/attachments.queries");
const router = require("express").Router({ mergeParams: true });

router.get("/", async (req, res) => {
    try {
        const attachments = await attachmentsQueries.getAttachmentsByEmailId(req.params.emailId);
        res.status(200).json(attachments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/", async (req, res) => {
    try {
        await attachmentsQueries.deleteAttachmentsByEmailId(req.params.emailId);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:attachmentId", async (req, res) => {
    try {
        const attachment = await attachmentsQueries.getAttachmentByEmailIdAndId(req.params.emailId, req.params.attachmentId);
        if (attachment) {
            res.setHeader("Content-Type", attachment.content_type)
                .setHeader("Content-Length", attachment.size)
               .setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(attachment.filename)}"`)
               .status(200).send(attachment.content);
        } else {
            res.status(404).json({ error: "Attachment not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:attachmentId", async (req, res) => {
    try {
        const attachmentId = await attachmentsQueries.deleteAttachmentByEmailIdAndId(req.params.emailId, req.params.attachmentId);
        if (attachmentId) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: "Attachment not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;