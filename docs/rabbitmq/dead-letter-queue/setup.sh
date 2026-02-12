#!/bin/bash
BASE_DIR=/scripts

until mongosh --eval 'db.runCommand("ping").ok' mongodb:27017/test --quiet; do
  printf '.'
  sleep 1
done

mongosh --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"mongodb:27017"}]});' mongodb:27017/test --quiet

until mongosh --eval 'rs.status().ok' mongodb:27017/test --quiet; do
  printf '.'
  sleep 1
done