import React, { Component } from 'react';
import './DashboardMain.scss';
import conf from '../../../conf/configuration';
import { Link, Route, Routes } from 'react-router-dom';
import Toasts from '../../Toasts/Toats';
import fire from '../../../conf/fire';
import ProfileDisplay from '../ProfileDisplay/ProfileDisplay';
import { FaBars } from 'react-icons/fa';

import { getFullName, getAds } from '../../../firestore/dbOperations';
// Animation Library
import { motion, AnimatePresence, transform } from 'framer-motion';
import { withTranslation } from 'react-i18next';
import { trackEvent, trackUserLogin, trackEngagement } from '../../../utils/ga4';

import { getWebsiteData } from '../../../firestore/dbOperations';

import DashboardToast from '../DashboardToast/DashboardToast';
import DashboardHomepage from '../DashboardHomepage/DashboardHomepage';
import DashboardSettings from '../DashboardSettings/DashboardSettings';
import DashboardFavourites from '../DashboardFavourites/DashboardFavourites';
import DashboardInterviews from '../DashboardInterviews/DashboardInterviews';
import DashboardPortfolios from '../DashboardPortfolios/DashboardPortfolios';
import DashboardJobMatching from '../DashbaordJobMatching/DashboardJobMatching';
import AppliedJobs from '../../AppliedJobs/AppliedJobs';
import EmployerDashboard from '../EmployerDashboard/EmployerDashboard';
import CompaniesManagement from '../EmployerDashboard/CompaniesManagement';
import DashboardMessages from '../DashboardMessages/DashboardMessages';
import i18n from '../../../i18n';
class DashboardMain extends Component {
    constructor(props) {
        super(props);
        this.authListener = this.authListener.bind(this);
        this._isMounted = false;
        this.unsubscribeAuth = null;
        this.state = {
            user: null,
            role: 'user',
            toast: {
                isShowed: false,
                type: '', // success , error , warning
                title: '',
                text: '',
            },
            membership: '',
            firstname: '',
            lastname: '',
            displayDocuments: [],
            fetchedDocuments: [],
            activeNav: 'Dashboard',
            isDeleteToastShowed: false,
            isDropdownShowed: false,
            isCommingSoonShowed: false,
            pageNumber: 1,
            perPage: 2,
            isSettingsShowed: false,
            isAdsManagerShowed: false,
            isDashboardShowed: true,
            isAddPagesShowed: false,
            isFavoritesShowed: false,
            sidebarCollapsed: false,
            // Meta data
            metaDataFetched: false,
            websiteTitle: '',
            websiteDescription: '',
            profile: {},
            websiteKeywords: '',
        };
        this.dropdownHandler = this.dropdownHandler.bind(this);
        this.settingsClickHandler = this.settingsClickHandler.bind(this);
        this.handleAdsClick = this.handleAdsClick.bind(this);
        this.handlePagesClick = this.handlePagesClick.bind(this);
        this.logout = this.logout.bind(this);
        this.showFavorites = this.showFavorites.bind(this);
        this.isSettingsPath = this.isSettingsPath.bind(this);
        this.handleSidebarToggle = this.handleSidebarToggle.bind(this);

        this.showToast = this.showToast.bind(this);
    }

