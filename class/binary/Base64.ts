import {Component} from 'react';
import StringUtils from './StringUtils';
import {intToByte} from '../modal';

interface Props {
  urlSafe?: boolean;
  lineLength?: number;
  lineSeparator?: number[];
}

class Base64 extends Component<Props> {
  DEFAULT_BUFFER_RESIZE_FACTOR = 2;
  DEFAULT_BUFFER_SIZE = 8192;
  CHUNK_SIZE = 76;
  CHUNK_SEPARATOR = [13, 10];
  STANDARD_ENCODE_TABLE = [
    65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
    84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
    107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
    122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47,
  ];
  URL_SAFE_ENCODE_TABLE = [
    65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
    84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
    107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
    122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 45, 95,
  ];
  PAD = 61;
  DECODE_TABLE = [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, 62, -1, 62, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63, -1,
    26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
    45, 46, 47, 48, 49, 50, 51,
  ];
  MASK_6BITS = 63;
  MASK_8BITS = 255;
  encodeTable: number[] = [];
  lineLength: number = 0;
  lineSeparator: number[] = [];
  decodeSize: number = 0;
  encodeSize: number = 0;
  buffer: number[] = [];
  pos: number = 0;
  readPos: number = 0;
  currentLinePos: number = 0;
  modulus: number = 0;
  eof: boolean = false;
  x: number = 0;
  constructor(props: Props) {
    super(props);
    // init
    if (
      props.urlSafe !== undefined &&
      props.lineLength &&
      props.lineSeparator
    ) {
      if (props.lineSeparator == null) {
        props.lineLength = 0;
        props.lineSeparator = this.CHUNK_SEPARATOR;
      }

      this.lineLength = props.lineLength > 0 ? (props.lineLength / 4) * 4 : 0;
      this.lineSeparator = new Array(props.lineSeparator.length);
      const newArrLineSeparator = [...props.lineSeparator];
      this.lineSeparator = newArrLineSeparator;
      // System.arraycopy(props.lineSeparator, 0, this.lineSeparator, 0, props.lineSeparator.length);
      if (props.lineLength > 0) {
        this.encodeSize = 4 + props.lineSeparator.length;
      } else {
        this.encodeSize = 4;
      }

      this.decodeSize = this.encodeSize - 1;
      if (this.containsBase64Byte(props.lineSeparator)) {
        const sep: string = StringUtils.newStringUtf8(props.lineSeparator);
        console.log(
          'lineSeperator must not contain base64 characters: [' + sep + ']',
        );
      } else {
        this.encodeTable = props.urlSafe
          ? this.URL_SAFE_ENCODE_TABLE
          : this.STANDARD_ENCODE_TABLE;
      }
    }
    this.state = {};
  }

  containsBase64Byte(arrayOctet: number[]) {
    for (let i = 0; i < arrayOctet.length; i++) {
      if (this.isBase64(arrayOctet[i])) {
        return true;
      }
    }

    return false;
  }

  isBase64(octet: number) {
    return (
      octet === 61 ||
      (octet >= 0 &&
        octet < this.DECODE_TABLE.length &&
        this.DECODE_TABLE[octet] != -1)
    );
  }

