import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

interface ConfigureSwaggerConfig {
    app: INestApplication;
    title: string;
    description: string;
    urlWithoutProtocol: string;
}

export function createSwagger({
    app,
    title,
    description,
    urlWithoutProtocol,
}: ConfigureSwaggerConfig) {
    const url = urlWithoutProtocol.endsWith('/')
        ? urlWithoutProtocol.slice(0, -1)
        : urlWithoutProtocol;
    const protocol = urlWithoutProtocol.includes('localhost')
        ? 'http://'
        : 'https://';
    const documentBuilder = new DocumentBuilder()
        .setTitle(title)
        .setDescription(description)
        .addServer(protocol + url);
    const document = SwaggerModule.createDocument(
        app,
        documentBuilder.build(),
    );

    SwaggerModule.setup('docs', app, document);
    return document;
}
