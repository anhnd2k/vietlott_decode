import {Component} from 'react';
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

  
}

export default TicketInfoDetails;