  decode_byte(pArray: Uint8Array): Uint8Array {
    this.reset();
    if (pArray != null && pArray.length !== 0) {
      // const len = (long)(pArray.length * 3 / 4);
      const len: number = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
        <number>(((pArray.length * 3) / 4) | 0),
      );
      // byte[] buf = new byte[(int)len];
      const buf: number[] = (s => {
        let a = [];
        while (s-- > 0) {
          a.push(0);
        }
        return a;
      })((<number>len) | 0);
      this.setInitialBuffer(buf, 0, buf.length);
      this.decode(pArray, 0, pArray.length);
      this.decode(pArray, 0, -1);
      // byte[] result = new byte[this.pos];
      const result: number[] = (s => {
        let a = [];
        while (s-- > 0) {
          a.push(0);
        }
        return a;
      })(this.pos);
      this.readResults(result, 0, result.length);
      console.log('===>>> result', result);
      return result;
    } else {
      return pArray;
    }
  }

  setInitialBuffer(out: number[], outPos: number, outAvail: number) {
    if (out != null && out.length == outAvail) {
      this.buffer = out;
      this.pos = outPos;
      this.readPos = outPos;
    }
  }

  readResults(b: number[], bPos: number, bAvail: number) {
    if (this.buffer != null) {
      const len: number = Math.min(this.avail(), bAvail);
      if (this.buffer !== b) {
        // System.arraycopy(this.buffer, this.readPos, b, bPos, len);
        ((srcPts, srcOff, dstPts, dstOff, size) => {
          if (srcPts !== dstPts || dstOff.length >= srcOff + size) {
            //add .length
            while (--size >= 0) {
              dstPts[dstOff++] = srcPts[srcOff++];
            }
          } else {
            let tmp = srcPts.slice(srcOff, srcOff + size);
            for (let i = 0; i < size; i++) {
              dstPts[dstOff++] = tmp[i];
            }
          }
        })(this.buffer, this.readPos, b, bPos, len);

        this.readPos += len;
        if (this.readPos >= this.pos) {
          this.buffer = null;
        }
      } else {
        this.buffer = null;
      }

      return len;
    } else {
      return this.eof ? -1 : 0;
    }
  }

  avail(): number {
    return this.buffer != null ? this.pos - this.readPos : 0;
  }

  reset() {
    this.buffer = null;
    this.pos = 0;
    this.readPos = 0;
    this.currentLinePos = 0;
    this.modulus = 0;
    this.eof = false;
  }

  decode(_in: Uint8Array, _inPos: number, _inAvail: number) {
    if (!this.eof) {
      if (_inAvail < 0) {
        this.eof = true;
      }

      for (let i = 0; i < _inAvail; i++) {
        if (
          this.buffer == null ||
          this.buffer.length - this.pos < this.decodeSize
        ) {
          this.resizeBuffer();
        }

        const b: number = _in[_inPos++];
        if (b === 61) {
          this.eof = true;
          break;
        }

        if (b >= 0 && b < this.DECODE_TABLE.length) {
          const result: number = this.DECODE_TABLE[b];
          if (result >= 0) {
            this.modulus = ++this.modulus % 4;
            this.x = (this.x << 6) + result;
            if (this.modulus === 0) {
              this.buffer[this.pos++] = intToByte(
                (<number>((this.x >> 16) & 255)) | 0,
              );
              this.buffer[this.pos++] = intToByte(
                (<number>((this.x >> 8) & 255)) | 0,
              );
              this.buffer[this.pos++] = intToByte((<number>(this.x & 255)) | 0);
            }
          }
        }
      }

      if (this.eof && this.modulus !== 0) {
        this.x <<= 6;
        switch (this.modulus) {
          case 2:
            this.x <<= 6;
            this.buffer[this.pos++] = intToByte(((this.x >> 16) & 255) | 0);
            break;
          case 3:
            this.buffer[this.pos++] = intToByte(((this.x >> 16) & 255) | 0);
            this.buffer[this.pos++] = intToByte(((this.x >> 8) & 255) | 0);
        }
      }
    }
  }

  resizeBuffer() {
    if (this.buffer == null) {
      // this.buffer = new byte[8192];
      this.buffer = (s => {
        let a = [];
        while (s-- > 0) {
          a.push(0);
        }
        return a;
      })(8192);
      this.pos = 0;
      this.readPos = 0;
    } else {
      // byte[] b = new byte[this.buffer.length * 2];
      // System.arraycopy(this.buffer, 0, b, 0, this.buffer.length);
      // this.buffer = b;
      const b: number[] = (s => {
        let a = [];
        while (s-- > 0) {
          a.push(0);
        }
        return a;
      })(this.buffer.length * 2);
      /* arraycopy */ ((srcPts, srcOff, dstPts, dstOff, size) => {
        if (srcPts !== dstPts || dstOff >= srcOff + size) {
          while (--size >= 0) {
            dstPts[dstOff++] = srcPts[srcOff++];
          }
        } else {
          let tmp = srcPts.slice(srcOff, srcOff + size);
          for (let i = 0; i < size; i++) {
            dstPts[dstOff++] = tmp[i];
          }
        }
      })(this.buffer, 0, b, 0, this.buffer.length);
      this.buffer = b;
    }
  }
}

export default Base64;
