import React, { Component } from 'react';
import { editUser, getUserById } from '../../../firestore/dbOperations';
import { useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCrown, FaCalendar, FaSave, FaCheck, FaTimes, FaUserEdit, FaSpinner, FaInfoCircle } from 'react-icons/fa';

class UserEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            userId: this.props.userId || '',
            subscription: '',
            subscriptionEnd: '',
            isLoading: false,
            successMessage: '',
            errorMessage: '',
        };
        this.editSelectedUser = this.editSelectedUser.bind(this);
        this.handleInputs = this.handleInputs.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }
    editSelectedUser(userId, email, membership, membershipsEnds) {
        this.setState({ isLoading: true, errorMessage: '', successMessage: '' });
        try {
            editUser(userId, email, membership, membershipsEnds);
            console.log(membershipsEnds);
            this.setState({
                isLoading: false,
                successMessage: 'User updated successfully!',
                errorMessage: '',
            });
            // Auto-hide success message after 3 seconds
            setTimeout(() => {
                this.setState({ successMessage: '' });
            }, 3000);
        } catch (error) {
            this.setState({
                isLoading: false,
                errorMessage: 'Error occurred. Please check the entered fields!',
                successMessage: '',
            });
        }
    }
    handleInputs(inputName, inputValue) {
        switch (inputName) {
            case 'userId':
                this.setState({ userId: inputValue });
                break;
            case 'subscription':
                this.setState({ subscription: inputValue });
                break;
            case 'email':
                this.setState({ email: inputValue });
                break;
            case 'subscriptionEnd':
                this.setState({ subscriptionEnd: inputValue });
                break;
            default:
                break;
        }
    }
    componentDidMount() {
        const userEmail = this.props.email || this.props.userId;
        if (userEmail) {
            getUserById(userEmail)
                .then((data) => {
                    if (data && data.membershipEnds) {
                        console.log(new Date(data.membershipEnds.seconds * 1000).toISOString().split('T')[0]);
                        this.setState({
                            email: data.email,
                            subscription: data.membership,
                            subscriptionEnd: this.formatDate(new Date(data.membershipEnds.seconds * 1000).toISOString().split('T')[0]),
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                    this.setState({
                        errorMessage: 'Error loading user data',
                    });
                });
        }
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('-');
    }

    render() {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
                {/* Header Section */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FaUserEdit className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Edit User Account</h1>
                            <p className="text-sm text-slate-500">Manage user details, subscription plans, and account settings</p>
                        </div>
                    </div>

                    {/* User Info Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <FaUser className="w-4 h-4 text-slate-600" />
                                <span className="text-sm text-slate-600">User Status</span>
                            </div>
                            <p className="text-lg font-semibold text-slate-900">Active</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <FaCrown className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-slate-600">Current Plan</span>
                            </div>
                            <p className="text-lg font-semibold text-slate-900">
                                {this.state.subscription || 'Not Set'}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <FaCalendar className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-slate-600">Last Updated</span>
                            </div>
                            <p className="text-lg font-semibold text-slate-900">Now</p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {this.state.successMessage && (
                    <div className="bg-white border border-emerald-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <FaCheck className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-emerald-900">Success</h4>
                                <p className="text-sm text-emerald-700">{this.state.successMessage}</p>
                            </div>
                            <button
                                onClick={() => this.setState({ successMessage: '' })}
                                className="w-6 h-6 flex items-center justify-center text-emerald-400 hover:text-emerald-600 transition-colors"
                            >
                                <FaTimes className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {this.state.errorMessage && (
                    <div className="bg-white border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                                <FaTimes className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-red-900">Error</h4>
                                <p className="text-sm text-red-700">{this.state.errorMessage}</p>
                            </div>
                            <button
                                onClick={() => this.setState({ errorMessage: '' })}
                                className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
                            >
                                <FaTimes className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                )}

                {/* User Edit Form */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900">User Details</h3>
                        <p className="text-sm text-slate-500">Update user information and subscription settings</p>
                    </div>

                    <form className="p-6 space-y-6">
                        {/* User ID */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                <div className="flex items-center space-x-2">
                                    <FaUser className="w-4 h-4 text-slate-600" />
                                    <span>User ID</span>
                                </div>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={this.state.userId}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                                    placeholder="User ID"
                                    readOnly
                                />
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex items-center space-x-1 mt-2">
                                <FaInfoCircle className="w-3 h-3 text-slate-400" />
                                <p className="text-xs text-slate-500">User ID is read-only and cannot be modified</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                <div className="flex items-center space-x-2">
                                    <FaEnvelope className="w-4 h-4 text-slate-600" />
                                    <span>Email Address</span>
                                </div>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    onChange={(event) => this.handleInputs('email', event.target.value)}
                                    value={this.state.email}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter user email address"
                                />
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Subscription Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                <div className="flex items-center space-x-2">
                                    <FaCrown className="w-4 h-4 text-slate-600" />
                                    <span>Subscription Plan</span>
                                </div>
                            </label>
                            <div className="relative">
                                <select
                                    onChange={(event) => this.handleInputs('subscription', event.target.value)}
                                    value={this.state.subscription}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                                >
                                    <option value="">Select subscription plan</option>
                                    <option value="Basic">Basic Plan</option>
                                    <option value="Premium">Premium Plan</option>
                                </select>
                                <FaCrown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div className="bg-blue-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-slate-600">Basic Plan</p>
                                    <p className="text-sm font-medium text-blue-600">Limited Features</p>
                                </div>
                                <div className="bg-amber-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-slate-600">Premium Plan</p>
                                    <p className="text-sm font-medium text-amber-600">All Features</p>
                                </div>
                            </div>
                        </div>

                        {/* Subscription End Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                <div className="flex items-center space-x-2">
                                    <FaCalendar className="w-4 h-4 text-slate-600" />
                                    <span>Subscription End Date</span>
                                </div>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={this.state.subscriptionEnd}
                                    onChange={(event) => this.handleInputs('subscriptionEnd', event.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                                <FaInfoCircle className="w-4 h-4" />
                                <span>Changes will be applied immediately</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    this.editSelectedUser(this.state.userId, this.state.email, this.state.subscription, this.state.subscriptionEnd);
                                }}
                                disabled={this.state.isLoading}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                                    this.state.isLoading
                                        ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {this.state.isLoading ? (
                                    <>
                                        <FaSpinner className="w-4 h-4 animate-spin" />
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="w-4 h-4" />
                                        <span>Update User</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

// Wrapper component to use React Router v6 hooks with class component
const UserEditWrapper = () => {
    const location = useLocation();
    const locationState = location.state || {};

    return <UserEdit userId={locationState.userId} email={locationState.email} membership={locationState.membership} membershipEnd={locationState.membershipEnd} />;
};

export default UserEditWrapper;
