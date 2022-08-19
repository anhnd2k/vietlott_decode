import {Component} from 'react';
import IDataStream from '../stdData/IDataStream';
import {intToByte} from '../modal';

interface Props {
  data?: number[];
  text?: string;
  packed?: boolean;
}

class TSN extends Component<Props> {
  LENGTH = 16;
  data = new Array();
  length: number = 0;
  constructor(props: Props) {
    super(props);
    if (props.data && props.packed === undefined) {
      this.data = props.data;
      this.setLength(props.data.length);
    } else if (
      props.text &&
      props.data === undefined &&
      props.packed === undefined
    ) {
      this.data = props.text.split('').map(function (s) {
        return s.charCodeAt(0);
      });
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i] >= 48 && this.data[i] <= 57) {
          this.data[i] = (this.data[i] - 48) | 0;
        } else {
          this.data[i] = (this.data[i] - 55) | 0;
        }
      }

      this.setLength(this.data.length);
    } else if (props.data && props.packed !== undefined) {
      if (props.packed) {
        this.unpackTSN(props.data);
      } else {
        this.data = props.data;
      }
      this.setLength(this.data.length);
    } else {
      this.data = new Array<number>(8);
      this.setLength(0);
    }
    this.state = {};
  }

  setLength(len: number) {
    this.length = len;
  }

  packTSN(): number[] {
    let length: number = this.data.length / 2;
    const b = new Array(length);
    let i = 0;
    for (let j = 0; i < length; i++) {
      // eslint-disable-next-line no-bitwise
      b[i] = this.data[j++] << 4;
      // eslint-disable-next-line no-bitwise
      b[i] = b[i] | (this.data[j++] & 15);
    }
    return b;
  }

  unpackTSN(packedData: number[]) {
    const length = packedData.length * 2;
    this.data = new Array<Number>(length);
    let i = 0;
    for (let j = 0; i < length; j++) {
      // eslint-disable-next-line no-bitwise
      this.data[i++] = intToByte((packedData[j] >> 4) & 15);
      // eslint-disable-next-line no-bitwise
      this.data[i] = intToByte(packedData[j] & 15);
      ++i;
    }
  }

  dumpTSN(tsn: number[]) {
    let t: string = IDataStream.toHexString(tsn);
    const s = [];
    s.push(t.substring(0, 2));
    s.push(t.substring(3, 5));
    s.push('-');
    s.push(t.substring(6, 8));
    s.push(t.substring(9, 11));
    s.push('-');
    s.push(t.substring(12, 14));
    s.push(t.substring(15, 17));
    s.push('-');
    s.push(t.substring(18, 20));
    s.push(t.substring(21, 23));
    return s.toString();
  }
}

export default TSN;
