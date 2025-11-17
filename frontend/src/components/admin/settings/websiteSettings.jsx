import React, { Component } from 'react';
import { getWebsiteData, settWebsiteData } from '../../../firestore/dbOperations';
import { FaCheck, FaTimes, FaGlobe, FaTag, FaLanguage, FaFileAlt } from 'react-icons/fa';

class WebsiteSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            websiteTitle: '',
            websiteDescription: '',
            websiteKeywords: '',
            defaultLan: 'English', // Initialize with default value to prevent undefined
            isSuccesShowed: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.saveWebsiteMetaData = this.saveWebsiteMetaData.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
    }
    componentDidMount() {
        this.state.websiteTitle == '' &&
            getWebsiteData().then((data) => {
                this.setState({ websiteTitle: data.title, websiteDescription: data.description, websiteKeywords: data.keywords, defaultLan: data.language || 'English' });
            });
    }
    handleChange(event, inputName) {
        switch (inputName) {
            case 'websiteTitle':
                this.setState({ websiteTitle: event.target.value });
                break;
            case 'websiteDescription':
                this.setState({ websiteDescription: event.target.value });
                break;
            case 'websiteKeywords':
                this.setState({ websiteKeywords: event.target.value });
                break;
            default:
                break;
        }
    }
    saveWebsiteMetaData() {
        // Ensure no undefined values are passed to Firebase
        const title = this.state.websiteTitle || '';
        const description = this.state.websiteDescription || '';
        const keywords = this.state.websiteKeywords || '';
        const language = this.state.defaultLan || 'English';
        
        settWebsiteData(title, description, keywords, language);
        
        // Trigger a custom event to notify MetaManager components to refresh
        window.dispatchEvent(new CustomEvent('websiteMetadataUpdated', {
            detail: { title, description, keywords, language }
        }));
        
        this.setState({ isSuccesShowed: true });
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
            this.setState({ isSuccesShowed: false });
        }, 3000);
    }
    handleLanguageChange(event) {
        this.setState({ defaultLan: event.target.value });
    }
    render() {
        return (
            <div className="space-y-6">
                {/* Success Alert */}
                {this.state.isSuccesShowed && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <FaCheck className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-emerald-800">Settings saved successfully!</p>
                                <p className="text-xs text-emerald-600 mt-1">Your website metadata has been updated.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => this.setState({ isSuccesShowed: false })}
                            className="text-emerald-400 hover:text-emerald-600 transition-colors p-1 rounded">
                            <FaTimes className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Settings Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Website Title */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                <FaGlobe className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-900">Website Title</label>
                                <p className="text-xs text-slate-500">The main title of your website</p>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="Enter your website title"
                            value={this.state.websiteTitle}
                            onChange={(event) => this.handleChange(event, 'websiteTitle')}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400"
                        />
                    </div>

                    {/* Website Description */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                <FaFileAlt className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-900">Website Description</label>
                                <p className="text-xs text-slate-500">Brief description for search engines and social media</p>
                            </div>
                        </div>
                        <textarea
                            placeholder="Describe your website in a few sentences..."
                            value={this.state.websiteDescription}
                            onChange={(event) => this.handleChange(event, 'websiteDescription')}
                            rows="4"
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400 resize-none"
                        />
                    </div>

                    {/* Keywords */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                <FaTag className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-900">SEO Keywords</label>
                                <p className="text-xs text-slate-500">Comma-separated keywords</p>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="resume, cv, template, professional"
                            value={this.state.websiteKeywords}
                            onChange={(event) => this.handleChange(event, 'websiteKeywords')}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-400"
                        />
                    </div>

                    {/* Default Language */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                <FaLanguage className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-900">Default Language</label>
                                <p className="text-xs text-slate-500">Primary language for your platform</p>
                            </div>
                        </div>
                        <select
                            value={this.state.defaultLan}
                            onChange={(event) => this.handleLanguageChange(event)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-slate-900">
                            <option value="" className="text-slate-400">Select Language</option>
                            <option value="English">🇺🇸 English</option>
                            <option value="Danish">🇩🇰 Danish</option>
                            <option value="Swedish">🇸🇪 Swedish</option>
                            <option value="Spanish">🇪🇸 Spanish</option>
                            <option value="Russian">🇷🇺 Russian</option>
                            <option value="French">🇫🇷 French</option>
                            <option value="Portuguese">🇵🇹 Portuguese</option>
                            <option value="German">🇩🇪 German</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <div className="flex items-center text-sm text-slate-500">
                        <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                        <span>Changes will be applied immediately</span>
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
                            onClick={() => this.saveWebsiteMetaData()}
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
export default WebsiteSettings;
