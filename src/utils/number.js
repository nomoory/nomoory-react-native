import { Decimal } from './decimal.js';

const MAX_SAFE_INTEGER = 9007199254740991;
const unitPriceTable = {
    "BTC": [
        [MAX_SAFE_INTEGER, '0.00000001'],
    ],
    "ETH": [
        [MAX_SAFE_INTEGER, '0.00000001'],
    ],
    "CT": [
        [MAX_SAFE_INTEGER, '0.01'],
    ],
    "KRW": [
        [10, '0.1'],
        [100, '0.5'],
        [1000, '1'],
        [10000, '5'],
        [100000, '10'],
        [500000, '50'],
        [1000000, '100'],
        [2000000, '500'],
        [MAX_SAFE_INTEGER, '1000']
    ]
}

const KOREAN_NUMBER_BY_NAME = {
    '만': 10000,
    '백만': 1000000,
    '억': 100000000,
    '조': 1000000000000,
    '경': 10000000000000000
};

const KOREAN_WON = '원';

const TRILLION = 1000000000000;
const BILLION = 1000000000;
const MILLION = 1000000;

const THOUSAND_BILLION = 1000000000000; // 조
const HUNDRED_MILLION = 100000000; // 억
const TEN_THOUSAND = 10000; // 만

/*
 * 1) 모든 method는 숫자를 string 형태로 받으며,
 * 숫자를 return 해야하는 경우, string으로 변환하여 return 합니다.
 * 
 * 2) 너무 길어 생략하고자 하는 경우(abc...) 
 * 웹은 css의 elipse를, 
 * 앱의 경우엔 <Text numberOfLines={1}></Text>를 사용합니다.
 * 
 * 3) string과 decimal을 구분하기위해 post_fix로 _type을 붙였습니다.
 */

class NumberHelper {
    constructor() {
        this.Decimal = Decimal;
    }

    isEmptyValue(value_string) {
        return !value_string || value_string === '';
    }

    getUnitPrice(price_string, symbol) {
        let result_string = '0.00000001'
        if (!price_string) return result_string;

        const price_decimal = this.Decimal(price_string);
        let index = 0;
        for (let maxPriceAndUnit of unitPriceTable[symbol]) {
            const maxPriceOfTheRange_decimal = this.Decimal(maxPriceAndUnit[0]);
            if (price_decimal.lessThan(maxPriceOfTheRange_decimal)) {
                const unit_string = maxPriceAndUnit[1];
                return unit_string;
            }
            if (index === unitPriceTable[symbol].length - 1) {
                if (price_decimal.greaterThanOrEqualTo(maxPriceOfTheRange_decimal)) {
                    const unit_string = maxPriceAndUnit[1];
                    return unit_string;    
                }
            }
            index += 1;
        }
        result_string = unitPriceTable[symbol][0][1];
        return result_string;
    }

    getFixedPrice(price_string, baseSymbol) {
        let result_string = '';
        if (!price_string) return result_string;

        let price_decimal = this.Decimal(price_string);
        if (baseSymbol === "KRW") {
            if (price_decimal.lessThan(100)) {
                result_string = Decimal(price_decimal.toFixed(2)).toFixed();
            } else {
                result_string = price_decimal.toFixed(0);
            }
        } else if (baseSymbol === "CT") {
            if (price_decimal.lessThan(100)) {
                result_string = Decimal(price_decimal.toFixed(2)).toFixed();
            } else {
                result_string = price_decimal.toFixed(0);
            }
        } else {
            result_string = Decimal(price_decimal.toFixed(8)).toFixed();
        }
        return result_string;
    }

    getFixedVolume(volume_string, symbol) {
        let result_string = '';
        if (!volume_string) return result_string;

        let volume_decimal = this.Decimal(volume_string);
        if (symbol === "KRW") {
            result_string = volume_decimal.toFixed(0);
        } else {
            result_string = Decimal(volume_decimal.toFixed(8)).toFixed();
        }

        return result_string;
    }

