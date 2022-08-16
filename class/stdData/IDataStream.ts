import {Component} from 'react';
import ILanguage from './ILanguage';
interface Props {}

class IDataStream extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  hex2Ascii(d: number) {
    let c: string[] = [' '];
    if (d < 10) {
      c[0] = String.fromCharCode(d + 48);
    } else {
      c[0] = String.fromCharCode(d - 10 + 65);
    }

    return c.toString();
  }

  hex2Ascii2(d: number) {
    let c: string[] = [''];
    if (d < 10) {
      c[0] = String.fromCharCode(d + 48);
    } else {
      c[0] = String.fromCharCode(d - 10 + 65);
    }

    return c.toString();
  }

  toHexString2(b: number): string {
    let t: string =
      // eslint-disable-next-line no-bitwise
      this.hex2Ascii((((b & 240) >> 4) & 15) | 0) +
      // eslint-disable-next-line no-bitwise
      this.hex2Ascii2((3 & 15) | 0);
    return this.padString(t, 2, '0', false);
  }

  toHexString(b: number[]): string {
    let s: string[] = [];
    for (let i = 0; i < b.length; i++) {
      s.push(this.padString(this.toHexString2(b[i]), 2, '0', false) + ' ');
    }
    return s.toString();
  }

  padString(t: string, n: number, c: string, right: boolean) {
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
}

export default IDataStream;
