import { NestFactory } from "@nestjs/core";
import "reflect-metadata";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000, "0.0.0.0");
}
void bootstrap();
