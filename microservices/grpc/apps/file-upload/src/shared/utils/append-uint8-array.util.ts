export function appendUint8Array(
  data: Uint8Array,
  newData: Uint8Array,
) {
  const combined = new Uint8Array(data.length + newData.length);

  if (data.length === 0) {
    combined.set(newData);
    return combined;
  }

  combined.set(data);
  combined.set(newData, newData.length + 1);

  return combined;
}
