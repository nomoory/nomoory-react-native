import { observable, action } from 'mobx';
import agent from '../utils/agent';

class OrderFeeStore {
    @observable isLoading = false;
    @observable errors = undefined;

    @observable orderFee = {
        maker_fee_rate: '0.0005',
        taker_fee_rate: '0.001',
    };

    @action loadOrderFee() {
        this.isLoading = true;
        return agent.loadOrderFee()
            .then((response) => {
                this.orderFee = response.data;
                this.isLoading = false;
            })
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.isLoading = false;
                throw err;
            }));
    }
}

const orderFeeStore = new OrderFeeStore();
export default orderFeeStore;