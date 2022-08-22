import {Component} from 'react';
import TSN from './hostinterface/TSN';
import IDataInputByteArray from './IDataInputByteArray';
import IDataStream2 from './IDataStream2';
import IDate from './stdData/IDate';
import ITime from './stdData/ITime';
import {intToByte, toShort} from './modal';
import TicketInfoDetails from './TicketInfoDetails';
import IDataStream from './stdData/IDataStream';

interface Props {
  tsn?: TSN;
  time?: ITime;
  hwid?: number;
  gameBitmap?: number;
  drawByteValue?: number;
  validPanels?: number;
  picksPerPanel?: number;
  permutation?: boolean;
  unitBetCost?: number;
  valueSize?: number;
  ticketInfoPanels?: Array<any>;
  b?: Uint8Array;
}

class TicketInfo extends Component<Props> {
  public bcType: number = 0;
  public ticketInfoVersion: number = 0;
  public date!: IDate;
  public time!: ITime;
  public hwid: number = 0;
  public tsn!: TSN;
  public gameBitmap: number = 0;
  public drawID: number = 0;
  public drawDate!: IDate;
  public invalid: boolean | undefined;
  public tsnOnly: boolean | undefined;
  private format: number = 0;
  public drawByteValue: number = 0;
  public validPanels: number = 0;
  public picksPerPanel: number = 0;
  public permutation: boolean | undefined;
  public unitBetCost: number = 0;
  public valueSize: number = 0;
  public ticketInfoPanels!: Array<any>;
  constructor(props: Props) {
    super(props);
    const {
      tsn,
      time,
      hwid,
      gameBitmap,
      drawByteValue,
      validPanels,
      picksPerPanel,
      permutation,
      unitBetCost,
      valueSize,
      ticketInfoPanels,
      b,
    } = props;
    if (
      tsn &&
      time &&
      hwid &&
      gameBitmap &&
      drawByteValue &&
      validPanels &&
      picksPerPanel &&
      permutation &&
      unitBetCost &&
      valueSize &&
      ticketInfoPanels
    ) {
      this.ticketInfoVersion = 1;
      // this.date = HostData.HOST_DATA.getDate();
      this.tsn = tsn;
      this.time = time;
      this.hwid = hwid;
      this.gameBitmap = gameBitmap;
      // this.drawID = drawNumber.getID();
      // this.drawDate = drawNumber.getDate();
      this.drawByteValue = drawByteValue;
      this.validPanels = validPanels;
      this.picksPerPanel = picksPerPanel;
      this.permutation = permutation;
      this.unitBetCost = unitBetCost;
      this.valueSize = valueSize;
      this.ticketInfoPanels = ticketInfoPanels;
    } else if (b) {
      let t: number[];
      if (b.length === 9) {
        try {
          const IN = new IDataInputByteArray({b: b});
          this.tsnOnly = true;
          this.bcType = IN.readByteValue();
          if (this.bcType !== 1) {
            this.invalid = true;
          }
          t = [0, 0, 0, 0, 0, 0, 0, 0]; //t = new byte[8];
          //IN.readBytesInt(t, 0, t.length)
          t = IN.readBytesInt(t, 0, t.length).newArr;
          this.tsn = new TSN({data: t, packed: true});
        } catch (error) {
          this.invalid = true;
        }
      } else {
        try {
          const b1 = new IDataStream2({}).special_ascii6Bit_to_binary8Bit(b);
          const IN = new IDataInputByteArray({
            b: b1,
          });
          this.bcType = IN.readByteValue();
          t = [0, 0, 0, 0, 0, 0, 0, 0]; //t = new byte[8];
          //IN.readBytesInt(t, 0, t.length)
          t = IN.readBytesInt(t, 0, t.length).newArr;
          this.tsn = new TSN({data: t, packed: true});
          this.ticketInfoVersion = IN.readByteValue();
          if (this.ticketInfoVersion !== 1) {
            this.invalid = true;
          }
          this.date = new IDate({date: IN.readWord()});
          const temp1: number = IN.readWord();
          this.time = new ITime({time: temp1 & 4095});
          this.validPanels = intToByte((<number>((temp1 >> 12) & 15)) | 0);
          console.log('==>> validPanels', this.validPanels);

          this.hwid = IN.readWord();
          this.gameBitmap = IN.readWord();
          this.drawID = IN.readLongWord();
          this.drawDate = new IDate({date: IN.readWord()});
          this.drawByteValue = IN.readByteValue();
          const temp: number = IN.readByteValue();
          this.picksPerPanel = intToByte((<number>(temp & 127)) | 0);
          this.permutation = false;
          if ((temp & 128) !== 0) {
            this.permutation = true;
          }
          this.unitBetCost = toShort((<number>(IN.readByteValue() * 100)) | 0);
          console.log('==>> unitBetCost', this.unitBetCost);

          this.valueSize = IN.readByteValue();
          this.format = 0;
          if (this.gameBitmap === 8 || this.gameBitmap === 32) {
            this.format = 1;
          } else if (this.gameBitmap === 1024) {
            this.format = 2;
          } else if (this.gameBitmap === 512) {
            this.format = 5;
          } else if (this.gameBitmap === 4) {
            this.format = 4;
          } else if (this.gameBitmap === 2048) {
            this.format = 6;
          }
          // this.ticketInfoPanels = new Vector();
          this.ticketInfoPanels = <any>[];

          console.log('==>> validPanels', this.validPanels);
          console.log('==>> valueSize', this.valueSize);

          for (let i: number = 0; i < this.validPanels; i++) {
            const pickType: number = IN.readByteValue();
            let s: number[] = new Array(this.valueSize);
            s = IN.readBytesInt(s, 0, this.valueSize).newArr;
            const d: TicketInfoDetails = new TicketInfoDetails({
              panelNumber: i,
              unitBetCost: this.unitBetCost,
              type: pickType,
              picksPerPanel: this.picksPerPanel,
              format: this.format,
              value: s,
            });
            // console.log('===>>>>> TicketInfoDetails', d);
            this.ticketInfoPanels.push(d);
          }
        } catch (error) {
          this.invalid = true;
        }
      }
    }
  }

