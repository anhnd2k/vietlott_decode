const modal = () => {};

function intToByte(x: number): number {
  if (x > 128) {
    return x - 256;
  } else if (x === 128) {
    return -128;
  }
  return x;
}

function toShort(number: number) {
  const int16 = new Int16Array(1);
  int16[0] = number;
  return int16[0];
}

export {intToByte, toShort};
export default modal;
