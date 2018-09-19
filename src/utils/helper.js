import { Decimal } from './decimal.js';

const unitPriceTable = {
    "BTC": [
        [Number.MAX_SAFE_INTEGER, '0.00000001'],
    ],
    "ETH": [ 
        [Number.MAX_SAFE_INTEGER, '0.00000001'],
    ],
    "CT": [ 
        [Number.MAX_SAFE_INTEGER, '0.01'],
    ],
    "KRW": [
        [10, '0.01'],
        [100, '0.1'], 
        [1000, '1'],
        [10000, '5'], 
        [100000, '10'], 
        [500000, '50'],
        [1000000, '100'], 
        [2000000, '500'],
        [Number.MAX_SAFE_INTEGER, '1000']
    ]
}

const KOREAN_WON = '원';

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

class Helper {
    static getUnitPrice(price_string, baseSymbol){
        const price_decimal = Decimal(price_string);
        for (let maxPriceAndUnit of unitPriceTable[baseSymbol]) {
            const maxPriceOfTheRange_decimal = Decimal(maxPriceAndUnit[0]);
            if (price_decimal < maxPriceOfTheRange_decimal) {
                const unit_string = maxPriceAndUnit[1];
                return unit_string;
            }
        }
        const unit_string = unitPriceTable[baseSymbol][0][1];
        return unit_string;
    }
    
    static getFixedPrice(price_string, baseSymbol){
        let price_decimal = Decimal(price_string);
        if (baseSymbol === "KRW") {
            if (price_decimal < 10) {
                price_decimal = price_decimal.toFixed(2);
            } else if (price_decimal < 100){
                price_decimal = price_decimal.toFixed(1);
            } else {
                price_decimal = price_decimal.toFixed(0);
            }
            return price_decimal.toString();
        } else if (baseSymbol === "CT"){
            price_decimal = price_decimal.toFixed(2);
            return price_decimal.toString();
        } else {
            price_decimal = price_decimal.toFixed(8);
            return price_decimal.toString();
        }
    }

    static getFixedVolume(volume_string) {
        let maximumFractionDigits = 4; 
        return this.getNumberWithoutComma(volume_string, 4);
        
    }
    
    /*
     * 숫자(number_string)에서 
     * 최대로 보여줄 소수점 자리(maximumFractionDigits)를 지정하여 이를 반환합니다.
     * 예시) 
     * getFixed('123.4567', 2) => '123.45'
     * getFixed('123.4567', 0) => '123'
     * getFixed('12,123.4', 3) => '12,123.400'
     */
    static getFixed(number_string, maximumFractionDigits){
        if (maximumFractionDigits === undefined) {
            return number_string;
        }
        let value_decimal = Decimal(value_string);
        value_decimal = value_decimal.toFixed(maximumFractionDigits);
        return value_decimal.toString();
    }

    /*
     * 숫자(number_string)에서 정수 부분에 세자리 단위로 comma를 추가합니다.
     * 최대로 보여줄 소수점 자리(maximumFractionDigits)를 지정할 수 있습니다.
     * 예시) 
     * getNumberWithCommaOnEveryThreeDigit('1231234.4567', 2) => '1,231,234.45'
     * getNumberWithCommaOnEveryThreeDigit('-121234.4567', 0) => '-121,234'
     */
    static getNumberWithCommaOnEveryThreeDigit(number_string, maximumFractionDigits) {
        let minus = false;
        if (number_string[0] === '-') {
            number_string = number_string.slice(1);
            minus = true;
        }
        let fixedNumber_string = this.get_fixed(number_string, maximumFractionDigits);
        let [ digit, decimal = '' ] = fixedNumber_string.split('.');
        let digitWithComma = digit.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let numberWithComma_string = digitWithComma + (decimal ? `.${decimal}` : '');
        return (minus ? '-' : '') + numberWithComma_string;
    }

    /*
     * 숫자(number_string)에서 comma를 제거합니다.
     * string인 number에 comma를 추가한 상태에서 Decimal로 다시 처리하고자할때 사용합니다.
     * 예시) 
     * getFixed('123,123.4567', 2) => '123123.45'
     * getFixed('12,123.4567', 0) => '12123'
     */
    static getNumberWithoutComma(number_string, maximumFractionDigits) {
        let numberWithoutComma_string = number_string.split(',').join('');
        numberWithoutComma_string = this.get_fixed(numberWithoutComma_string, maximumFractionDigits);
        return numberWithoutComma_string;
    }

    /*
     * 원하는 unit(원, KRW, 비트코인)을 숫자 뒤에 붙이고자 할 때 사용합니다.
     * 숫자와 unit 사이에 띄어쓰기 여부도 argument로 결정 가능합니다.
     * 예시) 
     * getNumberWithUnit('123,123.45', 'KRW', true) => '123,123.45 KRW'
     * getNumberWithUnit('12,123', '달러', false) => '12,123달러'
     */
    static getNumberWithUnit(number_string, unit = KOREAN_WON, withSpace = true) {
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
    static getNumberWithKoreanWon(number_string, withSpace= true) {
        return this.getNumberWithUnit(number_string, KOREAN_WON, withSpace = true);
    }
    
    /*
     * 소수점 뒤에 붙는 무의미한 0들을 제거하는데 사용됩니다.
     * 예시) 
     * getNumberWithKoreanWon('123,123.45000') => '123,123.45'
     * getNumberWithKoreanWon('12,123.3010300') => '12,123.30103'
     */
    static removeTrailingZeros(number_string) {
        if (typeof number_string !== 'string') return number_string;

        let [ digit, decimal = '' ] = number_string.split('.');
        let targetIndex = decimal.length - 1;
        if (decimal !== '') {
            while (0 <= targetIndex) {
                if (decimal[targetIndex] !== '0') {
                    break
                } else { targetIndex -= 1 }
            }
        }
        decimal = decimal.slice(0, targetIndex + 1);
        return digit + ( decimal ? '.' + decimal : '');
    }
}

export default Helper;