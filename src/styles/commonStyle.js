import { StyleSheet } from 'react-native';

const coblicButton = {
};

const color = {
    coblicBlue: '#0052f3',
    coblicPaleBlue: '#81a6ef',
    coblicRed: '#da5f6e',
    coblicGrey: '#999',
    coblicPaleGrey: '#dedfe0',
    white: '#ffffff'
};

const font = {
    size: {
        modalHeader: 22,
        modalContent: 16,
        tableContentNormal: 10,
    },
    weight: {
        bold: '600',
    }
}


let commonStyle = {
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
    color,
    font    
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

export { color, font };

export default StyleSheet.create(commonStyle);