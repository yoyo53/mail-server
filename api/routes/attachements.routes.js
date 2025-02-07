const attachementsQueries = require("../database/queries/attachements.queries");
const router = require("express").Router();

router.get("/", async (req, res) => {
    try {
        const attachements = await attachementsQueries.getAttachements(req.params.emailId);
        res.status(200).json(attachements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/", async (req, res) => {
    try {
        await attachementsQueries.deleteAttachements(req.params.emailId);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:attachementId", async (req, res) => {
    try {
        const attachement = await attachementsQueries.getAttachmentByEmailIdAndId(req.params.emailId, req.params.attachementId);
        if (attachement) {
            res.setHeader("Content-Type", attachement.content_type)
               .setHeader("Content-Disposition", `attachment; filename="${attachement.filename}"`)
               .status(200).send(attachement.content);
        } else {
            res.status(404).json({ error: "Attachement not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:attachementId", async (req, res) => {
    try {
        const attachementId = await attachementsQueries.deleteAttachmentByEmailIdAndId(req.params.emailId, req.params.attachementId);
        if (attachementId) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: "Attachement not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;