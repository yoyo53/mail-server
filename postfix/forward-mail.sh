#!/bin/sh

PID=$(pidof supervisord)
export $(grep -v '^#' /proc/$PID/environ  | xargs -0)

cat | curl -X POST "http://localhost:$API_PORT/emails" -H "Content-Type: text/plain" -H "Authorization: $AUTHORIZATION" --data-binary @- || exit 75
