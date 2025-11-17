import React, { Component } from 'react';
import WebsiteSettings from './websiteSettings';
import SubscriptionSetting from './subscriptionsSettings';
import SocialSettings from './socialSettings';
import AnalyticsSettings from './anlyticsSettings';
import PagesSettings from './pagesSettings';
import AdsSettings from './adsSettings';
import BlogSettings from './blogSettings';

// React Icons
import {
  FaCog,
  FaCreditCard,
  FaShareAlt,
  FaChartLine,
  FaFile,
  FaBullhorn
} from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 'websiteSettings',
        };
        this.setStep = this.setStep.bind(this);
    }
    setStep(stepName) {
        this.setState({ step: stepName });
    }
    render() {
        const settingsMenuItems = [
            {
                key: 'websiteSettings',
                label: 'Website',
                icon: FaCog,
                description: 'General settings'
            },
            {
                key: 'subscriptionsSettings',
                label: 'Subscriptions',
                icon: FaCreditCard,
                description: 'Payment plans'
            },
            {
                key: 'socialSettings',
                label: 'Social Links',
                icon: FaShareAlt,
                description: 'Social media'
            },
            {
                key: 'analytics',
                label: 'Analytics',
                icon: FaChartLine,
                description: 'Tracking & metrics'
            },
            {
                key: 'pages',
                label: 'Pages',
                icon: FaFile,
                description: 'Page management'
            },
            {
                key: 'ads',
                label: 'Ads Manager',
                icon: FaBullhorn,
                description: 'Advertisement settings'
            },
            {
                key: 'blog',
                label: 'Blog',
                icon: FiEdit,
                description: 'Blog settings & categories'
            }
        ];

        const getCurrentSectionTitle = () => {
            const currentItem = settingsMenuItems.find(item => item.key === this.state.step);
            return currentItem ? currentItem.label : 'Settings';
        };

        return (
            <div className="min-h-screen bg-slate-50 px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                            <div className="flex items-center mt-1 text-sm text-slate-500">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                <span>Configure your platform</span>
                            </div>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                            {getCurrentSectionTitle()}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-slate-200 p-4">
                            <div className="space-y-1">
                                {settingsMenuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = this.state.step === item.key;
                                    return (
                                        <div
                                            key={item.key}
                                            onClick={() => this.setStep(item.key)}
                                            className={`cursor-pointer rounded-lg p-3 transition-all duration-200 group ${
                                                isActive 
                                                    ? 'bg-slate-800 text-white shadow-sm' 
                                                    : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                                                    isActive ? 'bg-white/10' : 'bg-slate-100 group-hover:bg-slate-200'
                                                }`}>
                                                    <Icon className={`w-4 h-4 ${
                                                        isActive ? 'text-white' : 'text-slate-600'
                                                    }`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium ${
                                                        isActive ? 'text-white' : 'text-slate-900'
                                                    }`}>
                                                        {item.label}
                                                    </p>
                                                    <p className={`text-xs mt-0.5 ${
                                                        isActive ? 'text-slate-300' : 'text-slate-500'
                                                    }`}>
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg border border-slate-200">
                            {/* Content Header */}
                            <div className="border-b border-slate-200 px-6 py-4">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {getCurrentSectionTitle()}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    {settingsMenuItems.find(item => item.key === this.state.step)?.description}
                                </p>
                            </div>
                            
                            {/* Dynamic Content */}
                            <div className="p-6">
                                {this.state.step == 'websiteSettings' && <WebsiteSettings />}
                                {this.state.step == 'subscriptionsSettings' && <SubscriptionSetting />}
                                {this.state.step == 'socialSettings' && <SocialSettings />}
                                {this.state.step == 'analytics' && <AnalyticsSettings />}
                                {this.state.step == 'pages' && <PagesSettings />}
                                {this.state.step == 'ads' && <AdsSettings />}
                                {this.state.step == 'blog' && <BlogSettings />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Settings;
