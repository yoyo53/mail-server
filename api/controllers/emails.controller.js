const mailparser = require('mailparser');

const parseRawEmail = async (rawEmail) => {
    const parsedEmail = await mailparser.simpleParser(rawEmail);
    const { text, html, textAsHtml, subject, date, from: { text: sender } = {}, to: { text: recipient } = {}, attachments } = parsedEmail;
    const [_, senderName, senderEmail] = (sender ?? '').match(/"(.*)" <(.*)>/) ?? [];
    return { text, html, textAsHtml, subject, date, sender, senderName, senderEmail, recipient, attachments };
};

exports = {
    parseRawEmail,
};