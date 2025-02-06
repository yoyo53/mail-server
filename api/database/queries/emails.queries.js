const pool = require("../db.connection");
const mailparser = require('mailparser');

const parseRawEmail = async (rawEmail) => {
    const parsedEmail = await mailparser.simpleParser(rawEmail);
    const { text, html, textAsHtml, subject, date, from: { text: sender } = {}, to: { text: recipient } = {} } = parsedEmail;
    const [_, senderName, senderEmail] = (sender ?? '').match(/"(.*)" <(.*)>/) ?? [];
    return { text, html, textAsHtml, subject, date, sender, senderName, senderEmail, recipient };
};

const saveEmail = async (rawEmail) => {
    const { text, html, textAsHtml, subject, date, sender, senderName, senderEmail, recipient } = await parseRawEmail(rawEmail);
    const query = "INSERT INTO emails (sender, sender_name, recipient, subject, text, html, sent_at, received_at, raw_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    const values = [senderEmail ?? sender, senderName, recipient, subject, text, html ?? textAsHtml, date?.toISOString(), new Date().toISOString(), rawEmail ?? ""];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getMailboxes = async () => {
    const query = "SELECT DISTINCT recipient, COUNT(*) AS emails, MAX(received_at) AS last_email FROM emails GROUP BY recipient";
    const result = await pool.query(query);
    return result.rows;
};

const deleteEmails = async () => {
    const query = "DELETE FROM emails RETURNING id";
    const result = await pool.query(query);
    return result.rows;
};

const getEmailsByRecipient = async (recipient) => {
    const query = "SELECT id, sender, sender_name, subject, received_at FROM emails WHERE recipient = $1 ORDER BY received_at DESC";
    const result = await pool.query(query, [recipient]);
    return result.rows;
};

const deleteEmailsByRecipient = async (recipient) => {
    const query = "DELETE FROM emails WHERE recipient = $1 RETURNING id";
    const result = await pool.query(query, [recipient]);
    return result.rows;
};

const getEmailByRecipientAndId = async (recipient, id) => {
    const query = "SELECT id, sender, sender_name, recipient, subject, text, sent_at, received_at FROM emails WHERE recipient = $1 AND id = $2";
    const result = await pool.query(query, [recipient, id]);
    return result.rows?.[0] ?? null;
};

const getTextEmailByRecipientAndId = async (recipient, id) => {
    const query = "SELECT text FROM emails WHERE recipient = $1 AND id = $2";
    const result = await pool.query(query, [recipient, id]);
    return result.rows?.[0]?.text ?? null;
};

const getHtmlEmailByRecipientAndId = async (recipient, id) => {
    const query = "SELECT html FROM emails WHERE recipient = $1 AND id = $2";
    const result = await pool.query(query, [recipient, id]);
    return result.rows?.[0]?.html ?? null;
};

const getRawEmailByRecipientAndId = async (recipient, id) => {
    const query = "SELECT raw_email FROM emails WHERE recipient = $1 AND id = $2";
    const result = await pool.query(query, [recipient, id]);
    return result.rows?.[0]?.raw_email ?? null;
};

const deleteEmailByRecipientAndId = async (recipient, id) => {
    const query = "DELETE FROM emails WHERE recipient = $1 AND id = $2 RETURNING id";
    const result = await pool.query(query, [recipient, id]);
    return result.rows?.[0]?.id ?? null;
};

const deleteEmailsBeforeDate = async (date) => {
    const query = "DELETE FROM emails WHERE received_at < $1 RETURNING id";
    const result = await pool.query(query, [date.toISOString()]);
    return result.rows;
};

module.exports = {
    saveEmail,
    getMailboxes,
    deleteEmails,
    getEmailsByRecipient,
    deleteEmailsByRecipient,
    getEmailByRecipientAndId,
    getTextEmailByRecipientAndId,
    getHtmlEmailByRecipientAndId,
    getRawEmailByRecipientAndId,
    deleteEmailByRecipientAndId,
    deleteEmailsBeforeDate,
};
