import { Decimal } from './decimal.js';

export { Decimal };
export const DECIMAL_POINT_OF_KRW = 3;
export const DECIMAL_POINT_OF_TOKEN = 8;

// 미화
export const TRILLION = 1000000000000; // 조
export const BILLION = 1000000000; // 10억
export const MILLION = 1000000; // 100만

// 한화
export const HUNDRED_MILLION = 100000000; // 억
export const TEN_THOUSAND = 10000; // 만

const MAX_SAFE_INTEGER = 9007199254740991;
const UNIT_PRICE_TABLE = {
    "DEFAULT": [
        [MAX_SAFE_INTEGER, '0.00000001'],
    ],
    "BTC": [
        [MAX_SAFE_INTEGER, '0.00000001'],
    ],
    "ETH": [
        [MAX_SAFE_INTEGER, '0.00000001'],
    ],
    "CT": [
        [10, '0.01'],
        [100, '0.1'],
        [1000, '1'],
        [10000, '5'],
        [100000, '10'],
        [500000, '50'],
        [1000000, '100'],
        [2000000, '500'],
        [MAX_SAFE_INTEGER, '1000']
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
        [MAX_SAFE_INTEGER, '1000']
    ],
    // by trading pair
    "KRWb_KRW": [
        [10, '0.001'],
        [100, '0.1'],
        [1000, '1'],
        [10000, '5'],
        [100000, '10'],
        [500000, '50'],
        [1000000, '100'],
        [2000000, '500'],
        [MAX_SAFE_INTEGER, '1000']
    ],
    'DEAL_KRW': [
        [10, '0.1'],
        [100, '0.5'],
        [500, '1'],
        [1000, '5'],
        [5000, '10'],
        [10000, '100'],
        [100000, '250'],
        [500000, '250'],
        [1000000, '100'],
        [2000000, '500'],
        [MAX_SAFE_INTEGER, '1000']
    ],
    'CCT_KRW': [
        [20, '0.1'],
        [100, '1'],
        [500, '5'],
        [1000, '10'],
        [10000, '10'],
        [100000, '10'],
        [500000, '10'],
        [1000000, '10'],
        [2000000, '10'],
        [MAX_SAFE_INTEGER, '1000']
    ]
}

const getUnitPriceTable = (baseSymbol, quoteSymbol) => {
    let selectedUnitPriceTable =
        UNIT_PRICE_TABLE[`${baseSymbol}_${quoteSymbol}`] ||
        UNIT_PRICE_TABLE[quoteSymbol] ||
        UNIT_PRICE_TABLE['DEFAULT'];
    return selectedUnitPriceTable;
};


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

export const getUnitPrice = (price_string, quoteSymbol, baseSymbol) => {
    let unitPrice_string = '0.00000001';
    let selectedUnitPriceTable = getUnitPriceTable(baseSymbol, quoteSymbol);
    if (price_string) {
        let price_decimal = Decimal(price_string);
        for (let maxPriceAndUnit of selectedUnitPriceTable) {
            let maxPriceOfTheRange_decimal = Decimal(maxPriceAndUnit[0]);
            if (price_decimal.lessThan(maxPriceOfTheRange_decimal)) {
                let unit_string = maxPriceAndUnit[1];
                return unit_string;
            }
        }
    }
    unitPrice_string = selectedUnitPriceTable[selectedUnitPriceTable.length - 1][1];
    return unitPrice_string;
};

export const getPriceInUnit = (price_string, quoteSymbol, baseSymbol) => {
    if (price_string === '') return '';
    let unitPrice = getUnitPrice(price_string, quoteSymbol, baseSymbol);
    let price_decimal = Decimal(price_string);
    let remainder_decimal = price_decimal.modulo(unitPrice || '0');
    let quotient_decimal = price_decimal.minus(remainder_decimal);
    return quotient_decimal.toFixed();
};

export const max = (numA, numB) => {
    return Decimal(numA).greaterThan(numB) ? numA : numB;
};

export const min = (numA, numB) => {
    return Decimal(numA).greaterThan(numB) ? numB : numA;
};

