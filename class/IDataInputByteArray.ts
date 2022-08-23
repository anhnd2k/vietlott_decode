import {Component} from 'react';
import {intToByte, toShort} from './modal';
interface Props {
  b: Uint8Array | number[];
}

class IDataInputByteArray extends Component<Props> {
  dataInput: Uint8Array | number[];
  countReadNumber: number;
  constructor(props: Props) {
    super(props);
    this.dataInput = props.b;
    this.countReadNumber = 0;
    this.state = {};
  }

  getSize(): number {
    let size: number = 0;
    try {
      size = this.dataInput.length;
    } catch {
      console.log('===>>> getSize err in IDataInputByteArray');
    }
    return size;
  }

  readBytesInt(
    b: number[],
    off: number,
    len: number,
  ): {count: number; newArr: number[]} {
    // off: read from
    // len: size read
    let count: number = 0;
    const newArr: number[] = [];
    try {
      //count = this.read(b, off, len);
      const a = len + off + this.countReadNumber;
      for (let i = off + this.countReadNumber; i < a; i++) {
        // if (this.dataInput[i]) {
        const ahihi = intToByte(this.dataInput[i]);
        newArr.push(ahihi);
        count += 1;
        // }
      }
      this.countReadNumber += len;
    } catch {
      console.log('===>>> readBytes err IDataInputByteArray');
    }
    return {count, newArr};
  }

  readBytesString(count: number): string {
    let b: number[] = [];
    for (let i = 0; i < count; i++) {
      let t = this.dataInput[i];
      if (t === 0) {
        t = 32;
      }
      b[i] = t;
    }
    return b.toString();
  }

  readByteValue(): number {
    let b: number = 0;
    try {
      b = this.dataInput[this.countReadNumber];
    } catch (error) {
      console.log('==>>>> err in line 70 file IDataInputByteArray.ts');
    }
    this.countReadNumber += 1;
    return b;
  }

  readWord(): number {
    let s: number = 0;
    try {
      // s = (short)(this.readByte() & 255);
      // s += (short)(this.readByte() * 256 & '\uff00');
      s = toShort((<number>(this.readByteValue() & 255)) | 0);
      s += toShort(
        (<number>((this.readByteValue() * 256) & '\uff00'.charCodeAt(0))) | 0,
      );
    } catch (error) {
      console.log('==>>>> err in line 73 file IDataInputByteArray.ts');
    }

    return s;
  }

  readLongWord() {
    let i: number = this.readWord() & '\uffff'.charCodeAt(0);
    i += this.readWord() << 16;
    return i;
  }
}

export default IDataInputByteArray;
/* Reading the bytes from the input stream and converting them to an integer. */
