import { Decimal } from './decimal.mjs';

const unitPriceTable = {
    "BTC": Decimal(0.00000001),
    "ETH": Decimal(0.00000001),
    "CT":  Decimal(0.01),
    "KRW": [
        [0, 10, Decimal(0.01)], 
        [10, 100, Decimal(0.1)], 
        [100, 1000, Decimal(1)],
        [1000, 10000, Decimal(5)], 
        [10000, 100000, Decimal(10)], 
        [100000, 500000, Decimal(50)],
        [500000, 1000000, Decimal(100)], 
        [1000000, 2000000, Decimal(500)],
        [2000000, Number.MAX_SAFE_INTEGER, Decimal(1000)]
    ]
}

export function getUnitPrice(price, tradingPair){
    let base = tradingPair.split('-')[1];
    if(base === "KRW") {
        for (var i = 0; i < unitPriceTable[base].length; i++) {
            if (unitPriceTable[base][i][0] <= price && price < unitPriceTable[base][i][1]){
                return unitPriceTable[base][i][2];
            }
        }
    } else {
        return unitPriceTable[base];
    }
}

export function getFixedPrice(price, tradingPair){
    let base = tradingPair.split('-')[1];
    let tempDecimalPrice = Decimal(price);
    if (base === "KRW") {
        if (tempDecimalPrice>1000){
            tempDecimalPrice = tempDecimalPrice.toFixed(0);
        } else if (tempDecimalPrice<1000 & tempDecimalPrice>=100){
            tempDecimalPrice = tempDecimalPrice.toFixed(1);
        } else {
            tempDecimalPrice = tempDecimalPrice.toFixed(2);
        }
        return tempDecimalPrice.toString();
        
    } else if (base === "CT"){
        tempDecimalPrice = tempDecimalPrice.toFixed(2);
        return tempDecimalPrice.toString();
    } else {
        tempDecimalPrice = tempDecimalPrice.toFixed(8);
        return tempDecimalPrice.toString();
    }
}

export function getFixedThreeValue(value){
    let tempDecimalValue = Decimal(value);
    tempDecimalValue = tempDecimalValue.toFixed(3);
    return tempDecimalValue.toString();
}