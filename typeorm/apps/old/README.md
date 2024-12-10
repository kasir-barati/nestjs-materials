# How to run integration tests

run `./run-integration-tests.sh`

```cmd
ERROR [ExceptionsHandler] null value in column "id" violates not-null constraint
```

# TODOs:

- Fix integration error

```ts
it('client should receive something!?', (done) => {
  const smartAdmin = getSmartAdminUser();
  const assetId = randomUUID();
  const imei = '19191919';
  const tracePoints: {
    lat: number;
    lng: number;
    timestamp: string;
  }[] = [];
  for (let gpsEventCount = 7; gpsEventCount > 0; gpsEventCount--) {
    const timestamp = moment('2023-12-16T19:30:30.000Z')
      .subtract(gpsEventCount, 'hour')
      .toISOString();
    const latitude = 53.04405368645307 + Math.random() - 0.1;
    const longitude = 8.614398461193254 + Math.random() - 0.1;

    tracePoints.push({ lat: latitude, lng: longitude, timestamp });
  }

  new AssetCreatedEventBuilder()
    .withPostEventEntity({
      id: assetId,
      type: AssetType.Movr1,
      rytleInternalNumber: 'MOVR-With-7-position',
      customer: {
        id: customerId,
        name: 'Some customer',
        externalId: 'C-19037289029',
        address: 'Some street 1, 12345 Some City',
      },
    })
    .publish()
    .then(() =>
      new EquipmentEditEventBuilder()
        .withImei(imei)
        .withCustomerId(customerId)
        .withAssetId(assetId)
        .publish(),
    )
    .then(() => wait())
    .then(async () => {
      const promises: Promise<void>[] = [];
      for (let i = tracePoints.length; i > 0; i--) {
        promises.push(
          new IotGpsDataEventBuilder()
            .withImei(imei)
            .withPayload({
              latitude: tracePoints[i - 1].lat,
              longitude: tracePoints[i - 1].lng,
              timestamp: tracePoints[i - 1].timestamp,
            })
            .publish(),
        );
      }

      return Promise.all(promises);
    })
    .then(() => wait(10_000))
    .then(() => login(smartAdmin.email, smartAdmin.password))
    .then((authenticationResult) => {
      const client = io('ws://localhost:3340', {
        extraHeaders: authenticationResult.headers,
      });

      client.on('message', (message) => {
        const data = JSON.parse(message) as ControlCenterEvent;
        if (data.eventType === 'INITIAL') {
          const asset = data.entities.find(
            (entity) => entity.id === assetId,
          );
          // writeFileSync("expectedAssetTracePoints2.json", JSON.stringify(tracePoints), "utf-8")
          // writeFileSync("assetTrace2.json", JSON.stringify(asset.trace), "utf-8")
          expect(asset.trace).toStrictEqual(tracePoints);
          done();
        }
      });
      client.on('error', done);
    })
    .catch(done);
}, 50000);
```
