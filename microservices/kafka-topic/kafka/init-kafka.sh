#!/bin/bash

cd kafka_2.12-2.8.2

./bin/kafka-configs.sh \
  --zookeeper zookeeper:2181 \
  --alter \
  --add-config 'SCRAM-SHA-256=[password=password],SCRAM-SHA-512=[password=password]' \
  --entity-type users \
  --entity-name admin

# TODO: users without credentials are still able to access the local broker

./bin/kafka-topics.sh \
  --zookeeper zookeeper:2181 \
  --topic users \
  --create \
  --partitions 3 \
  --replication-factor 1
