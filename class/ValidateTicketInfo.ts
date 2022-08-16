import {Component} from 'react';
import * as encoding from 'text-encoding';
import IDataStream2 from './IDataStream2';

interface Props {}

class ValidateTicketInfo extends Component<Props> {
  encodedData = new Uint8Array();
  constructor(props: Props) {
    super(props);
    const value = 'AgqETWoiweYCASohMxUIEggAGAAAACshAQZkCICAFAQABBAAAA==';
    // eslint-disable-next-line no-undef
    const endcoder = new encoding.TextEncoder();
    this.encodedData = endcoder.encode(value);
    this.state = {};
  }

  displayBetDetails() {
    if (this.encodedData.length > 0) {
      if (this.encodedData[0] === 49 && this.encodedData.length === 17) {
        // to do
        const idataStream2 = new IDataStream2({});
        let t: number[] = idataStream2.asciiHex(
          this.encodedData.toString().substring(1, 17),
        );
        const bcDatax: number[] = [];
        bcDatax[0] = 1;
        for (let i = 1; i < 9; i++) {
          bcDatax[i] = t[i - 1];
        }
        // TicketInfo ticketInfox = new TicketInfo(bcDatax);
        // ValidateTicketInfo.this.ticketDataPanel.remove(ValidateTicketInfo.this.displayedTicketData);
        // ValidateTicketInfo.this.displayedTicketData = ticketInfox.toDisplay();
      } else if (this.encodedData[0] === 65) {
        // to do
      } else if (this.encodedData[0] === 97) {
        console.log(
          'Mã vạch không hợp lệ, vui lòng kiểm tra phím CapsLock và quét lại vé',
        );
      } else {
        console.log('Mã vạch không hợp lệ');
      }
    } else {
      console.log('Không tìm thấy mã vạch');
    }
  }
}

export default ValidateTicketInfo;