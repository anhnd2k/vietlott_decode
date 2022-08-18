import dayjs from 'dayjs';
import {Component} from 'react';

interface Props {
  time: number;
}

class ITime extends Component<Props> {
  static local: ITime;
  private COLON: string = ':';
  private hours: number = 0;
  private minutes: number = 0;
  private seconds: number = 0;
  constructor(props: Props) {
    super(props);
    ITime.local = this;
    const {time} = props;
    if (time) {
      this.hours = time / 100;
      this.minutes = time % 100;
      this.seconds = 0;
    } else {
      const time: Date = new Date();
      this.hours = time.getHours();
      this.minutes = time.getMinutes();
      this.seconds = time.getSeconds();
    }
  }

  getHours(): number {
    return this.hours;
  }

  getMinutes(): number {
    return this.minutes;
  }

  getSeconds(): number {
    return this.seconds;
  }

  getValue(): number {
    return this.hours * 100 + this.minutes;
  }

  //   setSystemTime(): void{
  //       if()
  //   }

  incHours(increment: boolean): void {
    if (increment) {
      this.hours += this.hours < 23 ? 1 : 0;
    } else {
      this.hours -= this.hours > 0 ? 1 : 0;
    }
  }

  incMinutes(increment: boolean, adjustHours: boolean) {
    if (increment) {
      if (this.minutes < 59) {
        ++this.minutes;
      } else if (this.hours < 23 && adjustHours) {
        ++this.hours;
        this.minutes = 0;
      }
    } else if (this.minutes > 0) {
      --this.minutes;
    } else if (this.hours > 0 && adjustHours) {
      --this.hours;
      this.minutes = 59;
    }
  }

  static difference(t1: ITime, t2: ITime): ITime {
    let hours: number = t1.hours - t2.hours;
    let minutes: number = t1.minutes - t2.minutes;
    if (minutes < 0) {
      --hours;
      minutes = t1.minutes + 60 - t2.minutes;
    }

    if (hours < 0) {
      hours += 24;
    }

    return new ITime({time: hours * 100 + minutes});
  }

  copy(t: ITime) {
    this.hours = t.hours;
    this.minutes = t.minutes;
    this.seconds = t.seconds;
  }

  static toString() {
    return ITime.local.toString(false);
  }

  toString(showSeconds: boolean) {
    const df = (
      data: string | number | Date | dayjs.Dayjs | null | undefined,
    ) => {
      return dayjs(data).format('00');
    };

    return (
      df(this.hours) +
      ':' +
      df(this.minutes) +
      (showSeconds ? ':' + df(this.seconds) : '')
    );
  }

  toStringRaw(): string {
    const df = (
      data: string | number | Date | dayjs.Dayjs | null | undefined,
    ) => {
      return dayjs(data).format('00');
    };
    return df(this.hours) + df(this.minutes) + df(this.seconds);
  }
}

export default ITime;
