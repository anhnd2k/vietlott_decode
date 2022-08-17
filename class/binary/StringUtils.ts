import {Component} from 'react';

interface Props {}

class StringUtils extends Component<Props> {
  static local: StringUtils;
  constructor(props: Props) {
    super(props);
    StringUtils.local = this;
  }

  public static getBytesIso8859_1(string: string): number[] {
    return StringUtils.local.getBytesUnchecked(string, 'ISO-8859-1');
  }

  public static getBytesUsAscii(string: string): number[] {
    return StringUtils.local.getBytesUnchecked(string, 'US-ASCII');
  }

  public static getBytesUtf16(string: string): number[] {
    return StringUtils.local.getBytesUnchecked(string, 'UTF-16');
  }

  public static getBytesUtf16Be(string: string): number[] {
    return StringUtils.local.getBytesUnchecked(string, 'UTF-16BE');
  }

  public static getBytesUtf16Le(string: string): number[] {
    return StringUtils.local.getBytesUnchecked(string, 'UTF-16LE');
  }

  public static getBytesUtf8(string: string): number[] {
    return StringUtils.local.getBytesUnchecked(string, 'UTF-8');
  }

  getBytesUnchecked = (string: string, charsetName: string): number[] => {
    if (string == null) {
      return null;
    } else {
      try {
        return /* getBytes */ string.split('').map(s => s.charCodeAt(0));
        // return string.getBytes(charsetName);
      } catch (var3) {
        throw StringUtils.newIllegalStateException(charsetName, var3);
      }
    }
  };
  static newIllegalStateException(_charsetName: string, _var3: unknown) {
    throw new Error('Method not implemented.');
  }

  public static newString(bytes: number[], charsetName: string): string {
    if (bytes == null) {
      return null;
    } else {
      try {
        return String.fromCharCode.apply(null, bytes);
      } catch (var3) {
        throw StringUtils.newIllegalStateException(charsetName, var3);
      }
    }
  }

  public static newStringIso8859_1(bytes: number[]): string {
    return StringUtils.newString(bytes, 'ISO-8859-1');
  }

  public static newStringUsAscii(bytes: number[]): string {
    return StringUtils.newString(bytes, 'US-ASCII');
  }

  public static newStringUtf16(bytes: number[]): string {
    return StringUtils.newString(bytes, 'UTF-16');
  }

  public static newStringUtf16Be(bytes: number[]): string {
    return StringUtils.newString(bytes, 'UTF-16BE');
  }

  public static newStringUtf16Le(bytes: number[]): string {
    return StringUtils.newString(bytes, 'UTF-16LE');
  }

  public static newStringUtf8(bytes: number[]): string {
    return StringUtils.newString(bytes, 'UTF-8');
  }
}

export default StringUtils;
