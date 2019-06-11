import { observable, action, computed } from 'mobx';

import agent from '../utils/agent';

import WAValidator from 'wallet-address-validator';
import accountStore from './accountStore';
import TRANSLATIONS from '../TRANSLATIONS';

class WhitelistedWithdrawalWalletAddressStore {
    @observable errors = undefined;
    @observable isLoading = null;
    @observable walletValues = {
        'address': '',
        'otp_code': '',
        'nickname': '',
        'asset_symbol': ''
    };

    @observable loadMoreValues = {
        selectedOption: null,
        nextUrl: null,
        isFirstLoad: true,
        isLoading: false,
    };

    @observable withdrawalWalletAddressRegistry = observable.array();

    @computed get options() {
        let options = [];
        if (this.withdrawalWalletAddressRegistry.length) {
            this.withdrawalWalletAddressRegistry.forEach((withdrawalWalletAddress, index) => {
                let { uuid, nickname, address } = withdrawalWalletAddress;
                options.push({
                    value: index,
                    label: `${address} (${nickname})`
                });
            });
        }
        return options;
    };

    @action setWithdrawdWalletAddressByIndex(index) {
        let wallet = this.withdrawalWalletAddresses[index];
        accountStore.setWithdrawAddress(wallet.address);
    }

    @action setWithdrawalWalletAddress(address) {
        this.walletValues.address = address;
    }

    @action setOtpCode(otpcode) {
        this.walletValues.otp_code = otpcode;
    }

    @action setNickname(nickname) {
        this.walletValues.nickname = nickname;
    }

    @action setAssetSymbol(asset_symbol) {
        this.walletValues.asset_symbol = asset_symbol;
    }

    @action clearWalletValues() {
        this.walletValues.address = '';
        this.walletValues.nickname = '';
    }

    @action clearLoadMoreWithdrawalWalletAddress() {
        this.loadMoreValues.nextUrl = '';
        this.loadMoreValues.isFirstLoad = true;
    }

    @computed get withdrawalWalletAddresses() {
        return this.withdrawalWalletAddressRegistry;
    };


    @action registerWithdrawalWalletAddress() {
        this.loadMoreValues.isLoading = true;

        return agent.registerWithdrawalWalletAddress(this.walletValues)
            .then(action((response) => {
                this.clearLoadMoreWithdrawalWalletAddress();
                this.loadWithdrawalWalletAddresses();
                this.loadMoreValues.isLoading = false;
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.loadMoreValues.isLoading = false;
                throw err;
            }));
    }

    @action deleteWithdrawalWalletAddress(walletUuid) {
        this.loadMoreValues.isLoading = true;

        return agent.deleteWithdrawalWalletAddress(walletUuid)
            .then(action((response) => {
                let targetIndex = this.withdrawalWalletAddressRegistry.indexOf(walletUuid)
                this.withdrawalWalletAddressRegistry.splice(targetIndex, 1);
                this.loadMoreValues.isLoading = false;
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.loadMoreValues.isLoading = false;
                throw err;
            }));
    }

    @action clearWithdrawalWalletAddresses() {
        this.withdrawalWalletAddressRegistry.clear();
    }

    @action loadWithdrawalWalletAddresses() {
        this.loadMoreValues.isLoading = true;

        if (this.loadMoreValues.isFirstLoad) {
            return agent.loadWithdrawalWalletAddresses(accountStore.selectedAccountSymbol)
            .then(action((response) => {
                this.withdrawalWalletAddressRegistry.replace(response.data.results);
                this.loadMoreValues.nextUrl = response.data.next;
                this.loadMoreValues.isFirstLoad = false;
                this.loadMoreValues.isLoading = false;
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.loadMoreValues.isLoading = false;
                throw err;
            }))
        } else {
            return agent.get(this.loadMoreValues.nextUrl)
            .then(action((response) => {
                let { results, next, previous } = response.data;
                this.withdrawalWalletAddressRegistry.replace([...this.depositAndWithdrawHistoryRegistry, ...results]);
                this.loadMoreValues.nextUrl = response.data.next;
                this.loadMoreValues.isLoading = false;
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.loadMoreValues.isLoading = false;
                throw err;
            }));
        }
    }

    _handleDeleteAddress = (address_uuid) => {
        this.deleteWithdrawalWalletAddress(address_uuid);
    }

    @computed get isWalletValuesValid() {
        if (!this.walletValues.address) {
            return {
                message_code: 'register_wallet/fill_in_wallet_address',
                state: false,
            }
        }   
        if (!this.isWalletAddresValid.state){
            return this.isWalletAddresValid;
        }
        if (!this.walletValues.nickname) {
            return {
                message_code: 'register_wallet/fill_in_wallet_nickname',
                state: false,
            }
        }
        return {
            message_code: 'register_wallet/valid_wallet',
            state: true,
        }
    }

    @computed get isWalletAddresValid() {
        if ( WAValidator.validate(this.walletValues.address, accountStore.selectedAccountSymbol) ) {
            return {
                message_code: 'register_wallet/valid_wallet_address',
                state: true
            }
        } else { 
            return {
                message_code: 'register_wallet/invalid_wallet_address',
                state: false,
            }
        }
    }
}

export default new WhitelistedWithdrawalWalletAddressStore();