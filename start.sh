#!/bin/sh

eval "echo \"$(cat /etc/postfix/main.cf)\"" > /etc/postfix/main.cf
eval "echo \"$(cat /etc/postfix/virtual)\"" > /etc/postfix/virtual
eval "echo \"$(cat /etc/postfix/virtual_aliases)\"" > /etc/postfix/virtual_aliases

postmap /etc/postfix/virtual
postmap /etc/postfix/virtual_aliases

/usr/bin/supervisord -c /etc/supervisord.conf
