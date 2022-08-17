import {Component} from 'react';
import TSN from './hostinterface/TSN';
import IDataInputByteArray from './IDataInputByteArray';
import IDataStream2 from './IDataStream2';

interface Props {
  b: number[];
}

class TicketInfo extends Component<Props> {
  tsnOnly: boolean = false;
  bcType: number = 0;
  invalid: boolean = false;
  tsn: TSN | undefined;
  ticketInfoVersion: number = 0;
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  TicketInfoFun = (b: number[]) => {
    let t: number[];
    if (b.length === 9) {
      try {
        const IN = new IDataInputByteArray({b});
        this.tsnOnly = true;
        this.bcType = IN.readByteValue();
        if (this.bcType !== 1) {
          this.invalid = true;
        }
        const t = new Array(8);
        IN.readBytesInt(t, 0, t.length);
        this.tsn = new TSN({data: t, packed: true});
      } catch (error) {
        this.invalid = true;
      }
    } else {
      try {
        const IN = new IDataInputByteArray({
          b: IDataStream2.special_ascii6Bit_to_binary8Bit(b),
        });
        this.bcType = IN.readByteValue();
        t = [0, 0, 0, 0, 0, 0, 0, 0]; //t = new byte[8];
        IN.readBytesInt(t, 0, t.length);
        this.tsn = new TSN({data: t, packed: true});
        this.ticketInfoVersion = IN.readByteValue();
        if (this.ticketInfoVersion !== 1) {
          this.invalid = true;
        }
        // this.date
      } catch (error) {}
    }
  };
}

export default TicketInfo;
