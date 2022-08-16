import {Component} from 'react';

interface Props {
  str: string;
}

class ILanguage extends Component<Props> {
  sbuf: string[] = [];
  constructor(props: Props) {
    super(props);
    this.sbuf.push(props.str);
  }

  length() {
    let length: number = 0;
    // if () { //thailan language
    //     for(let i = 0; i < this.sbuf.length; ++i) {
    //         let type = getImageType(this.sbuf.charAt(i));
    //         if (type != 0 && type != 2) {
    //             ++length;
    //         }
    //     }
    // } else {
    //     length = this.sbuf.length;
    // }
    length = this.sbuf.length;

    return length;
  }
}

export default ILanguage;