    /// Check if the user is authenticated
    authListener() {
        this.unsubscribeAuth = fire.auth().onAuthStateChanged((user) => {
            if (!this._isMounted) return; // Prevent state updates if component is unmounted

            if (user) {
                this.setState({ user: user.uid });

                // Track user login
                trackUserLogin('firebase');
                trackEngagement('dashboard_access', { user_id: user.uid });

                getFullName(user.uid).then((value) => {
                    if (!this._isMounted) return; // Prevent state updates if component is unmounted
                    value !== undefined &&
                        this.setState({
                            firstname: value.firstname,
                            lastname: value.lastname,
                            membership: value.membership,
                            profile: value.profile,
                        });
                });
                localStorage.setItem('user', user.uid);
                /// Checking if user ad
                if (user.email === conf.adminEmail) {
                    this.setState({ role: 'admin' });
                    getAds();
                }
            } else {
                this.setState({ user: null });
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        });
    }
    // Show Drop down
    dropdownHandler() {
        this.setState((prevState, props) => ({
            isDropdownShowed: !prevState.isDropdownShowed,
        }));
    }
    // Handle Settings Click
    settingsClickHandler() {
        this.setState((prevState, props) => ({
            isSettingsShowed: !prevState.isSettingsShowed,
            isAdsManagerShowed: false,
        }));
    }

    // Handle Ads Click
    handleAdsClick() {
        this.setState((prevState, props) => ({
            isSettingsShowed: false,
            activeNav: 'Ads Manager',
            isDashboardShowed: false,
            isAdsManagerShowed: true,
        }));
    }
    // Handle Ads Click
    handlePagesClick() {
        this.setState((prevState, props) => ({
            isSettingsShowed: false,
            activeNav: 'Pages',
            isDashboardShowed: false,
            isAdsManagerShowed: false,
            isAddPagesShowed: true,
        }));
    }
    // Logout
    logout() {
        // Track logout event
        trackEvent('logout', 'User', 'Dashboard logout');

        fire.auth().signOut();
        localStorage.removeItem('currentResumeId');
        localStorage.removeItem('currentResumeItem');
        this.currentResume = null;
    }
    // Handling cover letter click to show coming soon message
    handleCoverLetter() {
        setTimeout(() => {
            this.setState((prevStat, props) => ({
                isCommingSoonShowed: !prevStat.isCommingSoonShowed,
            }));
        }, 2000);
        this.setState((prevStat, props) => ({
            isCommingSoonShowed: !prevStat.isCommingSoonShowed,
        }));
    }

    //show toast with a message
    showToast = (type, title, text) => {
        this.setState({
            toast: {
                isShowed: true,
                type: type, // success , error , warning
                title: title,
                text: text,
            },
        });
        // hide toast after 3 seconds
        setTimeout(() => {
            this.setState({
                toast: {
                    isShowed: false,
                    type: '', // success , error , warning
                    title: '',
                    text: '',
                },
            });
        }, 1000);
    };
    // show favorites
    showFavorites = () => {
        // Track favorites interaction
        trackEvent('show_favorites', 'Dashboard', 'Favorites section toggled');

        this.setState((prevState, props) => ({
            isFavoritesShowed: !prevState.isFavoritesShowed,
        }));
    };

    // Handle sidebar toggle
    handleSidebarToggle(collapsed) {
        this.setState({ sidebarCollapsed: collapsed });
    }

    // Note: Language initialization is now handled globally in main.jsx
    // This method is kept for backward compatibility but does nothing
    initializeLanguage() {
        // Language initialization is now handled globally - no action needed
    }

    componentDidMount() {
        this._isMounted = true;
        this.authListener();

        // Initialize language from localStorage
        this.initializeLanguage();

        getWebsiteData().then((data) => {
            if (!this._isMounted) return; // Prevent state updates if component is unmounted
            this.setState({
                metaDataFetched: true,
                websiteTitle: data.title,
                websiteDescription: data.description,
                websiteKeywords: data.keywords,
            });
        });
        // set currentResumeItem to null
        // set currentResumeId to null
        localStorage.removeItem('currentResumeId');
        localStorage.removeItem('currentResumeItem');
    }

    componentWillUnmount() {
        this._isMounted = false;
        // Clean up Firebase auth listener
        if (this.unsubscribeAuth) {
            this.unsubscribeAuth();
        }
    }
    // a function that returns true if we are in this path /dashboard/settings
    isSettingsPath = () => {
        return window.location.pathname === '/dashboard/settings';
    };

    render() {
        const { t } = this.props;

        return this.state.user !== null ? (
            <div className="dashboardWrapper" style={{ overflow: 'hidden' }}>
                {/* Floating Mobile Sidebar Toggle */}
                <button
                    onClick={() => {
                        const newCollapsed = !this.state.sidebarCollapsed;
                        this.handleSidebarToggle(newCollapsed);
                        
                        // Handle mobile body scroll prevention
                        const isMobile = window.innerWidth < 1024;
                        if (isMobile) {
                            if (newCollapsed) {
                                // Remove the class to allow scrolling
                                document.body.classList.remove('mobile-sidebar-open');
                            } else {
                                // Add class to prevent scrolling
                                document.body.classList.add('mobile-sidebar-open');
                            }
                        }
                    }}
                    className="fixed top-4 left-4 z-40 lg:hidden w-10 h-10 bg-white border border-slate-200 rounded-lg shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors duration-200"
                    aria-label="Toggle sidebar"
                >
                    <FaBars className="w-4 h-4 text-slate-600" />
                </button>

                <AnimatePresence>
                    {this.state.isDeleteToastShowed && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Toasts type="Delete" />
                        </motion.div>
                    )}
                </AnimatePresence>
                <DashboardToast isShowed={this.state.toast.isShowed} type={this.state.toast.type} title={this.state.toast.title} text={this.state.toast.text} />

                <DashboardFavourites showFavorites={this.showFavorites} isFavoritesShowed={this.state.isFavoritesShowed} />

                <ProfileDisplay
                    user={this.state.user}
                    profile={{
                        name: this.state.firstname + ' ' + this.state.lastname,
                        email: this.state.profile?.email || '',
                        phone: this.state.profile?.phone || '',
                        address: this.state.profile?.address || '',
                        city: this.state.profile?.city || '',
                        country: this.state.profile?.country || '',
                        occupation: this.state.profile?.occupation || '',
                        membership: this.state.membership,
                    }}
                    image={this.state.profile}
                    sidebarCollapsed={this.state.sidebarCollapsed}
                    onSidebarToggle={this.handleSidebarToggle}
                />

                <div className={`dashboardContentWrapper ${this.state.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <div className="dashboardMainContent">
                        <Routes>
                            <Route
                                index
                                element={
                                    <DashboardHomepage
                                        profile={{
                                            name: this.state.firstname + ' ' + this.state.lastname,
                                            email: this.state.profile?.email || '',
                                            phone: this.state.profile?.phone || '',
                                            address: this.state.profile?.address || '',
                                            city: this.state.profile?.city || '',
                                            country: this.state.profile?.country || '',
                                            occupation: this.state.profile?.occupation || '',
                                        }}
                                        showFavorites={this.showFavorites}
                                        showToast={this.showToast}
                                        sidebarCollapsed={this.state.sidebarCollapsed}
                                        handleSidebarToggle={this.handleSidebarToggle}
                                    />
                                }
                            />
                            <Route path="settings" element={<DashboardSettings showToast={this.showToast} sidebarCollapsed={this.state.sidebarCollapsed} handleSidebarToggle={this.handleSidebarToggle} />} />
                            <Route path="messages" element={<DashboardMessages showToast={this.showToast} sidebarCollapsed={this.state.sidebarCollapsed} handleSidebarToggle={this.handleSidebarToggle} />} />     
                            <Route path="favorites" element={<DashboardFavourites showToast={this.showToast} />} />
                            <Route path="interview" element={<DashboardInterviews showToast={this.showToast} sidebarCollapsed={this.state.sidebarCollapsed} handleSidebarToggle={this.handleSidebarToggle} />} />
                            <Route path="portfolios" element={<DashboardPortfolios showToast={this.showToast} sidebarCollapsed={this.state.sidebarCollapsed} handleSidebarToggle={this.handleSidebarToggle} />} />
                            <Route path="applied-jobs" element={<AppliedJobs showToast={this.showToast} sidebarCollapsed={this.state.sidebarCollapsed} handleSidebarToggle={this.handleSidebarToggle} />} />
                            <Route path="my-employments" element={<EmployerDashboard showToast={this.showToast} sidebarCollapsed={this.state.sidebarCollapsed} handleSidebarToggle={this.handleSidebarToggle} />} />
                            <Route path="my-companies" element={<CompaniesManagement showToast={this.showToast} sidebarCollapsed={this.state.sidebarCollapsed} />} />
                            <Route path="job-matching" element={<DashboardJobMatching showToast={this.showToast} sidebarCollapsed={this.state.sidebarCollapsed} />} />
                        </Routes>
                    </div>
                </div>
            </div>
        ) : (
            ' '
        );
    }
}
const MyComponent = withTranslation('common')(DashboardMain);
export default MyComponent;
