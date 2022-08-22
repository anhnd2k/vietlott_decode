import {Component} from 'react';
import {intToByte} from './modal';
import IDataStream from './stdData/IDataStream';
interface Props {
  panelNumber: number;
  unitBetCost: number;
  type: number;
  picksPerPanel: number;
  format: number;
  value: number[];
}

class TicketInfoDetails extends Component<Props> {
  public static LOTTO_SELECTION_BITMAP: number = 1;
  public static FOUR_DIGIT_SELECTION: number = 2;
  public static DIGIT_SELECTION: number = 3;
  public static KENO_SELECTION: number = 4;
  public static THREE_DIGIT_SELECTION: number = 5;
  public static THREE_DIGIT_PRO_SELECTION: number = 6;
  private panelNumber: number;
  private type: number;
  private value: number[];
  private format: number;
  private picksPerPanel: number;
  private unitBetCost: number;

  constructor(props: Props) {
    super(props);
    const {panelNumber, unitBetCost, type, picksPerPanel, format, value} =
      props;
    this.panelNumber = panelNumber;
    this.unitBetCost = unitBetCost;
    this.type = type;
    this.picksPerPanel = picksPerPanel;
    this.format = format;
    this.value = value;
  }

  getType(): number {
    return this.type;
  }

  setValue(value: number[]): void {
    this.value = value;
  }

  getValue(): number[] {
    return this.value;
  }

  toDisplay() {
    let t: string;
    let amount: number;
    let spotCnt: number;
    let i: number;
    let nbrPerm: number;
    if (this.format === 1) {
      t = '';
      for (amount = 0; amount < 8; ++amount) {
        spotCnt = 1;
        for (i = 0; i < 8; ++i) {
          if ((this.value[amount] & spotCnt) == spotCnt) {
            nbrPerm = amount * 8 + i;
            t =
              t +
              ' ' +
              IDataStream.padString(nbrPerm.toString(), 2, ' ', false);
          }
          spotCnt = intToByte((<number>(spotCnt << 1)) | 0);
        }
      }
      // mã số vé (t)
      console.log('==>>>> t', t);
      // TC check box
      console.log('==>>>> TC <check box>', (this.type & -128) !== 0);
      // if ((this.type & 32) != 0) {
      //   panel.add(TicketInfo.createCheckBox('Hệ Thống', true));
      //   panel.add(
      //     TicketInfo.createTextField(Integer.toString(this.picksPerPanel)),
      //   );
      // }

      // if ((this.type & 64) != 0) {
      //   panel.add(TicketInfo.createCheckBox('Cuôn', true));
      //   panel.add(
      //     TicketInfo.createTextField(Integer.toString(this.picksPerPanel)),
      //   );
      // }
    } else {
      let j: number;
      let mask: number;
      let spaces: string;
      if (this.format === 4) {
        t = '';
        amount = this.value[11] & 255;
        spotCnt = intToByte((<number>(this.value[12] & 255)) | 0);
        let n: number;
        if (spotCnt === 11) {
          t = 'LỚN';
        } else if (spotCnt === 12) {
          t = 'NHỎ';
        } else if (spotCnt === 13) {
          t = 'CHẴN';
        } else if (spotCnt === 14) {
          t = 'LẺ';
        } else if (spotCnt === 15) {
          t = 'Hòa (Lớn-Nhỏ)';
        } else if (spotCnt === 16) {
          t = 'Hòa (Chẵn-Lẻ)';
        } else if (spotCnt === 17) {
          t = 'Chẵn (11-12)';
        } else if (spotCnt === 18) {
          t = 'Lẻ (11-12)';
        } else {
          for (i = 0; i < 11; ++i) {
            mask = 1;

            for (j = 0; j < 8; ++j) {
              if ((this.value[i] & mask) == mask) {
                n = i * 8 + j;
                t =
                  t + ' ' + IDataStream.padString(n.toString(), 2, ' ', false);
              }

              mask = intToByte((<number>(mask << 1)) | 0);
            }
          }
        }
        i = t.length;
        nbrPerm = 30 - t.length;
        spaces = '';
        if (i < 30) {
          nbrPerm = 30 - t.length;

          for (n = 0; n < nbrPerm; ++n) {
            spaces = spaces + ' ';
          }

          t = t + spaces;
          nbrPerm = 30 - t.length;
          spaces = '';
          if (i < 30) {
            nbrPerm = 30 - t.length;

            for (n = 0; n < nbrPerm; ++n) {
              spaces = spaces + ' ';
            }

            t = t + spaces;
          }
          // mã số vé (t)
          console.log('==>>>> t', t);
          // TC check box
          console.log('==>>>> TC <check box>', (this.type & -128) !== 0);
          // SPOTS
          if (spotCnt <= 10) {
            console.log(
              '==>>>> SPOTS',
              IDataStream.padString(spotCnt.toString(), 2, ' ', false),
            );
          } else {
            console.log(
              '==>>>> SPOTS',
              IDataStream.padString(' ', 2, ' ', false),
            );
          }
          // Số lượng
          console.log('==>>>> SỐ LƯỢNG: ________peding_________');
        } else {
          // to do
        }
      }
    }
  }
}

export default TicketInfoDetails;
