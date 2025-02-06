FROM node:22-alpine AS base

WORKDIR /app

FROM base AS builder

COPY api/package.json api/package-lock.json ./
RUN npm install

FROM base AS production

RUN apk add --no-cache postfix curl supervisor sudo

COPY --from=builder /app/node_modules ./node_modules
COPY api .

COPY start.sh /usr/local/bin/start.sh
COPY postfix/forward-mail.sh /usr/local/bin/forward-mail.sh
COPY postfix/main.cf /etc/postfix/main.cf
COPY postfix/virtual /etc/postfix/virtual
COPY postfix/virtual_aliases /etc/postfix/virtual_aliases
COPY supervisor/supervisord.conf /etc/supervisord.conf

RUN chmod +x /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/forward-mail.sh && \
    chown root:root /etc/postfix/main.cf && \
    chown root:root /etc/postfix/virtual && \
    chown root:root /etc/postfix/virtual_aliases && \
    chmod 644 /etc/postfix/main.cf && \
    chmod 644 /etc/postfix/virtual && \
    chmod 644 /etc/postfix/virtual_aliases

RUN echo 'nobody ALL=(ALL) NOPASSWD: /usr/local/bin/forward-mail.sh' >> /etc/sudoers && \
    sed -i '/^virtual /d' /etc/postfix/master.cf && \
    echo "virtual    unix  -       n       n       -       -       pipe flags=Fq. user=nobody argv=sudo /usr/local/bin/forward-mail.sh" >> /etc/postfix/master.cf

EXPOSE 25 3000

CMD ["/usr/local/bin/start.sh"]