  // gom và hiển thị dữ liệu
  toDisplay() {
    const tsn_getdata = this.tsn.getData();
    const showTSN_value = IDataStream.toDelimitedHexString(tsn_getdata, 4, '-'); //0A84-4D6A-22C1-E602 - string
    console.log('==>>>> showTSN_value', showTSN_value);
    if (this.tsnOnly) {
      console.log('==>> return when tsnOnly false');
      return;
    } else {
      // Ngày
      const Date_value = this.date.toString(true); //10/09/16
      console.log('==>>>> Date_value', Date_value);
      // Giờ
      const time_value = this.time.toString(false); //13:31
      console.log('==>>>> time_value', time_value);
      //HWID
      const HWID_value = IDataStream.toHexString_TypeInputNumber(this.hwid); // 4616
      console.log('==>>>> HWID_value', HWID_value);
      // Mã kỳ QSMT
      let drawID_value: string = ''; // 24/16
      if (this.gameBitmap === 4) {
        drawID_value =
          IDataStream.padString(this.drawID.toString(), 7, '0', false) +
          '/' +
          IDataStream.padString(
            (this.drawDate?.getYear() % 1000).toString(),
            2,
            '0',
            false,
          );
      } else {
        drawID_value =
          IDataStream.padString(this.drawID.toString(), 5, '0', false) +
          '/' +
          IDataStream.padString(
            (this.drawDate?.getYear() % 1000).toString(),
            2,
            '0',
            false,
          );
      }
      console.log('==>>>> drawID_value', drawID_value);
      // Ngày QSMT
      const drawDate_value = this.drawDate.toString(true); //11/09/16
      console.log('==>>>> drawDate_value', drawDate_value);
      // Enumeration e = this.ticketInfoPanels.elements();
      const e: any = /* elements */ (a => {
        var i = 0;
        return {
          nextElement: function (): TicketInfoDetails {
            return i < a.length ? a[i++] : null;
          },
          hasMoreElements: function () {
            return i < a.length;
          },
        };
      })(this.ticketInfoPanels);
      while (e.hasMoreElements()) {
        const d: TicketInfoDetails = e.nextElement();
        d.toDisplay();
        // panels.add(d.toDisplay());
      }
    }
  }
}

export default TicketInfo;
