import {Component} from 'react';
import DigitPerm from './app/digitfunctions/DigitPerm';
import IDataInputByteArray from './IDataInputByteArray';
import {intToByte} from './modal';
import IAmount from './stdData/IAmount';
import IDataStream from './stdData/IDataStream';
import TicketInfo from './TicketInfo';
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
          if ((this.value[amount] & spotCnt) === spotCnt) {
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
      if ((this.type & 32) !== 0) {
        console.log(
          '==>>>> Hệ thống: ',
          true,
          ' ',
          this.picksPerPanel.toString(),
        );
      }
      if ((this.type & 64) !== 0) {
        console.log('==>>>> Cuôn: ', true, ' ', this.picksPerPanel.toString());
      }
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
        }
        // mã số vé (t)
        console.log('==(format = 4)>>>> t', t);
        // TC check box
        console.log(
          '==(format = 4)>>>> TC <check box>',
          (this.type & -128) !== 0,
        );
        // SPOTS
        if (spotCnt <= 10) {
          console.log(
            '==(format = 4)>>>> SPOTS',
            IDataStream.padString(spotCnt.toString(), 2, ' ', false),
          );
        } else {
          console.log(
            '==(format = 4)>>>> SPOTS',
            IDataStream.padString(' ', 2, ' ', false),
          );
        }
        const quantity_toString = new IAmount({
          value: (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
            <number>((amount * this.unitBetCost) | 0),
          ),
        });
        const quantityFormat = quantity_toString.toString();
        const result_quantity = IDataStream.padString(
          quantityFormat,
          9,
          ' ',
          false,
        );
        // Số lượng
        console.log('==(format = 4)>>>> SỐ LƯỢNG: ', result_quantity);
      } else {
        let numString: string;
        let _in: IDataInputByteArray;
        // format = 2
        if (this.format === 2) {
          _in = new IDataInputByteArray({b: this.value});
          // df = new DecimalFormat("0000"); format
          spotCnt = _in.readWord();
          numString = '';
          if ((this.type & 2) !== 0) {
            numString =
              '*' + (<string> new String(spotCnt.toString())).substring(1);
            const data_1 = IDataStream.padString(
              numString,
              this.picksPerPanel,
              '0',
              false,
            );
            console.log('==(format = 2)>>>> data_1 ', data_1);
          } else if ((this.type & 4) !== 0) {
            numString =
              (<string> new String(spotCnt.toString())).substring(1) + '*';
            const data_1 = IDataStream.padString(
              numString,
              this.picksPerPanel,
              '0',
              false,
            );
            console.log('==(format = 2)>>>> data_1 ', data_1);
          } else {
            const data_1 = IDataStream.padString(
              spotCnt.toString(),
              this.picksPerPanel,
              '0',
              false,
            );
            console.log('==(format = 2)>>>> data_1 ', data_1);
          }
          //TC
          console.log(
            '==(format = 2)>>>> TC <check box>',
            (this.type & 128) !== 0,
          );
          console.log(
            '==(format = 2)>>>> TỔ HỢP <check box>',
            (this.type & 16) !== 0,
          );
          console.log(
            '==(format = 2)>>>> Cuộn 1 <check box>',
            (this.type & 2) !== 0,
          );
          console.log(
            '==(format = 2)>>>> Cuộn 4 <check box>',
            (this.type & 4) !== 0,
          );
          console.log(
            '==(format = 2)>>>> BAO <check box>',
            (this.type & 8) !== 0,
          );
          nbrPerm = 1;
          if ((this.type & 2) !== 0 || (this.type & 4) !== 0) {
            nbrPerm = 10;
          }
          if ((this.type & 8) !== 0 || (this.type & 16) !== 0) {
            const digitPerm: DigitPerm = new DigitPerm({});
            digitPerm.libCalcPerms(spotCnt, 4);
            nbrPerm = digitPerm.getNbrPermutation();
          }
          console.log('==(format = 2)>>>> X', nbrPerm.toString());
          j = _in.readByteValue() & 255;
          if ((this.type & 16) !== 0) {
            const quantity_toString = new IAmount({
              value: (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
                <number>((j * this.unitBetCost) | 0),
              ),
            });
            const quantityFormat = quantity_toString.toString();
            // panel.add(TicketInfo.createLabeledField("SỐ LƯỢNG", IDataStream.padString((new IAmount((long)(j * this.unitBetCost * nbrPerm))).toString(false, false, true), 15, ' ', false)));
            const result_quantity = IDataStream.padString(
              quantityFormat,
              15,
              ' ',
              false,
            );
            console.log('==(format = 2)>>>> SỐ LƯỢNG: ', result_quantity);
          } else {
            // panel.add(TicketInfo.createLabeledField("SỐ LƯỢNG", IDataStream.padString((new IAmount((long)(j * this.unitBetCost * nbrPerm))).toString(false, false, true), 15, ' ', false)));
            const quantity_toString = new IAmount({
              value: (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
                <number>((j * this.unitBetCost * nbrPerm) | 0),
              ),
            });
            const quantityFormat = quantity_toString.toString();
            const result_quantity = IDataStream.padString(
              quantityFormat,
              15,
              ' ',
              false,
            );
            console.log('==(format = 2)>>>> SỐ LƯỢNG: ', result_quantity);
          }
        } else {
          let selections2: number;
          let nbrPerm: number;
          // this.format = 5
          if (this.format === 5) {
            _in = new IDataInputByteArray({b: this.value});
            spotCnt = _in.readWord();
            const selections = _in.readWord();
            mask = _in.readWord();
            spaces = '';
            if (spotCnt === 2) {
              const firstSel = IDataStream.padString(
                selections.toString(),
                this.picksPerPanel,
                '0',
                false,
              );
              const secondSel = IDataStream.padString(
                mask.toString(),
                this.picksPerPanel,
                '0',
                false,
              );
              console.log(
                '==(format = 5)>>>> data_265',
                firstSel + ' ' + secondSel,
              );
              //TC
              console.log('==(format = 5)>>>> TC', (this.type & 128) !== 0);
              //3D+
              console.log('==(format = 5)>>>> 3D+', true);
            } else {
              console.log(
                '==(format = 5)>>>> data_274',
                IDataStream.padString(
                  selections.toString(),
                  this.picksPerPanel,
                  '0',
                  false,
                ),
              );
              console.log(
                '==(format = 5)>>>> TC <checkBox>',
                (this.type & 128) !== 0,
              );
            }
            selections2 = 1;
            if (spotCnt !== 2) {
              //X
              console.log('==(format = 5)>>>> X', selections2.toString());
            }
            nbrPerm = _in.readByteValue() & 255;
            const quantity_toString = new IAmount({
              value: (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
                <number>((nbrPerm * this.unitBetCost * selections2) | 0),
              ),
            });
            const quantityFormat = quantity_toString.toString();
            const result_quantity = IDataStream.padString(
              quantityFormat,
              15,
              ' ',
              false,
            );
            console.log('==(format = 5)>>>> SỐ LƯỢNG: ', result_quantity);
          }
          // format = 6
          else if (this.format === 6) {
            _in = new IDataInputByteArray({b: this.value});
            spotCnt = _in.readWord();
            numString = '';
            let displayNumString: string = '';
            let selections2: number;
            nbrPerm = 1;
            let nbrPerm2: boolean = true;
            let amount: number;
            let selections: number;
            if ((this.type & 4) === 0) {
              selections = _in.readWord();
              selections2 = _in.readWord();
              const firstSel = IDataStream.padString(
                selections.toString(),
                this.picksPerPanel,
                '0',
                false,
              );
              const secondSel = IDataStream.padString(
                selections2.toString(),
                this.picksPerPanel,
                '0',
                false,
              );
              console.log(
                '==(format = 6)>>>> data_321',
                firstSel + ' ' + secondSel,
              );
              //TC
              console.log('==(format = 6)>>>> TC', (this.type & 128) != 0);
              //3D PRO
              console.log('==(format = 6)>>>> 3D PRO', true);
              //BAO
              console.log('==(format = 6)>>>> BAO', (this.type & 2) !== 0);
              nbrPerm = 1;
              nbrPerm2 = true;
              if ((this.type & 2) != 0) {
                // DigitPerm digitPerm = new DigitPerm();
                // digitPerm.libCalcPerms(selections, 3);
                // nbrPerm = digitPerm.getNbrPermutation();
                // digitPerm = new DigitPerm();
                // digitPerm.libCalcPerms(selections2, 3);
                // nbrPerm *= digitPerm.getNbrPermutation();
              }
            } else {
              for (amount = 0; amount < spotCnt; ++amount) {
                selections = _in.readWord();
                // numString = df.format((long)selections);
                const dumyData: any = (n =>
                  n < 0 ? Math.ceil(n) : Math.floor(n))(<number>selections);
                numString = dumyData; // format
                if (amount === 10) {
                  displayNumString = displayNumString.concat('\n');
                }
                displayNumString = displayNumString.concat(numString + ' ');
              }
              if (spotCnt > 10) {
                console.log('==>>> createTextMultiLineField', displayNumString);
              } else {
                console.log('==>>>> createTextField', displayNumString);
              }
              console.log('==(format = 6)>> TC', (this.type & 128) !== 0);
              console.log('==(format = 6)>> Multi', (this.type & 4) !== 0);
            }
            if ((this.type & 4) !== 0) {
              nbrPerm = this.getMultiCombination(spotCnt);
              console.log('==(format = 6)>> X', nbrPerm.toString());
            }
            if ((this.type & 2) !== 0) {
              console.log('==(format = 6)>> X', nbrPerm.toString());
            }
            amount = _in.readByteValue() & 255;
            // panel.add(TicketInfo.createLabeledField("SỐ LƯỢNG", IDataStream.padString((new IAmount((long)(amount * this.unitBetCost * nbrPerm))).toString(false, false, true), 15, ' ', false)));
            const quantity_toString = new IAmount({
              value: (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
                <number>((amount * this.unitBetCost * nbrPerm) | 0),
              ),
            });
            const quantityFormat = quantity_toString.toString();
            const result_quantity = IDataStream.padString(
              quantityFormat,
              15,
              ' ',
              false,
            );
            console.log('==(format = 6)>>>> SỐ LƯỢNG: ', result_quantity);
          } else if (this.format === 3) {
            _in = new IDataInputByteArray({b: this.value});
            amount = _in.readLongWord();
            console.log(
              '==(format = 3)>>>> data_374',
              IDataStream.padString(
                '' +
                  (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(<number>amount),
                this.picksPerPanel,
                '0',
                false,
              ),
            );
            //TC
            console.log(
              '==(format = 3)>>> TC <checkBox>',
              (this.type & 128) !== 0,
            );
            spotCnt = _in.readByteValue() & 255;
            // panel.add(TicketInfo.createLabeledField("SỐ LƯỢNG", IDataStream.padString((new IAmount((long)(spotCnt * this.unitBetCost))).toString(), 9, ' ', false)));
            const quantity_toString = new IAmount({
              value: (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(
                <number>((spotCnt * this.unitBetCost) | 0),
              ),
            });
            const quantityFormat = quantity_toString.toString();
            const result_quantity = IDataStream.padString(
              quantityFormat,
              9,
              ' ',
              false,
            );
            console.log('==(format = 3)>>>> SỐ LƯỢNG: ', result_quantity);
          }
        }
      }
    }
  }

  getMultiCombination(numOfSelections: number) {
    let comb: number;
    switch (numOfSelections) {
      case 3:
        comb = 6;
        break;
      case 4:
        comb = 12;
        break;
      case 5:
        comb = 20;
        break;
      case 6:
        comb = 30;
        break;
      case 7:
        comb = 42;
        break;
      case 8:
        comb = 56;
        break;
      case 9:
        comb = 72;
        break;
      case 10:
        comb = 90;
        break;
      case 11:
        comb = 110;
        break;
      case 12:
        comb = 132;
        break;
      case 13:
        comb = 156;
        break;
      case 14:
        comb = 182;
        break;
      case 15:
        comb = 210;
        break;
      case 16:
        comb = 240;
        break;
      case 17:
        comb = 272;
        break;
      case 18:
        comb = 306;
        break;
      case 19:
        comb = 342;
        break;
      case 20:
        comb = 380;
        break;
      default:
        comb = 1;
    }

    return comb;
  }
}

export default TicketInfoDetails;
