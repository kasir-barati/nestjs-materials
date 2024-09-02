export function configureExceptionListeners() {
  process
    .on('uncaughtException', (error) => {
      console.info('Jest process exception listener util');
      console.error(error);
    })
    .on('unhandledRejection', (error) => {
      console.info('Jest process exception listener util');
      console.error(error);
    })
    .on('exit', (code) => {
      console.info('Jest process exited with %d.', code);
    });
}
