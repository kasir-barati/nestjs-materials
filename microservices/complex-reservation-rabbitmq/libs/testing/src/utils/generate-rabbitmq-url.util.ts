export function generateRabbitMqUrl(url: string): string {
  const connectionStringWithoutHost = url.substring(
    0,
    url.indexOf('@'),
  );
  const port = url.substring(url.lastIndexOf(':'));

  return connectionStringWithoutHost + '@localhost' + port;
}
