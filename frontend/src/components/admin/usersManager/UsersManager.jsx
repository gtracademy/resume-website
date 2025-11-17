import React, { Component } from 'react';
import { getAllUsers, getUserById } from '../../../firestore/dbOperations';
import { Navigate } from 'react-router-dom';
import { FaUsers, FaSearch, FaEye, FaCrown, FaUser, FaEnvelope, FaCalendar, FaCheck } from 'react-icons/fa';

class UsersManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showUsers: false,
            rows: null,
            isRedirectToUser: false,
            enteredUser: null,
            /// Selected User data,
            selectedId: null,
            selectedEmail: null,
            selectedSubscription: null,
            selectedSubscriptionEnd: null,
        };
        this.rows = [this.createData('x28839283', 'ja3tar@gmail.com', 'Premium')];
        this.createData = this.createData.bind(this);
        this.showTable = this.showTable.bind(this);
        this.redirectToUser = this.redirectToUser.bind(this);
        this.findUserById = this.findUserById.bind(this);
        this.handlInput = this.handlInput.bind(this);
    }
    createData(id, email, subscription, more) {
        return { id, email, subscription, more };
    }
    // change the state to show the table and also get the data
    showTable() {
        var Rows = [];
        getAllUsers().then((value) => {
            value.forEach((element) => {
                console.log(element);
                Rows.push(
                    this.createData(
                        element.userId,
                        element.email !== undefined ? element.email : 'Not Provided',
                        element.membership !== undefined ? element.membership : 'Basic',
                        <button
                            onClick={() => this.redirectToUser(element.userId, element.email, element.membership, element.membershipsEnds)}
                            className="flex items-center justify-center w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                            title="View user details"
                        >
                            <FaEye className="w-3 h-3 text-slate-600" />
                        </button>
                    )
                );
            });
            this.setState({ rows: Rows });
        });
        this.setState({ showUsers: true });
    }
    // Redirect to user page with its data
    redirectToUser(id, email, subscription, subscriptionEnd) {
        this.setState({
            isRedirectToUser: true,
            selectedId: id,
            selectedEmail: email,
            selectedSubscription: subscription,
            selectedSubscriptionEnd: subscriptionEnd,
        });
    }
    /// Find user by id
    findUserById() {
        getUserById(this.state.enteredUser).then((element) => {
            console.log(element);
            if (element == false) {
                alert('User not found please verify id!');
            } else {
                var Rows = [];
                Rows.push(
                    this.createData(
                        element.userId,
                        element.email !== undefined ? element.email : 'Not Provided',
                        element.membership,
                        <button
                            onClick={() => this.redirectToUser(element.userId, element.email, element.membership, element.membershipsEnds)}
                            className="flex items-center justify-center w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                            title="View user details"
                        >
                            <FaEye className="w-3 h-3 text-slate-600" />
                        </button>
                    )
                );
                this.setState({ showUsers: true, rows: Rows });
            }
        });
    }
    handlInput(inputName, event) {
        switch (inputName) {
            case 'enteredUser':
                this.setState({
                    enteredUser: event.target.value,
                });
                break;
            default:
                break;
        }
    }
    render() {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
                {this.state.isRedirectToUser && (
                    <Navigate
                        to="/adm/user/ss"
                        state={{
                            userId: this.state.selectedId,
                            email: this.state.selectedEmail,
                            membership: this.state.selectedSubscription,
                            membershipEnd: this.state.selectedSubscriptionEnd,
                        }}
                        replace
                    />
                )}

                {/* Header Section */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FaUsers className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Users Manager</h1>
                            <p className="text-sm text-slate-500">Manage user accounts, subscriptions, and access permissions</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <FaUser className="w-4 h-4 text-slate-600" />
                                <span className="text-sm text-slate-600">Total Users</span>
                            </div>
                            <p className="text-lg font-semibold text-slate-900">{this.state.rows ? this.state.rows.length : '—'}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <FaCrown className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-slate-600">Premium Users</span>
                            </div>
                            <p className="text-lg font-semibold text-slate-900">
                                {this.state.rows ? this.state.rows.filter(row => row.subscription === 'Premium').length : '—'}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <FaCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-slate-600">Active Status</span>
                            </div>
                            <p className="text-lg font-semibold text-slate-900">
                                {this.state.showUsers ? 'Loaded' : 'Ready'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                            <FaSearch className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Find User</h3>
                            <p className="text-sm text-slate-500">Search for a specific user by their email address</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="email"
                                onChange={(event) => this.handlInput('enteredUser', event)}
                                placeholder="Enter user email address"
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <button
                            onClick={() => this.findUserById()}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                            <FaSearch className="w-4 h-4" />
                            <span>Search User</span>
                        </button>
                    </div>
                </div>

                {/* Users Table Section */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900">All Users</h3>
                        <p className="text-sm text-slate-500">Complete list of registered users and their details</p>
                    </div>

                    {!this.state.showUsers ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaUsers className="w-8 h-8 text-slate-400" />
                            </div>
                            <h4 className="text-lg font-medium text-slate-900 mb-2">Load User Data</h4>
                            <p className="text-sm text-slate-500 mb-6">Click the button below to fetch and display all users</p>
                            <button
                                onClick={() => this.showTable()}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 mx-auto">
                                <FaUsers className="w-4 h-4" />
                                <span>Load All Users</span>
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            <div className="flex items-center space-x-1">
                                                <FaUser className="w-3 h-3" />
                                                <span>User ID</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            <div className="flex items-center space-x-1">
                                                <FaEnvelope className="w-3 h-3" />
                                                <span>Email</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            <div className="flex items-center justify-center space-x-1">
                                                <FaCrown className="w-3 h-3" />
                                                <span>Subscription</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {this.state.rows?.map((row, index) => (
                                        <tr key={row.id || index} className="hover:bg-slate-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-3">
                                                        <FaUser className="w-3 h-3 text-slate-600" />
                                                    </div>
                                                    <div className="text-sm font-medium text-slate-900 font-mono">
                                                        {row.id?.slice(0, 8)}...
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900">{row.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    row.subscription === 'Premium'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : row.subscription === 'Basic'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-slate-100 text-slate-800'
                                                }`}>
                                                    {row.subscription === 'Premium' && <FaCrown className="w-3 h-3 mr-1" />}
                                                    {row.subscription}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {row.more}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
export default UsersManager;
