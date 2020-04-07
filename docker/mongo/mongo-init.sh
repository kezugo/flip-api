#!/usr/bin/env sh

export $(cat .env | xargs)

if [ "$MONGO_USER" ] && [ "$MONGO_PASS" ]; then
"${mongo[@]}" "$MONGO_DB" <<-EOJS
db.createUser({
    user: $(_js_escape "$MONGO_USER"),
    pwd: $(_js_escape "$MONGO_PASS"),
    roles: [ "readWrite", "dbAdmin" ]
})
db.createUser({
    user: $(_js_escape "$MONGO_INITDB_ROOT_USERNAME"),
    pwd: $(_js_escape "$MONGO_INITDB_ROOT_PASSWORD"),
    roles: [ "readWrite", "dbAdmin" ]
})
EOJS
fi
