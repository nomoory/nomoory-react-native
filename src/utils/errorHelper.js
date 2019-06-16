// import snackbarHelper from './snackbarHelper';
import modalStore from '../stores/modalStore';
// import ctLockupStore from '../stores/ctLockupStore';
import TRANSLATIONS from '..//TRANSLATIONS';
import authStore from '../stores/authStore';
import userStore from '../stores/userStore';

class ErrorHelper{
    handleErrorCode(error) {
        let {
            error_code,
            status_code,
            error_message,
            default_code,
            default_detail
        } = this.parseError(error);
        
        let message = null;
        /* not found */
        if (status_code == 404) { return ;}

        /* latest 락업을 요청했는데(배당 페이지에서 매번 요청) 이전 락업 내역이 없을 때*/
        if (error_code == 3044) { return; }

        /* temporary_otp_token expired */
        if (error_code === 2102) {
            
            return; 
        }
        
        /* token 만료 */
        if (status_code == 401) { 
            userStore.forgetUser();
            authStore.destroyAccessToken();
            return;
        } 

        /* 72시간 전 채굴 불가 에러 코드 */
        if (error_code == 3034) { 
            modalStore.openModal({
                type: 'error',
                title: '출금 불가',
                content: '첫 원화입금 이후 72시간이 지나야 출금이 가능합니다.',
            });
            return;
        }

        if (error_code == 3036) {
            modalStore.openModal({
                type: 'error',
                title: '거래 이상',
                content: '3036 에러. 메일로 문의 부탁 드립니다. 문의메일: @.com',
            });
            return;
        }

        if (default_code == 'unique' && default_detail == 'email') {
            // 회원가입시 동일 이메일 입력하면 위와 같은 조합으로 에러가 옮
            // 추후 서버측에서 에러 메시지응 개선하면 사라질 분기임
            message = TRANSLATIONS['not_unique_email'];
        } else {
            message = TRANSLATIONS[default_code];
        }

        // 동적으로 값을 주어야하여 아래와 같이 예외를 두어 처리함
        if (default_code === 'lockup_interval_not_exceeded') {
            // message = `락업 해제 후 ${ctLockupStore.policies.lockup_retriable_period_hour}시간이 지나야 다시 락업이 가능합니다.\n나중에 다시 시도해주세요.`;                
        }
        if (error_message === 'Invalid input.') {
            message = '입력값을 확인해주세요.'
        }

        if (message || error_message) {
            modalStore.openModal({
                type: 'error',
                title: '에러 발생',
                content: message || error_message,
            });
        } else {
            modalStore.openModal({
                type: 'error',
                title: TRANSLATIONS['unknown_error_title'], 
                content: TRANSLATIONS['unknown_error_message'],
            });
        }
    }
    parseError = (error) => {
        let error_code = error.data.error_code;
        let status_code = error.status;
        let error_message = error.data.error_detail;
        let { 
            code: default_code, 
            string: default_detail 
        } = (error.data.targets && error.data.targets[0]) || {}
        return {
            error_code,
            status_code,
            error_message,
            default_code,
            default_detail
        };
    }
}

const errorHelper = new ErrorHelper();
export default errorHelper;