import { Text, TextInput } from 'react-native';
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = { ...(TextInput.defaultProps || {}), allowFontScaling: false };


// 몇몇 패키지에서 Nodejs 의 Buffer를 사용하지만 expo에서 이를 지원하지 않습니다.
// 이에 Buffer를 global 변수로 저장하는 코드를 실행합니다.
// project의 root file인 App.js에서 import합니다.
// App.js에서 아래 코드 실행시 import 된 모듈들의 실행이 우선적으로 일어나기 때문에
// Buffer가 없는 상태로 library가 실행, Buffer가 없다는 에러가 발생합니다.

global.Buffer = global.Buffer || require('buffer').Buffer;


