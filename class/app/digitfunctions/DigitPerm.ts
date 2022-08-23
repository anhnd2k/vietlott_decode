import {Component} from 'react';

interface Props {}

class DigitPerm extends Component<Props> {
  swapTable!: Array<any>;
  permutate!: Array<any>;
  nbr: number = 0;
  permSize: number = 1;

  constructor(props: Props) {
    super(props);
  }

  libCalcPerms(digitNumber: number, factorNum: number) {
    let divisor: number = 1;
    // Vector digits = new Vector(10);
    const digits: Array<any> = <any>[];
    let j: number;
    for (j = 0; j < 10; ++j) {
      // digits.addElement("0");
      digits.push('0') > 0;
    }

    let quotient: number;
    let numbers: string;
    for (j = 0; j < factorNum; digitNumber /= 10) {
      quotient = Math.floor(digitNumber) % 10;
      numbers = digits[quotient].toString();
      numbers = parseInt(numbers).toString();
      // digits.setElementAt(numbers, quotient);
      digits[quotient] = numbers;
      ++j;
    }

    let digitSelection: string = '';
    numbers = '0';
    // Enumeration e = digits.elements();
    const e: any = /* elements */ (a => {
      var i = 0;
      return {
        nextElement: function () {
          return i < a.length ? a[i++] : null;
        },
        hasMoreElements: function () {
          return i < a.length;
        },
      };
    })(digits);

    while (e.hasMoreElements()) {
      digitSelection = e.nextElement().toString();
      if (!(digitSelection === numbers)) {
        divisor *= this.libFactorial(parseInt(digitSelection));
      }
    }

    quotient = this.libFactorial(factorNum);
    this.nbr = quotient / divisor;
  }

  libFactorial(number: number) {
    let product: number;
    for (product = 1; number !== 0; --number) {
      product *= number;
    }

    return product;
  }

  getNbrPermutation() {
    return this.nbr;
  }
}

export default DigitPerm;