// 특정 소수자리수로 변환하며, 기본적으로 불필요한 소수점 자리의 0을 지웁니다.
export const getFixed = (value, decimalPoint, options = { removeTrailingZeros: true, roundType: Decimal.ROUND_UP}) => {
    if (value !== 0 && !value) return '';
    let fixedValue = value;
    // 표시할 자리수를 결정합니다.
    if (typeof decimalPoint === 'number') {
        fixedValue = Decimal(value).toFixed(decimalPoint, options.roundType);
    }

    // 불필요한 소수점의 0을 제거합니다.
    if (options.removeTrailingZeros) {
        fixedValue = Decimal(fixedValue).toFixed();
    }

    return fixedValue;
};

export const putComma = (value, decimalPoint) => {
    if (value !== 0 && !value) return '';
    try {
        // decimal로 변환 가능한 value 인지 검증합니다.
        Decimal(value);
    } catch (e) {
        return '';
    }

    let value_string = value + '';
    if (typeof decimalPoint === 'number') {
        value_string = Decimal(value_string).toFixed(decimalPoint);
    }

    let hasPoint = value_string.indexOf('.') !== -1;
    let [ digitPortion_string, decimalPortion_string ] = value_string.split('.');
    let sign_string = digitPortion_string[0] === '-' ? '-' : '';
    if (sign_string) digitPortion_string = digitPortion_string.slice(1);
    let digitWithComma = digitPortion_string.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `${ sign_string }${ digitWithComma }${ hasPoint ? '.' : '' }${ decimalPortion_string || '' }`;
}

export const getFixedValueWithComma = (value, decimalPoint, options) => {
    if (value !== 0 && !value) return '';
    try {
        return putComma(getFixed(value, decimalPoint, options));
    } catch(error) {
        console.log(error);
        return '';
    }
}

export const getFixedValueBySymbol = (value, symbol) => {
    if (value !== 0 && !value) return '';
    let fixedValue = value;
    if (symbol === "KRW" || symbol === "CT") {
        fixedValue = getFixed(value, DECIMAL_POINT_OF_KRW); // 3은 UNIT_PRICE_TABLE의 KRW 최소 unit price(0.001)를 따릅니다.
    } else {
        fixedValue = getFixed(value, DECIMAL_POINT_OF_TOKEN); // 8은 UNIT_PRICE_TABLE의 KRW 최소 unit price(1 사토시)를 따릅니다.
    }
    return fixedValue;
};

export const getRateAsPercentage = (rate, maximumFractionDigits) => {
    if (!rate) return '';
    try {
        let rate_decimal = Decimal(rate);
        if (maximumFractionDigits) {
            return rate_decimal.times(100).toFixed(maximumFractionDigits);
        } else {
            return rate_decimal.times(100).toFixed();
        }
    } catch (err) {
        return '';
    }
};

/*
 * 숫자를 받아 함수가 표현 가능한 가장 큰 단위를 숫자와 단위로 리턴합니다..
 * 예시)
 * getNumberAndPowerOfTenFromNumber('2312345000') => {number: '2312', type: 'million'}
 * getNumberAndPowerOfTenFromNumber('2312345000000') => {number: '231', type: 'billion'}
 */

export const getNumberAndPowerOfTenFromNumber = (number_string) => {
    let result = {
        number: number_string,
        type: '',
    };
    if (!number_string) return result;

    let number_decimal = Decimal(number_string);
    if (number_decimal.greaterThanOrEqualTo(TRILLION)) {
        result.number = number_decimal.div(TRILLION).toFixed(4);
        result.type = 'trillion';
    } 
    // else if (number_decimal.greaterThanOrEqualTo(BILLION)) {
    //     result.number = number_decimal.div(BILLION).toFixed(4);
    //     result.type = 'billion';
    // } 
    else if (number_decimal.greaterThanOrEqualTo(MILLION)) {
        result.number = number_decimal.div(MILLION).toFixed(4);
        result.type = 'million';
    } else {
        result.number = number_decimal.toFixed(0);
        result.type = '';
    }
    result.number = Decimal(result.number).toFixed();
    return result;
};

export const checkValueValid = (value) => {
    try {
        Decimal(value).toFixed(); // 값에 이상이 없으면 값을 계속 입력 가능 (ex. 123. 1234.00200 등)
        return true;
    } catch (err) {
        return false;
    }
};

export default {
    getUnitPrice,
    putComma,
    getFixedPrice: getFixedValueBySymbol,
    getFixedVolume: getFixedValueBySymbol,
    getRateAsFiexdPercentage: getRateAsPercentage,
    getFixed,
    minimum: min,
    maximum: max,
};