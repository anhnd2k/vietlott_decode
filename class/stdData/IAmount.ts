import {Component} from 'react';

interface Props {
  value: number;
}

class IAmount extends Component<Props> {
  value: number;
  constructor(props: Props) {
    super(props);
    const {value} = props;
    if (typeof value === 'number' || value === null) {
      this.value = value;
    } else if (value === undefined) {
      this.value = 0;
    } else {
      throw new Error('invalid overload');
    }
  }

  add(amount: IAmount): void {
    this.value += amount.value;
  }

  clear(): void {
    this.value = 0;
  }

  copy(v: IAmount): void {
    this.value = v.value;
  }

  divide(divisor: number): void {
    this.value /= divisor;
  }

  getValue(): number {
    return this.value;
  }

  multiply(value: number): void {
    this.value *= value;
  }

  subtract(val: number) {
    this.value -= val;
  }

  toString(): string {
    // return this.toString(false, true, true);
    return '';
  }

  //   toStringFunc(showSymbol: boolean, showCents: boolean, showCommas: boolean): string {
  //     const sbuf = '';
  //     let tempValue: number = this.value;
  //     if (this.value < 0) {
  //         tempValue = this.value * -1;
  //     }

  //     new DecimalFormatSymbols(IString.getCurrentLocale());
  //     NumberFormat numberFormat = NumberFormat.getCurrencyInstance(IString.getCurrentLocale());
  //     Locale selectedLocale = IString.getLocale();
  //     if (showSymbol) {
  //         sbuf.append("VND");
  //     }

  //     DecimalFormat amountFormat;
  //     if (showCommas) {
  //         amountFormat = new DecimalFormat("###,###,###,###,##0");
  //     } else {
  //         amountFormat = new DecimalFormat("##############0");
  //     }

  //     if (showCents) {
  //         sbuf.append(amountFormat.format(tempValue / 100L));
  //         sbuf.append(".");
  //         DecimalFormat centsFormat = new DecimalFormat("00");
  //         sbuf.append(centsFormat.format(tempValue % 100L));
  //     } else {
  //         sbuf.append(amountFormat.format(tempValue));
  //     }

  //     return sbuf.toString();
  // }
}

export default IAmount;
