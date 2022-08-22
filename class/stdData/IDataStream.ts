import {Component} from 'react';
import ILanguage from './ILanguage';
import {intToByte} from '../modal';
interface Props {}

class IDataStream extends Component<Props> {
  static local: IDataStream;
  constructor(props: Props) {
    super(props);
    this.state = {};
    IDataStream.local = this;
  }

  static hex2Ascii(d: number) {
    let c: string[] = [' '];
    if (d < 10) {
      c[0] = String.fromCharCode(d + 48);
    } else {
      c[0] = String.fromCharCode(d - 10 + 65);
    }

    return c.toString();
  }

  static hex2Ascii2(d: number) {
    let c: string[] = [''];
    if (d < 10) {
      c[0] = String.fromCharCode(d + 48);
    } else {
      c[0] = String.fromCharCode(d - 10 + 65);
    }

    return c.toString();
  }

  static toHexString2(b: number): string {
    let t: string =
      // eslint-disable-next-line no-bitwise
      this.hex2Ascii((((b & 240) >> 4) & 15) | 0) +
      // eslint-disable-next-line no-bitwise
      this.hex2Ascii2((3 & 15) | 0);
    return this.padString(t, 2, '0', false);
  }

  // static toHexString(b: number[]) {
  //   return IDataStream.local.toHexString(b);
  // }
  static toHexString_TypeInputNumber(s: number): string {
    const t: string =
      this.hex2Ascii(
        intToByte((<number>(((s & '\uf000'.charCodeAt(0)) >> 12) & 15)) | 0),
      ) +
      this.hex2Ascii(intToByte((<number>(((s & 3840) >> 8) & 15)) | 0)) +
      this.hex2Ascii(intToByte(<number>(((s & 240) >> 4) & 15)) | 0) +
      this.hex2Ascii(intToByte((<number>(s & 15)) | 0));
    return this.padString(t, 4, '0', false);
  }

  static toHexString = (b: number[]): string => {
    let s: string[] = [];
    for (let i = 0; i < b.length; i++) {
      s.push(this.padString(this.toHexString2(b[i]), 2, '0', false) + ' ');
    }
    return s.toString();
  };

  static padString(t: string, n: number, c: string, right: boolean) {
    let len = new ILanguage({str: t}).length();
    if (len > n) {
      t = t.substring(0, n);
    } else if (len < n) {
      let fill = n - len;

      for (let i = 0; i < fill; ++i) {
        if (right) {
          t = t + c;
        } else {
          t = c + t;
        }
      }
    }

    return t;
  }

  static toDelimitedHexString(b: number[], d: number, c: string): string {
    //StringBuffer s = new StringBuffer();
    let s = '';
    let pointer: number = 0;
    const spacing: number = b.length / d;
    if (spacing !== 0) {
      for (let i = 0; i < spacing; i++) {
        for (let j = 0; j < d; j++) {
          const t: string = this.hex2Ascii(b[pointer]);
          s = s.concat(t.toUpperCase());
          ++pointer;
        }

        if (i < spacing - 1) {
          s = s.concat(c);
        }
      }
    }
    return s;
  }
}

export default IDataStream;
