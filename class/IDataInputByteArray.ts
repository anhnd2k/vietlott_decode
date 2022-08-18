import {Component} from 'react';

interface Props {
  b: Uint8Array;
}

class IDataInputByteArray extends Component<Props> {
  dataInput: Uint8Array;
  constructor(props: Props) {
    super(props);
    this.dataInput = props.b;
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

  readBytesInt(b: number[], off: number, len: number): number {
    // off: read from
    // len: size read
    let count: number = 0;
    try {
      //count = this.read(b, off, len);
      const a = len + off;
      for (let i = off; i < a; i++) {
        if (this.dataInput[i]) {
          count += 1;
        }
      }
    } catch {
      console.log('===>>> readBytes err IDataInputByteArray');
    }
    return count;
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
      b = this.dataInput[0];
    } catch (error) {
      console.log('==>>>> err in line 60 file IDataInputByteArray.ts');
    }
    return b;
  }

  readWord(): number {
    let s: number = 0;
    try {
      // s = (short)(this.readByte() & 255);
      // s += (short)(this.readByte() * 256 & '\uff00');
      s = (<number>(this.dataInput[0] & 255)) | 0;
      s += (<number>((this.dataInput[0] * 256) & '\uff00'.charCodeAt(0))) | 0;
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
