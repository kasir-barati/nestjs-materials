FROM debian:latest

RUN apt-get update
RUN apt-get install wget -yy
RUN apt-get install default-jre -yy

RUN wget -O kafka_2.12-2.8.2.tgz https://archive.apache.org/dist/kafka/2.8.2/kafka_2.12-2.8.2.tgz

RUN tar zxvf kafka_2.12-2.8.2.tgz

COPY ./kafka/init-kafka.sh .
RUN chmod +x ./init-kafka.sh

ENTRYPOINT ["./init-kafka.sh"]
