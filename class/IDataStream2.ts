import {Component} from 'react';

interface Props {}

class IDataStream2 extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  asciiHex(s: string): number[] {
    const ascii2Hex = (c1: any, c2: any): number => {
      let b1: number;
      if (c1 >= 'A' && c1 <= 'F') {
        b1 = c1 - 65 + 10;
      } else {
        b1 = c1 - 48;
      }

      let b2: number;
      if (c2 >= 'A' && c2 <= 'F') {
        b2 = c2 - 65 + 10;
      } else {
        b2 = c2 - 48;
      }

      let b: number = b1 << 4;
      b += b2;
      return b;
    };

    const len = s.length / 2;
    const t: number[] = [];
    for (let i = 0; i < len; i++) {
      t[i] = ascii2Hex(s.charAt(i * 2), s.charAt(i * 2 + 1));
    }
    return t;
  }

  special_ascii6Bit_to_binary8Bit(s: number[]) {
    Base64 base64Decoder = new Base64();
    byte[] t = base64Decoder.decode(s);
    return t;
}
}

export default IDataStream2;
