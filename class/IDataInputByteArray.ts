import {Component} from 'react';

interface Props {
  b: number[];
}

class IDataInputByteArray extends Component<Props> {
  dataInput: number[] = [];
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
      console.log('==>>>> err in line 57 file IDataInputByteArray.ts');
    }
    return b;
  }
}

export default IDataInputByteArray;
