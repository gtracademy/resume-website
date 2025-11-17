import React, { useState, useEffect, useContext } from 'react';
import { withTranslation } from 'react-i18next';
import { FiGrid, FiSettings, FiFileText, FiBarChart, FiMousePointer, FiDownload, FiSearch, FiChevronLeft, FiChevronRight, FiSun, FiMoon, FiSidebar, FiX, FiUser, FiShield } from 'react-icons/fi';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { FaRegComments, FaBriefcase, FaBuilding } from 'react-icons/fa';
import { FaListCheck } from 'react-icons/fa6';
import logo from '../../../assets/logo/logo.png';
import userPlaceholder from '../../../assets/user.png';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { checkIsEmployer } from '../../../firestore/dbOperations';
import { AuthContext } from '../../../main';
import NotificationPanel from './NotificationPanel';
import { useUnreadMessages } from '../../../hooks/useUnreadMessages';
import { useUnreadNotifications } from '../../../hooks/useUnreadNotifications';
import conf from '../../../conf/configuration';

const ProfileDisplay = ({ profile, image, user, t, onSidebarToggle, sidebarCollapsed }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [isEmployer, setIsEmployer] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation(); // Get current location
    const authUser = useContext(AuthContext); // Get authenticated user from context
    const { unreadCount } = useUnreadMessages(); // Get unread messages count
    const { unreadNotificationCount, refreshCount } = useUnreadNotifications(); // Get unread notifications count
    
    // Check if current user is admin
    const isAdmin = authUser?.email === conf.adminEmail;

    const toggleSidebar = () => {
        const newCollapsed = !sidebarCollapsed;
        if (onSidebarToggle) {
            onSidebarToggle(newCollapsed);
        }

        // Mobile body scroll prevention
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

        // Update content areas with proper margin adjustment
        const contentWrapper = document.querySelector('.dashboardContentWrapper');
        const dashboardGrid = document.querySelector('.dashboardGrid');

        // Apply sidebar-collapsed class to content containers
        const elementsToToggle = [contentWrapper, dashboardGrid].filter(Boolean);

        elementsToToggle.forEach((el) => {
            if (el) {
                if (newCollapsed) {
                    el.classList.add('sidebar-collapsed');
                } else {
                    el.classList.remove('sidebar-collapsed');
                }
            }
        });
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Set initial state based on localStorage or default to expanded
    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState) {
            const isCollapsed = savedState === 'true';
            if (onSidebarToggle) {
                onSidebarToggle(isCollapsed);
            }

            // Apply initial class to content areas
            const contentWrapper = document.querySelector('.dashboardContentWrapper');
            const dashboardGrid = document.querySelector('.dashboardGrid');

            const elementsToToggle = [contentWrapper, dashboardGrid].filter(Boolean);

            elementsToToggle.forEach((el) => {
                if (el) {
                    if (isCollapsed) {
                        el.classList.add('sidebar-collapsed');
                    } else {
                        el.classList.remove('sidebar-collapsed');
                    }
                }
            });
        }
    }, [onSidebarToggle]);

    // Save collapsed state to localStorage
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
    }, [sidebarCollapsed]);

    // Check if user is an employer
    useEffect(() => {
        if (user) {
            checkIsEmployer(user)
                .then((employerStatus) => {
                    setIsEmployer(employerStatus);
                })
                .catch((error) => {
                    console.error('Error checking employer status:', error);
                    setIsEmployer(false);
                });
        } else {
            setIsEmployer(false);
        }
    }, [user]);

    // Listen for notification updates and refresh count
    useEffect(() => {
        const handleNotificationsUpdated = () => {
            refreshCount();
        };

        window.addEventListener('notificationsUpdated', handleNotificationsUpdated);
        return () => {
            window.removeEventListener('notificationsUpdated', handleNotificationsUpdated);
        };
    }, [refreshCount]);

    // Debug avatar image sources
    useEffect(() => {
        console.log('Avatar Debug Info:');
        console.log('image?.image:', image?.image);
        console.log('authUser?.photoURL:', authUser?.photoURL);
        console.log('authUser:', authUser);
        console.log('Fallback order: image?.image || authUser?.photoURL || userPlaceholder');
    }, [image, authUser]);

    // Listen for mobile sidebar toggle events and window resize
    useEffect(() => {
        const handleMobileToggle = () => {
            toggleSidebar();
        };

        const handleResize = () => {
            // Clean up mobile body class on desktop
            if (window.innerWidth >= 1024) {
                document.body.classList.remove('mobile-sidebar-open');
            }
        };

        window.addEventListener('toggleMobileSidebar', handleMobileToggle);
        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('toggleMobileSidebar', handleMobileToggle);
            window.removeEventListener('resize', handleResize);
            document.body.classList.remove('mobile-sidebar-open');
        };
    }, []);

    return (
        <>
            {/* Custom styles for global content adjustment */}
            <style jsx="true" global="true">{`
                .dashboardContentWrapper,
                .dashboardGrid {
                    margin-left: 240px !important;
                    width: calc(100% - 240px) !important;
                    box-sizing: border-box !important;
                    transition: margin-left 0.3s ease, width 0.3s ease !important;
                }

                .dashboardContentWrapper.sidebar-collapsed,
                .dashboardGrid.sidebar-collapsed {
                    margin-left: 60px !important;
                    width: calc(100% - 60px) !important;
                }

                /* Remove the display: none for dashboardGridLeft as it may interfere with ProfileDisplay */

                /* Enhanced mobile sidebar animations with bounce effect */
                @media only screen and (max-width: 1023px) {
                    /* Smooth slide-in animation with slight bounce */
                    .mobile-sidebar-enter {
                        transform: translateX(-100%);
                        opacity: 0;
                    }

                    .mobile-sidebar-enter-active {
                        transform: translateX(0);
                        opacity: 1;
                        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease-out;
                    }

                    .mobile-sidebar-exit {
                        transform: translateX(0);
                        opacity: 1;
                    }

                    .mobile-sidebar-exit-active {
                        transform: translateX(-100%);
                        opacity: 0;
                        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease-in;
                    }

                    /* Better touch responsiveness on mobile */
                    .mobile-sidebar-touch {
                        will-change: transform;
                        -webkit-transform: translateZ(0);
                        transform: translateZ(0);
                    }

                    /* Improved mobile sidebar with hardware acceleration */
                    .mobile-sidebar {
                        transform: translateX(-100%);
                        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                        will-change: transform;
                        -webkit-transform: translateZ(0);
                        transform: translateZ(0);
                    }

                    .mobile-sidebar.open {
                        transform: translateX(0);
                    }
                }

                /* Tablet and smaller desktop responsive rules */
                @media only screen and (max-width: 1050px) {
                    .dashboardContentWrapper,
                    .dashboardGrid {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }

                    .dashboardContentWrapper.sidebar-collapsed,
                    .dashboardGrid.sidebar-collapsed {
                        margin-left: 60px !important;
                        width: calc(100% - 60px) !important;
                    }
                }

                /* Mobile responsive rules - remove sidebar margin completely */
                @media only screen and (max-width: 768px) {
                    .dashboardContentWrapper,
                    .dashboardGrid {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }

                    .dashboardContentWrapper.sidebar-collapsed,
                    .dashboardGrid.sidebar-collapsed {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }
                }

                /* Extra small mobile screens */
                @media only screen and (max-width: 480px) {
                    .dashboardContentWrapper,
                    .dashboardGrid,
                    .dashboardContentWrapper.sidebar-collapsed,
                    .dashboardGrid.sidebar-collapsed {
                        padding-left: 0 !important;
                        width: 100% !important;
                    }
                }

                /* Enhanced backdrop blur effect for mobile overlay */
                @media only screen and (max-width: 1023px) {
                    .mobile-overlay {
                        backdrop-filter: blur(4px);
                        -webkit-backdrop-filter: blur(4px);
                        background: rgba(0, 0, 0, 0.25);
                    }

                    /* Smooth overlay transitions */
                    .mobile-overlay-enter {
                        opacity: 0;
                        backdrop-filter: blur(0px);
                        -webkit-backdrop-filter: blur(0px);
                    }

                    .mobile-overlay-enter-active {
                        opacity: 1;
                        backdrop-filter: blur(4px);
                        -webkit-backdrop-filter: blur(4px);
                        transition: opacity 0.25s ease-out, backdrop-filter 0.3s ease-out;
                    }

                    /* Prevent body scroll when mobile sidebar is open */
                    body.mobile-sidebar-open {
                        overflow: hidden;
                        position: fixed;
                        width: 100%;
                    }
                }
            `}</style>

            {/* Mobile overlay when sidebar is open - reduced opacity and blur for better UX */}
            <div
                className={`fixed inset-0 bg-black mobile-overlay z-40 lg:hidden transition-all duration-300 ease-in-out ${!sidebarCollapsed ? 'opacity-25' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />

            <div
                className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 z-50 flex flex-col transition-all duration-300 ease-in-out ${
                    sidebarCollapsed ? 'w-[60px] min-w-[60px]' : 'w-[240px]'
                }
                /* Desktop behavior - always visible */
                lg:flex lg:shadow-none
                /* Mobile behavior - show/hide based on collapsed state */
                ${sidebarCollapsed ? 'max-lg:-translate-x-full' : 'max-lg:translate-x-0 shadow-2xl lg:shadow-none'}
                `}>
                {/* Top Header Section */}
                <div className={`transition-all duration-300 ${sidebarCollapsed ? 'p-3' : 'px-4 py-4'}`}>
                    {sidebarCollapsed ? (
                        // Collapsed view - maintain same spacing as expanded view
                        <div className="space-y-5">
                            {/* First item: just the sidebar toggle (centered like the expanded logo section) */}
                            <div className="flex justify-center">
                                <button onClick={toggleSidebar} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                                    <GoSidebarCollapse className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Second item: Mini Profile Avatar (same spacing as profile card in expanded view) */}
                            <div className="flex justify-center">
                                <div className="relative cursor-pointer" onClick={toggleSidebar}>
                                    <div className="w-10 h-10 rounded-full ring-1 ring-gray-200 overflow-hidden">
                                        <img
                                            src={image?.image || authUser?.photoURL || userPlaceholder}
                                            alt="User Avatar"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.log('Avatar image failed to load, falling back to placeholder');
                                                e.target.src = userPlaceholder;
                                            }}
                                        />
                                    </div>
                                    {/* Mini Notification Badge */}
                                    {unreadNotificationCount > 0 && (
                                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gray-900 text-white text-[10px] leading-none rounded-full flex items-center justify-center font-medium border border-white/80">
                                            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                                        </div>
                                    )}
                                    {/* Mini Online Status */}
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white/90"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Expanded view
                        <div className="space-y-5">
                            {/* Logo and Window Controls */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/*  Logo */}
                                    <Link to="/">
                                        <img src={logo} alt="Logo" className="w-[120px]" />
                                    </Link>
                                </div>
                                {/* Window Controls */}
                                <div className="flex items-center gap-2">
                                    <button onClick={toggleSidebar} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200">
                                        <GoSidebarExpand className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Profile Card */}
                            <div className="bg-white p-3 rounded-lg flex items-center gap-3 overflow-visible border border-gray-200 shadow-sm">
                                <div
                                    className="relative flex-shrink-0 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowNotifications(!showNotifications);
                                    }}>
                                    <div className="w-12 h-12 rounded-full ring-1 ring-gray-200 overflow-hidden">
                                        <img
                                            src={image?.image || authUser?.photoURL || userPlaceholder}
                                            alt="User Avatar"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.log('Avatar image failed to load, falling back to placeholder');
                                                e.target.src = userPlaceholder;
                                            }}
                                        />
                                    </div>
                                    {/* Notification Badge */}
                                    {unreadNotificationCount > 0 && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center font-medium border border-white/90">
                                            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                                        </div>
                                    )}
                                    {/* Online Status Indicator */}
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate mb-1">
                                        {authUser?.email || profile?.email || 'user@example.com'}
                                    </p>
                                    {profile?.membership ? (
                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-800 bg-gray-100 rounded-md border border-gray-200">
                                            <span className="w-1 h-1 bg-gray-500 rounded-full mr-1.5"></span>
                                            {profile.membership}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md border border-gray-200">
                                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-1.5"></span>
                                            Free Plan
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto">
                    {/* Navigation Section */}
                    {!sidebarCollapsed && (
                        <div className="px-4 py-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{t('JobsUpdate.ProfileDisplay2.navigation')}</p>
                        </div>
                    )}

                    <div className="px-2">
                        <Link to="/dashboard">
                            <div
                                className={`flex items-center text-sm transition-all duration-200 rounded-lg mb-1 ${
                                    location.pathname === '/dashboard' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                } ${sidebarCollapsed ? 'p-2.5 justify-center' : 'p-2.5'}`}>
                                <FiGrid className={`text-lg min-w-[20px] ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span className="flex-1">{t('JobsUpdate.ProfileDisplay2.menu.dashboard', 'Dashboard')}</span>}
                            </div>
                        </Link>

                        {/* Show Admin Panel only for admin users */}
                        {isAdmin && (
                            <Link to="/adm">
                                <div
                                    className={`flex items-center text-sm transition-all duration-200 rounded-lg mb-1 ${
                                        location.pathname.startsWith('/adm') ? 'bg-red-100 text-red-900 font-medium' : 'text-red-600 hover:bg-red-50 hover:text-red-800'
                                    } ${sidebarCollapsed ? 'p-2.5 justify-center' : 'p-2.5'}`}>
                                    <FiShield className={`text-lg min-w-[20px] ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
                                    {!sidebarCollapsed && <span className="flex-1">{t('JobsUpdate.ProfileDisplay2.menu.adminPanel', 'Admin Panel')}</span>}
                                </div>
                            </Link>
                        )}

                        <Link to="/dashboard/interview">
                            <div
                                className={`flex items-center text-sm transition-all duration-200 rounded-lg mb-1 ${
                                    location.pathname === '/dashboard/interview' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                } ${sidebarCollapsed ? 'p-2.5 justify-center' : 'p-2.5'}`}>
                                <FaRegComments className={`text-lg min-w-[20px] ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span className="flex-1">{t('JobsUpdate.ProfileDisplay2.menu.interviews', 'Interviews')}</span>}
                            </div>
                        </Link>

                        <Link to="/dashboard/portfolios">
                            <div
                                className={`flex items-center text-sm transition-all duration-200 rounded-lg mb-1 ${
                                    location.pathname === '/dashboard/portfolios' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                } ${sidebarCollapsed ? 'p-2.5 justify-center' : 'p-2.5'}`}>
                                <FiFileText className={`text-lg min-w-[20px] ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span className="flex-1">{t('JobsUpdate.ProfileDisplay2.menu.portfolios', 'Portfolios')}</span>}
                            </div>
                        </Link>

                        <Link to="/dashboard/applied-jobs">
                            <div
                                className={`flex items-center text-sm transition-all duration-200 rounded-lg mb-1 ${
                                    location.pathname === '/dashboard/applied-jobs' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                } ${sidebarCollapsed ? 'p-2.5 justify-center' : 'p-2.5'}`}>
                                <FaBriefcase className={`text-lg min-w-[20px] ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span className="flex-1">{t('JobsUpdate.ProfileDisplay2.menu.appliedJobs', 'Applied Jobs')}</span>}
                            </div>
                        </Link>

                        {/* Messages */}
                        <Link to="/dashboard/messages">
                            <div
                                className={`flex items-center text-sm transition-all duration-200 rounded-lg mb-1 ${
                                    location.pathname === '/dashboard/messages' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                } ${sidebarCollapsed ? 'p-2.5 justify-center' : 'p-2.5'}`}>
                                <FaRegComments className={`text-lg min-w-[20px] ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
                                {!sidebarCollapsed && (
                                    <>
                                        <span className="flex-1">{t('JobsUpdate.ProfileDisplay2.menu.messages', 'Messages')}</span>
                                        {unreadCount > 0 && (
                                            <span className="ml-2 bg-gray-900 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] h-4 flex items-center justify-center">{unreadCount}</span>
                                        )}
                                    </>
                                )}
                            </div>
                        </Link>

                        {/* Show My Employments only for employers */}
                        {isEmployer && (
                            <Link to="/dashboard/my-employments">
                                <div
                                    className={`flex items-center text-sm transition-all duration-200 rounded-lg mb-1 ${
                                        location.pathname === '/dashboard/my-employments' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    } ${sidebarCollapsed ? 'p-2.5 justify-center' : 'p-2.5'}`}>
                                    <FaBriefcase className={`text-lg min-w-[20px] ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
                                    {!sidebarCollapsed && <span className="flex-1">{t('JobsUpdate.ProfileDisplay2.menu.myJobs', 'My Jobs')}</span>}
                                </div>
                            </Link>
                        )}

                        {/* Show My Companies only for employers */}
                        {isEmployer && (
                            <Link to="/dashboard/my-companies">
                                <div
                                    className={`flex items-center text-sm transition-all duration-200 rounded-lg mb-1 ${
                                        location.pathname === '/dashboard/my-companies' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    } ${sidebarCollapsed ? 'p-2.5 justify-center' : 'p-2.5'}`}>
                                    <FaBuilding className={`text-lg min-w-[20px] ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
                                    {!sidebarCollapsed && <span className="flex-1">{t('JobsUpdate.ProfileDisplay2.menu.myCompanies', 'My Companies')}</span>}
                                </div>
                            </Link>
                        )}

                        <Link to="/dashboard/settings">
                            <div
                                className={`flex items-center text-sm transition-all duration-200 rounded-lg mb-1 ${
                                    location.pathname === '/dashboard/settings' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                } ${sidebarCollapsed ? 'p-2.5 justify-center' : 'p-2.5'}`}>
                                <FiSettings className={`text-lg min-w-[20px] ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span className="flex-1">{t('JobsUpdate.ProfileDisplay2.menu.settings', 'Settings')}</span>}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Notification Panel */}
            <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} sidebarCollapsed={sidebarCollapsed} />
        </>
    );
};

export default withTranslation('common')(ProfileDisplay);
