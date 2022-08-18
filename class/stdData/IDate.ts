import dayjs from 'dayjs';
import {Component} from 'react';

interface Props {
  date?: number;
  day?: number;
  month?: number;
  year?: number;
}

class IDate extends Component<Props> {
  value: Date;
  static local: IDate;
  constructor(props: Props) {
    super(props);
    IDate.local = this;
    // init
    if (props.date) {
      const {date} = props;
      const day: number = date & 31;
      const month: number = (date >> 5) & 15;
      let year: number = date >> 9 && 127;
      if (year > 80) {
        year += 1900;
      } else {
        year += 2000;
      }
      this.value = new Date();
      this.value.setFullYear(year);
      this.value.setMonth(month - 1);
      this.value.setDate(day);
    } else if (props.year && props.month && props.day) {
      let {year, month, day} = props;
      if (year > 80) {
        year += 1900;
      } else {
        year += 2000;
      }
      this.value = new Date(year, month - 1, day);
    } else {
      this.value = new Date();
    }
  }

  addDays(days: number) {
    // this.value.add(5, days);
    this.value?.setDate(days);
  }

  getDay() {
    return this.value?.getDay();
  }

  //   public int getDayOfWeek() {
  //     return this.value.get(7);
  // }

  getGregorianValue(): Date {
    return this.value;
  }

  getMonth(): number {
    return this.value.getMonth();
  }

  getYear(): number {
    return this.value.getFullYear();
  }

  getValue(): number {
    const day: number = this.value.getDate();
    const month: number = this.value.getMonth() + 1;
    const year = this.value.getFullYear() % 100;
    return day + (month << 5) + (year << 9);
  }

  setSystemDate() {}

  static toString(): string {
    return IDate.local.toString(true);
  }

  toString(showYear: boolean): string {
    const dateFormat = showYear
      ? dayjs(this.value.getTime()).format('dd/MM/yy')
      : dayjs(this.value.getTime()).format('dd-MMM');
    return dateFormat;
  }

  toStringYear(): string {
    return dayjs(this.value.getTime()).format('yy');
  }

  toStringRaw(): string {
    return dayjs(this.value.getTime()).format('yyMMdd');
  }

  toStringFormat(): string {
    return dayjs(this.value.getTime()).format('dd/MM/yy');
  }
}

export default IDate;
