import { StyleSheet } from 'react-native';

const coblicButton = {
};

const color = {
    coblicBlue: '#0052f3',
    coblicPaleBlue: '#81a6ef',
    coblicRed: '#da5f6e',
    coblicGrey: '#dedfe0'
};

const font = {
    size: {
        modalHeader: 22,
        modalContent: 16,
    },
    weight: {
        bold: '600',
    }
}

export { color, font };

export default StyleSheet.create({
    coblicBlueButton: { ...coblicButton,
        color: '#0052f3'
    },
    coblicRedButton: { ...coblicButton,
        color: '#da5f6e'
    },
    RISE: {
        color: '#da5f6e'
    },
    FALL: {
        color: '#0052f3'
    },
    BUY: {
        color: '#da5f6e'
    },
    SELL: {
        color: '#0052f3'
    },
});