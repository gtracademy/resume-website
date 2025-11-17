import React, { Component } from 'react';
import { getSubscriptionStatus, setSubscriptionsData } from '../../../firestore/dbOperations';
import { FaCheck, FaTimes, FaCreditCard, FaDollarSign, FaToggleOn, FaToggleOff, FaPaypal } from 'react-icons/fa';

class SubscriptionSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            websiteTitle: '',
            checkedSubscriptions: false,
            checkedOnlyPP: false,
            monthlyPrice: 0,
            quartarlyPrice: 0,
            yearlyPrice: 0,
            currency: '',
            isSuccessOpen: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubscriptionToggleChange = this.handleSubscriptionToggleChange.bind(this);
        this.handlePPCheckedChange = this.handlePPCheckedChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    handleChange(event, inputName) {
        switch (inputName) {
            case 'monthly':
                this.setState({ monthlyPrice: event.target.value });
                break;
            case 'quartarly':
                this.setState({ quartarlyPrice: event.target.value });
                break;
            case 'yearly':
                this.setState({ yearlyPrice: event.target.value });
                break;
            case 'currency':
                this.setState({ currency: event.target.value });
                break;
            default:
                break;
        }
    }
    handleSubscriptionToggleChange() {
        this.setState((prevState) => ({ checkedSubscriptions: !prevState.checkedSubscriptions }));
    }
    handlePPCheckedChange() {
        this.setState((prevState) => ({ checkedOnlyPP: !prevState.checkedOnlyPP }));
    }
    componentDidMount() {
        this.state.monthlyPrice == 0 &&
            getSubscriptionStatus().then((data) =>
                this.setState({
                    checkedSubscriptions: data.state,
                    monthlyPrice: data.monthlyPrice,
                    quartarlyPrice: data.quartarlyPrice,
                    yearlyPrice: data.yearlyPrice,
                    checkedOnlyPP: data.onlyPP == undefined ? false : data.onlyPP,
                    currency: data.currency == undefined ? '' : data.currency,
                })
            );
    }
    submitHandler() {
        setSubscriptionsData(this.state.checkedSubscriptions, this.state.monthlyPrice, this.state.quartarlyPrice, this.state.yearlyPrice, this.state.checkedOnlyPP, this.state.currency);
        this.setState({ isSuccessOpen: true });
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
            this.setState({ isSuccessOpen: false });
        }, 3000);
    }
    handleClose() {
        this.setState({ isSuccessOpen: false });
    }
    render() {
        return (
            <div className="space-y-6">
                {/* Success Alert */}
                {this.state.isSuccessOpen && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <FaCheck className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-emerald-800">Subscription settings saved!</p>
                                <p className="text-xs text-emerald-600 mt-1">Your pricing configuration has been updated.</p>
                            </div>
                        </div>
                        <button
                            onClick={this.handleClose}
                            className="text-emerald-400 hover:text-emerald-600 transition-colors p-1 rounded">
                            <FaTimes className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Subscription Toggle */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                <FaCreditCard className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Subscription System</h3>
                                <p className="text-sm text-slate-500">Enable premium subscription features</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={this.handleSubscriptionToggleChange}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                this.state.checkedSubscriptions
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {this.state.checkedSubscriptions ? (
                                <>
                                    <FaToggleOn className="w-5 h-5" />
                                    <span>Enabled</span>
                                </>
                            ) : (
                                <>
                                    <FaToggleOff className="w-5 h-5" />
                                    <span>Disabled</span>
                                </>
                            )}
                        </button>
                    </div>

                    {this.state.checkedSubscriptions && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3">
                                <FaCheck className="w-4 h-4" />
                                <span>Subscription system is active and ready for configuration</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pricing Plans */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <FaDollarSign className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Pricing Configuration</h3>
                            <p className="text-sm text-slate-500">Set your subscription pricing tiers</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Monthly Price */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Plan</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={this.state.monthlyPrice || ''}
                                    onChange={(event) => this.handleChange(event, 'monthly')}
                                    disabled={!this.state.checkedSubscriptions}
                                    placeholder="9.99"
                                    className={`w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors ${
                                        !this.state.checkedSubscriptions
                                            ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                            : 'bg-white text-slate-900'
                                    }`}
                                />
                                <FaDollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 ${
                                    !this.state.checkedSubscriptions ? 'text-slate-300' : 'text-slate-500'
                                }`} />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Per month</p>
                        </div>

                        {/* Quarterly Price */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Quarterly Plan</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={this.state.quartarlyPrice || ''}
                                    onChange={(event) => this.handleChange(event, 'quartarly')}
                                    disabled={!this.state.checkedSubscriptions}
                                    placeholder="24.99"
                                    className={`w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors ${
                                        !this.state.checkedSubscriptions
                                            ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                            : 'bg-white text-slate-900'
                                    }`}
                                />
                                <FaDollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 ${
                                    !this.state.checkedSubscriptions ? 'text-slate-300' : 'text-slate-500'
                                }`} />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Per 3 months</p>
                        </div>

                        {/* Yearly Price */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Yearly Plan</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={this.state.yearlyPrice || ''}
                                    onChange={(event) => this.handleChange(event, 'yearly')}
                                    disabled={!this.state.checkedSubscriptions}
                                    placeholder="89.99"
                                    className={`w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors ${
                                        !this.state.checkedSubscriptions
                                            ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                            : 'bg-white text-slate-900'
                                    }`}
                                />
                                <FaDollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 ${
                                    !this.state.checkedSubscriptions ? 'text-slate-300' : 'text-slate-500'
                                }`} />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Per year</p>
                        </div>

                        {/* Currency */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                            <select
                                value={this.state.currency}
                                onChange={(event) => this.handleChange(event, 'currency')}
                                disabled={!this.state.checkedSubscriptions}
                                className={`w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors ${
                                    !this.state.checkedSubscriptions
                                        ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                        : 'bg-white text-slate-900'
                                }`}
                            >
                                <option value="">Select Currency</option>
                                <option value="USD">💵 USD</option>
                                <option value="EUR">💶 EUR</option>
                                <option value="GBP">💷 GBP</option>
                                <option value="CAD">🍁 CAD</option>
                                <option value="AUD">🇦🇺 AUD</option>
                            </select>
                            <p className="text-xs text-slate-500 mt-1">Price currency</p>
                        </div>
                    </div>
                </div>

                {/* PayPal Settings */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                <FaPaypal className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Payment Method</h3>
                                <p className="text-sm text-slate-500">Configure accepted payment methods</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={this.handlePPCheckedChange}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                this.state.checkedOnlyPP
                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <FaPaypal className="w-4 h-4" />
                            <span>{this.state.checkedOnlyPP ? 'PayPal Only' : 'All Methods'}</span>
                        </button>
                    </div>

                    {this.state.checkedOnlyPP && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="flex items-center space-x-2 text-sm text-blue-700 bg-blue-50 rounded-lg p-3">
                                <FaPaypal className="w-4 h-4" />
                                <span>Only PayPal payments will be accepted</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <div className="flex items-center text-sm text-slate-500">
                        <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                        <span>Changes apply to new subscriptions</span>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={() => this.submitHandler()}
                            className="px-6 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex items-center space-x-2"
                        >
                            <FaCheck className="w-4 h-4" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
export default SubscriptionSetting;
