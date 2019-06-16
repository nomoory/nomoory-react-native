import { extendObservable, action } from 'mobx';
import { Decimal } from '../../utils/number';

const getFixedValues = (values) => {
    const fixedValues = {};
    Object.keys(values).forEach((propertyKey) => {
        try {
            if (
                values[propertyKey] === ''
                || values[propertyKey] === 0
            ) {
                fixedValues[propertyKey] = values[propertyKey];
            } else {
                fixedValues[propertyKey] = values[propertyKey]
                    ? Decimal(values[propertyKey]).toFixed()
                    : '';
            }
        } catch (e) {
            fixedValues[propertyKey] = values[propertyKey];
        }
    });

    return fixedValues;
};

class Model {
    constructor(data) {
        extendObservable(this, getFixedValues(data));
    }

    @action
    update(payload = {}) {
        Object.keys(payload).forEach((propertyKey) => {
            try {
                this[propertyKey] = payload[propertyKey] ? Decimal(payload[propertyKey]).toFixed() : '';
            } catch (e) {
                this[propertyKey] = payload[propertyKey] || '';
            }
        });
        return this;
    }
}

export default Model;
