import React from 'react';
import { observable, action, computed } from 'mobx';

import agent from '../utils/agent';

import WAValidator from 'wallet-address-validator';
import modalStore from './modalStore';
import userStore from './userStore';
import accountStore from './accountStore';
import TRANSLATIONS from '../TRANSLATIONS';

//'uuid', 'address', 'nickname', 'otp_code', 'asset_symbol'

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


    openWithdrawalWalletAddressListModal = () => {
        modalStore.openCustom(
            <div className='withdrawal-wallet-address-header'>
                <img className='account-icon' width='32px' src={`${process.env.RAZZLE_ASSET_ORIGIN}/images/mypage/account_icon_blue.png`} alt='$' />
                지갑 관리
            </div>,
            () =>
            <div className='withdrawal-wallet-address-list-body'>
                <div className='withdrawal-wallet-address-table'>
                    <div className='table-head'>
                        <div className='head-column first'>닉네임</div>
                        <div className='head-column second'>주소</div>
                        <div className='head-column third'>삭제</div>
                    </div>
                    <div className='table-body'>
                        {this.withdrawalWalletAddresses.map((withdrawalWalletAddress) => {
                            return (
                                <div className='body-row' key={withdrawalWalletAddress.uuid}>
                                    <div className='row-value first'>{withdrawalWalletAddress.nickname}</div>
                                    <div className='row-value second'>{withdrawalWalletAddress.address}</div>
                                    <div className='row-value third'>
                                        <button onClick={() => this._handleDeleteAddress(withdrawalWalletAddress.uuid)}>
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>,
            <div className='withdrawal-wallet-address-list-footer'>
                <div className='coblic-white-button add-wallet-button' 
                    onClick={() => {
                        if (!userStore.currentUser.verification.is_otp_registered) {
                            modalStore.openPreset(
                                'OTP 등록이 필요합니다.',
                                '마이페이지로 이동하여 인증 절차를 진행해주세요! :)',
                                '확인'
                            );
                        } else {
                            this.openRegisterWalletAddressModal();
                        }
                    }
                    }>지갑추가</div>
                <div className='confirm-button coblic-blue-button'
                    onClick={(e) => { modalStore.closeModal(); }}>확인</div>
            </div>
        )
    }
    _handleDeleteAddress = (address_uuid) => {
        this.deleteWithdrawalWalletAddress(address_uuid);
    }

    openRegisterWalletAddressModal = () => {
        this.clearWalletValues();
        modalStore.openCustom(
            <div className='withdrawal-wallet-address-header'>
                <img className='account-icon' width='32px' src={`${process.env.RAZZLE_ASSET_ORIGIN}/images/mypage/account_icon_blue.png`} alt='$' />
                지갑 추가
            </div>,
            (() => 
            <div className='withdrawal-wallet-address-register-form'>
                <div className='form-description'>
                    {`새로 등록할 지갑주소의 닉네임과 주소를 입력해주세요.`}<br/>
                </div>
                <div className='divide-bar first'/>
                <div className='item-title'>{`지갑 주소`}</div>
                <input className='item-input' 
                    type='text' name='address' placeholder='지갑 주소 입력' 
                    defaultValue={this.walletValues.address}
                    onChange={this._handleChangeAddress} />
                <div className='item-title'>{`닉네임`}</div>
                <input className='item-input'
                    type='text' name='nickname' placeholder='닉네임 입력' 
                    defaultValue={this.walletValues.nickname}
                    onChange={this._handleChangeNickname} />
                {
                    (() => {
                        return (
                            <div className={`form-warning ${this.isWalletValuesValid.state ? 'coblic-blue-text' : 'coblic-red-text'}`}>
                                * {`${TRANSLATIONS[this.isWalletValuesValid.message_code]}`}.
                            </div>
                        );
                    })()
                }

                <div className={`form-warning`}>
                    * bitcoincash: 으로 시작하는 비트코인캐시의 신주소로는 등록이 불가합니다.
                </div>
                <div className='divide-bar'/>
            </div>),
            () => 
            <div className='withdrawal-wallet-address-register-footer'>
                <div className='coblic-white-button register-wallet-button' 
                    onClick={this.openWithdrawalWalletAddressListModal}>뒤로가기</div>
                    {
                    (() => 
                        <div className={`confirm-button coblic-blue-button ${(!this.isWalletValuesValid.state) && 'coblic-disabled-button'}`}
                            onClick={async (e) => {
                                // valid 하면 클릭 가능
                                this.openWalletAddressOtpVerificaionModal();

                            }}>추가
                        </div>
                    )()
                    }
            </div>
        )
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
    
    _handleChangeAddress = action((e) => {
        this.walletValues.address = e.currentTarget.value;
    });

    _handleChangeNickname = action((e) => {
        this.walletValues.nickname = e.currentTarget.value;
    });

    openWalletAddressOtpVerificaionModal = () => {
        modalStore.openCustom(
            <div className='withdrawal-wallet-address-header'>
                <img className='account-icon' width='32px' src={`${process.env.RAZZLE_ASSET_ORIGIN}/images/mypage/account_icon_blue.png`} alt='$' />
                지갑 추가
            </div>,
            ((e) => 
            <div className="withdrawal-wallet-address-register-form">
                <div className="item-title">OTP 코드를 입력하세요.</div>
                <input className="item-input" type="number" name="otp" placeholder="otp 코드" onChange={this._handleChangeOtpCode} />
            </div>),
            ((e) => 
            <div className='withdrawal-wallet-address-register-footer'>
                <div className='coblic-white-button register-wallet-button' 
                    onClick={(e) => {
                        this.openRegisterWalletAddressModal();
                    }}>뒤로가기</div>                    
                <div className={`confirm-button coblic-blue-button ${!(this.walletValues.otp_code.length == 6) && 'coblic-disabled-button'}`}
                    onClick={async (e) => {
                        this.registerWithdrawalWalletAddress().then(()=> {
                            modalStore.openPreset(
                                '지갑 등록 완료', 
                                '성공적으로 지갑이 등록되었습니다.', 
                                '확인',
                                () => { window.location.reload() }
                            );
                        });
                    }}>등록하기
                </div>
            </div>)
        )
    }
    _handleChangeOtpCode = (e) => {
        this.setOtpCode(e.target.value);
    }
}

export default new WhitelistedWithdrawalWalletAddressStore();