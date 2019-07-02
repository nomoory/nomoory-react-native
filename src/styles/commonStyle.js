import { StyleSheet } from 'react-native';

export const color = {
    brandBlue: '#093687',
    coblicPaleBlue: '#81a6ef',
    coblicRed: '#d60000',
    coblicGrey: '#999',
    coblicPaleGrey: '#dedfe0',
    coblicYellow: '#ffc107',
    coblicSellButtonBackground: '#115dcb',
    coblicBuyButtonBackground: '#d80e35',
    white: '#ffffff',
    main: '#0052f3',
    mainThemeColor: "rgb(20, 40, 120)",
};

export const font = {
    size: {
        modalHeader: 22,
        modalContent: 16,
        tableContentNormal: 10,
    },
    weight: {
        bold: '600',
    }
}

const commonStyle = {
    brandBlueButton: {
        color: '#0051c7'
    },
    coblicRedButton: {
        color: '#d60000'
    },
    RISE: {
        color: '#d60000'
    },
    FALL: {
        color: '#0051c7'
    },
    BUY: {
        color: '#d60000'
    },
    SELL: {
        color: '#0051c7'
    },
    color,
    font,
};

/*
 * 위 font의 size에 있는 항목들을 style 화 시킴
 * ex) font.size.yourFontSize = 20;
 * => style= {[commonStyles.yourFontSizeText]} 로 사용 가능
 */
Object.keys(font.size).forEach((sizeName) => {
    let size = font.size[sizeName];
    commonStyle[sizeName + 'Text'] = { fontSize: size };
});

export default commonStyle;