    getRateAsFiexdPercentage(value_string, maximumFractionDigits) {
        let result_string = '';
        if (!value_string) return result_string;

        result_string = this.Decimal(value_string).times(100).toFixed(maximumFractionDigits);
        return result_string;
    }

    /*
     * 숫자(number_string)에서 
     * 최대로 보여줄 소수점 자리(maximumFractionDigits)를 지정하여 이를 반환합니다.
     * 예시) 
     * getFixed('123.4567', 2) => '123.45'
     * getFixed('123.4567', 0) => '123'
     * getFixed('12123.4', 3) => '12123.400'
     */
    getFixed(number_string, maximumFractionDigits) {
        let result_string = '';
        if (!number_string) return result_string;
        let number_decimal = this.Decimal(number_string);
        if (!maximumFractionDigits && maximumFractionDigits !== 0) {
            return number_decimal.toFixed();
        }
        return number_decimal.toFixed(maximumFractionDigits);
    }

    /*
     * 숫자(number_string)에서 정수 부분에 세자리 단위로 comma를 추가합니다.
     * 최대로 보여줄 소수점 자리(maximumFractionDigits)를 지정할 수 있습니다.
     * 예시) 
     * putComma('1231234.4567', 2) => '1,231,234.45'
     * putComma('-121234.4567', 0) => '-121,234'
     */
    putComma(number_string, maximumFractionDigits) {
        if (typeof number_string === "number") number_string = '' + number_string;
        let result_string = '';
        if (!number_string) return result_string;
        let hasPoint = number_string.split('').findIndex((character) => character === '.') !== -1;
        let minus = false;
        if (parseInt(number_string) < 0) {
            number_string = number_string.slice(1);
            minus = true;
        }
        let [digit, decimal = ''] = 
            maximumFractionDigits ? 
            this.getFixed(number_string, maximumFractionDigits).split('.') :
            number_string.split('.');

        let digitWithComma = digit.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        result_string = `${minus ? '-' : ''}${digitWithComma}${hasPoint ? '.' + decimal : ''}`;
        return result_string;
    }

    /*
     * 숫자(number_string)에서 comma를 제거합니다.
     * string인 number에 comma를 추가한 상태에서 Decimal로 다시 처리하고자할때 사용합니다.
     * 예시) 
     * getFixed('123,123.4567', 2) => '123123.45'
     * getFixed('12,123.4567', 0) => '12123'
     */
    pullComma(number_string, maximumFractionDigits) {
        let numberWithoutComma_string = number_string.split(',').join('');
        numberWithoutComma_string = this.getFixed(numberWithoutComma_string, maximumFractionDigits);
        return numberWithoutComma_string;
    }

    /*
     * 원하는 unit(원, KRW, 비트코인)을 숫자 뒤에 붙이고자 할 때 사용합니다.
     * 숫자와 unit 사이에 띄어쓰기 여부도 argument로 결정 가능합니다.
     * 예시) 
     * getNumberWithUnit('123,123.45', 'KRW', true) => '123,123.45 KRW'
     * getNumberWithUnit('12,123', '달러', false) => '12,123달러'
     */
    getNumberWithUnit(number_string, unit = KOREAN_WON, withSpace = true) {
        let space = withSpace ? ' ' : '';
        return `${number_string}${space}${unit}`;
    }

    /*
     * 한국 '원'을 유닛으로 붙이고자 할 때 사용합니다. 
     * 자주 사용하는 유닛은 아래와 같이 constant와 method를 추가하시면 됩니다.
     * 예시) 
     * getNumberWithKoreanWon('123,123.45', true) => '123,123.45 원'
     * getNumberWithKoreanWon('12,123', false) => '12,123원'
     */
    getNumberWithKoreanWon(number_string, withSpace = true) {
        return this.getNumberWithUnit(number_string, KOREAN_WON, withSpace = true);
    }

