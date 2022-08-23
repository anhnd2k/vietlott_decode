import {Component} from 'react';
import * as encoding from 'text-encoding';
import IDataStream2 from './IDataStream2';
import TicketInfo from './TicketInfo';

interface Props {}

class ValidateTicketInfo extends Component<Props> {
  encodedData: Uint8Array = new Uint8Array();
  constructor(props: Props) {
    super(props);
    const value =
      'AoLI+Bk4J1CgARgnCid0IAQAqAAAABgnAQpkDYCAAJAAAgCAEIogAAMKgAABQgAIAwgACEQAAwo=';
    // eslint-disable-next-line no-undef
    const endcoder = new encoding.TextEncoder();
    this.encodedData = endcoder.encode(value);
    this.state = {};
    console.log('===>>>> encodedData', this.encodedData);
  }

  displayBetDetails() {
    if (this.encodedData.length > 0) {
      if (this.encodedData[0] === 49 && this.encodedData.length === 17) {
        // to do
        let t: number[] = IDataStream2.asciiHex(
          this.encodedData.toString().substring(1, 17),
        );
        // const bcDatax: number[] = new Array<number>(9);
        const bcDatax: Uint8Array = new Uint8Array(9);
        bcDatax[0] = 1;
        for (let i = 1; i < 9; i++) {
          bcDatax[i] = t[i - 1];
        }
        const ticketInfo: TicketInfo = new TicketInfo({b: bcDatax});
        ticketInfo.toDisplay();
        // ValidateTicketInfo.this.ticketDataPanel.remove(ValidateTicketInfo.this.displayedTicketData);
        // ValidateTicketInfo.this.displayedTicketData = ticketInfox.toDisplay();
      } else if (this.encodedData[0] === 65) {
        // to do
        const ticketInfo: TicketInfo = new TicketInfo({b: this.encodedData});
        // ValidateTicketInfo.this.ticketDataPanel.remove(
        //   ValidateTicketInfo.this.displayedTicketData,
        // );
        if (ticketInfo.invalid) {
          console.log('Mã vạch không hợp lệ');
        } else {
          ticketInfo.toDisplay();
          // ValidateTicketInfo.this.displayedTicketData = ticketInfo.toDisplay();
        }
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
