
1. Setting System Variables
- 초기에 세팅되어야할 Token과 URL은 app.js 파일의 expo.extra에 정의되어 있습니다. run time에서 Expo.Constants.manifest.extra['keyName']으로 변수에 접근 가능합니다.
- __DEV__로 dev환경(=> true)과 production 환경(=> false)이 구분됩니다.
- extra 를 다시 세팅한 이후에는 expo XDE를 재시작해야 내용이 반영됩니다.

2. 요청 모듈
- 경로: src/utils/api.js
- 역할: 요청 api 관리, 이 모듈의 method를 호출함으로 서버에 요청을 보낼 수 있습니다. promise를 return하여 then, catch를 사용할 수 있습니다.
- 사용: mobx의 <Provider>에 api를 주입하였습니다. api 모듈을 사용하고자 하는 component에서 @inject('api')를 하거나, import하여 사용할 수 있습니다.

3. 데이터 관리 w/mobx
- mobx를 통해 데이터를 관리합니다. 데코레이터(@)가 사용 가능합니다.

4. Navigation(router 역할)
- screen 전환 역할을 하는 모듈로 사용 빈도가 가장 높은 react-navigation library를 사용하였습니다.
- documentation 참고: https://reactnavigation.org/
- 전체 TabStack > Stack> Screen 의 구조로 되어있습니다.
- screen이 보여지는 페이지 단위이며, screen의 모음인 stack, 이 stack들이 각 Tab Stack에 들어가 tab상에 보여집니다.
- component 내에서 this.props.navigation.navigate('screenName'); 을 통해 화면 이동이 가능합니다.