    /*
     * 소수점 뒤에 붙는 무의미한 0들을 제거하는데 사용됩니다.
     * 예시) 
     * getNumberWithKoreanWon('123,123.45000') => '123,123.45'
     * getNumberWithKoreanWon('12,123.3010300') => '12,123.30103'
     */
    /*removeTrailingZeros(number_string = '') {
      let result_string = '';
      if (!number_string) return result_string;
  
      let [digit, decimal = ''] = number_string.split('.');
      let decimalArray = decimal.split('');
      let index = decimalArray.length - 1; 
      while (index < 0) {
        if (decimalArray[index] === '0') {
          decimalArray.pop();
        } else {
          break;
        }
      }
      decimal = decimalArray.length ? decimalArray.join('') : '';
      result_string = digit + (decimal ? '.' + decimal : '');
      return result_string;
    }*/
    removeTrailingZeros(str) {
        str = str ? str : '';
        let [prime, decimal] = str.split('.');
        let reversed_char_arr = null;
        if (decimal) {
            reversed_char_arr = decimal.split("").reverse();
            let find = false;
            reversed_char_arr = reversed_char_arr.map((x) => {
                if (x !== '0') {
                    find = true;
                }
                if (x == '.') {

                }
                if (find) {
                    return x;
                }
                return "";
            });
            return prime + '.' + reversed_char_arr.reverse().join("");
        } else {
            return prime;
        }
    }

    /*
     * 숫자를 받아 함수가 표현 가능한 가장 큰 단위를 숫자와 단위로 리턴합니다..
     * 예시) 
     * getNumberAndPowerOfTenFromNumber('2312345000') => {number: '2312', type: 'million'}
     * getNumberAndPowerOfTenFromNumber('2312345000000') => {number: '231', type: 'billion'}
     */
    getNumberAndPowerOfTenFromNumber(number_string) {
        let result = {
            number: '',
            type: '',
        };
        if (!number_string) return result;

        let number_decimal = this.Decimal(number_string);
        if (number_decimal.greaterThanOrEqualTo(TRILLION)) {
            result.number = number_decimal.div(TRILLION).toPrecision(5);
            result.type = 'trillion';
        } else if (number_decimal.greaterThanOrEqualTo(BILLION)) {
            result.number = number_decimal.div(BILLION).toPrecision(5);
            result.type = 'billion';
        } else if (number_decimal.greaterThanOrEqualTo(MILLION)) {
            result.number = number_decimal.div(MILLION).toPrecision(5);
            result.type = 'million';
        } else {
            result.number = number_decimal.toPrecision(4);
            result.type = '';
        }
        return result;
    }

    getNumberAndPowerOfTenFromNumber_kr(number_string) {
        let result = {
            number: '',
            type: '',
        };
        if (!number_string) return result;

        let number_decimal = this.Decimal(number_string);
        if (number_decimal.greaterThanOrEqualTo(TRILLION)) {
            result.number = number_decimal.div(TRILLION).toPrecision(4);
            result.type = 'trillion';
        } else if (number_decimal.greaterThanOrEqualTo(HUNDRED_MILLION)) {
            result.number = number_decimal.div(HUNDRED_MILLION).toPrecision(4);
            result.type = 'HUNDRED_MILLION';
        } else if (number_decimal.greaterThanOrEqualTo(TEN_THOUSAND)) {
            result.number = number_decimal.div(TEN_THOUSAND).toPrecision(4);
            result.type = 'TEN_THOUSAND';
        } else {
            result.number = number_decimal.toPrecision(4);
            result.type = '';
        }
        return result;
    }

    minimum(numA, numB) {
        if (!numA || !numB) return 0;
        return this.Decimal(numA).greaterThan(numB) ? numB : numA;
    }

    maximum(numA, numB) {
        if (!numA || !numB) return 0;
        return this.Decimal(numA).greaterThan(numB) ? numA : numB;
    }
}

const numberHelper = new NumberHelper();
export default numberHelper;