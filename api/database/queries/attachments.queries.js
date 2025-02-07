const pool = require("../db.connection");

const saveAttachment = async (emailId, filename, contentType, size, content) => {
    const query = "INSERT INTO attachments (email_id, filename, content_type, content) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [emailId, filename, contentType, content];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getAttachmentsByEmailId = async (emailId) => {
    const query = "SELECT id, filename, content_type, size FROM attachments WHERE email_id = $1";
    const result = await pool.query(query, [emailId]);
    return result.rows;
};

const deleteAttachmentsByEmailId = async (emailId) => {
    const query = "DELETE FROM attachments WHERE email_id = $1 RETURNING id";
    const result = await pool.query(query, [emailId]);
    return result.rows;
};

const getAttachmentByEmailIdAndId = async (emailId, id) => {
    const query = "SELECT id, filename, content_type, size, content FROM attachments WHERE email_id = $1 AND id = $2";
    const result = await pool.query(query, [emailId, id]);
    return result.rows?.[0] ?? null;
};

const deleteAttachmentByEmailIdAndId = async (emailId, id) => {
    const query = "DELETE FROM attachments WHERE email_id = $1 AND id = $2 RETURNING id";
    const result = await pool.query(query, [emailId, id]);
    return result.rows?.[0]?.id ?? null;
};

module.exports = {
    saveAttachment,
    getAttachmentsByEmailId,
    deleteAttachmentsByEmailId,
    getAttachmentByEmailIdAndId,
    deleteAttachmentByEmailIdAndId,
};