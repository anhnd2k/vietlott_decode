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

function decimalFormat(number: number, pattern: string) {
  const dataSplit = number.toString().split('');
  const lengthPattern = pattern.length;
  if (dataSplit.length < lengthPattern) {
    const spaceValue = lengthPattern - dataSplit.length;
    for (let i = 0; i < spaceValue; i++) {
      dataSplit.unshift('0');
    }
  }
  let num = dataSplit.join('');
  return num;
}

export {intToByte, toShort, decimalFormat};
export default modal;
