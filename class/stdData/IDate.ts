import {Component} from 'react';

interface Props {
  date?: number;
  day?: number;
  month?: number;
  year?: number;
}

class IDate extends Component<Props> {
  constructor(props: Props) {
    super(props);
    // init
  }
}

export default IDate;
