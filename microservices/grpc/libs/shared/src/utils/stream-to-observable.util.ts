import { Observable } from 'rxjs';

export function readableStreamToObservable(
  stream: ReadableStream<any>,
): Observable<{ data: Uint8Array }> {
  const reader = stream.getReader();

  return new Observable<{ data: Uint8Array }>((subscriber) => {
    function push() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            subscriber.complete();
            return;
          }
          subscriber.next({ data: value });
          push();
        })
        .catch((err) => subscriber.error(err));
    }

    push();

    return () => reader.cancel();
  });
}
