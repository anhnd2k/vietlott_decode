import {Component} from 'react';

interface Props {
  str: string;
}

class ILanguage extends Component<Props> {
  sbuf: string;
  constructor(props: Props) {
    super(props);
    this.sbuf = props.str;
  }

  length() {
    let length: number = 0;
    /* Checking if the language is Thai. If it is, it will loop through the string and check if the
    character is Thai. If it is, it will add 1 to the length. If it is not, it will not add 1 to the
    length. */
    //   if (IString.getLocale().getLanguage().equals("th")) {
    //     for(int i = 0; i < this.sbuf.length(); ++i) {
    //         int type = getImageType(this.sbuf.charAt(i));
    //         if (type != 0 && type != 2) {
    //             ++length;
    //         }
    //     }
    // } else {
    //     length = this.sbuf.length();
    // }
    length = this.sbuf.length;

    return length;
  }
}

export default ILanguage;
