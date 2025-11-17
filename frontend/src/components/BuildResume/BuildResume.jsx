import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Step Components (we'll create these)
import HeadingStep from './steps/HeadingStep';
import WorkHistoryStep from './steps/WorkHistoryStep';
import EducationStep from './steps/EducationStep';
import SkillsStep from './steps/SkillsStep';
import SummaryStep from './steps/SummaryStep';

// CV Templates
import Cv1 from '../../cv-templates/cv1/Cv1';
import Cv2 from '../../cv-templates/cv2/Cv2';
import Cv3 from '../../cv-templates/cv3/Cv3';
import Cv4 from '../../cv-templates/cv4/Cv4';
import Cv5 from '../../cv-templates/cv5/Cv5';
import Cv6 from '../../cv-templates/cv6/Cv6';
import Cv7 from '../../cv-templates/cv7/Cv7';
import Cv8 from '../../cv-templates/cv8/Cv8';
import Cv9 from '../../cv-templates/cv9/Cv9';
import Cv10 from '../../cv-templates/cv10/Cv10';
import Cv11 from '../../cv-templates/cv11/Cv11';
import Cv12 from '../../cv-templates/cv12/Cv12';
import Cv13 from '../../cv-templates/cv13/Cv13';
import Cv14 from '../../cv-templates/cv14/Cv14';
import Cv15 from '../../cv-templates/cv15/Cv15';
import Cv16 from '../../cv-templates/cv16/Cv16';
import Cv17 from '../../cv-templates/cv17/Cv17';
import Cv18 from '../../cv-templates/cv18/Cv18';
import Cv19 from '../../cv-templates/cv19/Cv19';
import Cv20 from '../../cv-templates/cv20/Cv20';
import Cv21 from '../../cv-templates/cv21/Cv21';
import Cv22 from '../../cv-templates/cv22/Cv22';
import Cv23 from '../../cv-templates/cv23/Cv23';
import Cv24 from '../../cv-templates/cv24/Cv24';
import Cv25 from '../../cv-templates/cv25/Cv25';
import Cv26 from '../../cv-templates/cv26/Cv26';
import Cv27 from '../../cv-templates/cv27/Cv27';
import Cv28 from '../../cv-templates/cv28/Cv28';
import Cv29 from '../../cv-templates/cv29/Cv29';
import Cv30 from '../../cv-templates/cv30/Cv30';
import Cv31 from '../../cv-templates/cv31/Cv31';
import Cv32 from '../../cv-templates/cv32/Cv32';
import Cv33 from '../../cv-templates/cv33/Cv33';
import Cv34 from '../../cv-templates/cv34/Cv34';
import Cv35 from '../../cv-templates/cv35/Cv35';
import Cv36 from '../../cv-templates/cv36/Cv36';
import Cv37 from '../../cv-templates/cv37/Cv37';
import Cv38 from '../../cv-templates/cv38/Cv38';
import Cv39 from '../../cv-templates/cv39/Cv39';
import Cv40 from '../../cv-templates/cv40/Cv40';
import Cv41 from '../../cv-templates/cv41/Cv41';
import Cv42 from '../../cv-templates/cv42/Cv42';
import Cv43 from '../../cv-templates/cv43/Cv43';
import Cv44 from '../../cv-templates/cv44/Cv44';
import Cv45 from '../../cv-templates/cv45/Cv45';
import Cv46 from '../../cv-templates/cv46/Cv46';
import Cv47 from '../../cv-templates/cv47/Cv47';
import Cv48 from '../../cv-templates/cv48/Cv48';
import Cv49 from '../../cv-templates/cv49/Cv49';
import Cv50 from '../../cv-templates/cv50/Cv50';
import Cv51 from '../../cv-templates/cv51/Cv51';

// Modal Components
import PreviewModal from './PreviewModal';
import TemplateSelectionModal from './TemplateSelectionModal';

// Import necessary modules for PDF export
import axios from 'axios';
import download from 'downloadjs';
import config from '../../conf/configuration';
import { setJsonPb, IncrementDownloads, addOneToNumberOfDocumentsDownloaded } from '../../firestore/dbOperations';
import { trackDownload, trackEvent, trackEngagement } from '../../utils/ga4';

// Import logo
import logo from '../../assets/logo/logo.png';

// Import Toasts component for subscription notifications
import Toasts from '../Toasts/Toats';

// Import animation library for toast animations
import { motion, AnimatePresence } from 'framer-motion';

// Import user membership functions
import { getUserMembership } from '../../firestore/paidOperations';
import { getSubscriptionStatus } from '../../firestore/dbOperations';
import fire from '../../conf/fire';

const BuildResume = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation('common');
    const [showPreview, setShowPreview] = useState(false);
    const [showTemplateSelection, setShowTemplateSelection] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState('Cv1');
    const [isDownloading, setIsDownloading] = useState(false);

    // Mobile responsiveness states
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

    // Layout mounting state to handle responsive layout timing
    const [isMounted, setIsMounted] = useState(false);

    // Toast notification states
    const [isSuccessToastVisible, setIsSuccessToastVisible] = useState(false);
    const [isDownloadToastVisible, setIsDownloadToastVisible] = useState(false);
    const [isUpgradeToastVisible, setIsUpgradeToastVisible] = useState(false);

    // User data state (similar to how other components handle it)
    const [userData, setUserData] = useState({
        user: null,
        membership: 'Basic', // Default to Basic
        subscriptionsStatus: null, // This will hold the global subscription status from /data/subscriptions
        membershipEnds: null,
    });

    const [resumeData, setResumeData] = useState({
        // Personal Information
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        occupation: '',
        country: '',
        city: '',
        address: '',
        postalcode: '',
        photo: null,

        // Work History
        employments: [],

        // Education
        educations: [],

        // Skills
        skills: [],

        // Languages
        languages: [],

        // Summary
        summary: '',

        // Progress tracking
        completedSteps: [],
    });

    // Fix for responsive layout timing issue when navigating from other pages
    useEffect(() => {
        // Set mounted state
        setIsMounted(true);

        // Force a layout recalculation after component mounts
        const forceLayoutRecalculation = () => {
            // Trigger a window resize event to force Tailwind responsive utilities to re-evaluate
            window.dispatchEvent(new Event('resize'));
        };

        // Use requestAnimationFrame to ensure DOM is fully rendered
        const timeout = setTimeout(() => {
            forceLayoutRecalculation();
        }, 50); // Slightly longer delay to ensure CSS is processed

        return () => {
            clearTimeout(timeout);
            setIsMounted(false);
        };
    }, [location.pathname]); // Re-run when route changes

    const steps = [
        {
            id: 1,
            name: t('BuildResume.steps.personalInfo'),
            path: 'heading',
            component: HeadingStep,
            icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            id: 2,
            name: t('BuildResume.steps.workHistory'),
            path: 'work-history',
            component: WorkHistoryStep,
            icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6.5l1.5 1.5H1.5L3 15.5V8a2 2 0 012-2h1zM8 5v1h4V5a1 1 0 00-1-1h-2a1 1 0 00-1 1z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            id: 3,
            name: t('BuildResume.steps.education'),
            path: 'education',
            component: EducationStep,
            icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
            ),
        },
        {
            id: 4,
            name: t('BuildResume.steps.skills'),
            path: 'skills',
            component: SkillsStep,
            icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        {
            id: 5,
            name: t('BuildResume.steps.summary'),
            path: 'summary',
            component: SummaryStep,
            icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
    ];

    const getCurrentStepIndex = () => {
        const currentPath = location.pathname;
        // Extract the step name from the current path (e.g., '/build-resume/heading' -> 'heading')
        const currentStep = currentPath.replace('/build-resume/', '').replace('/build-resume', '');
        console.log('Current path:', currentPath, 'Extracted step:', currentStep);
        const stepIndex = steps.findIndex((step) => step.path === currentStep);
        console.log('Step index found:', stepIndex);
        return stepIndex >= 0 ? stepIndex : 0; // Default to first step if no match
    };

    const currentStepIndex = getCurrentStepIndex();
    const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : steps[0];

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            const nextPath = `/build-resume/${steps[currentStepIndex + 1].path}`;
            console.log('Navigating to:', nextPath, 'Current step index:', currentStepIndex);
            navigate(nextPath);
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            const prevPath = `/build-resume/${steps[currentStepIndex - 1].path}`;
            navigate(prevPath);
        }
    };

    const handleStepClick = (stepPath) => {
        // Navigate using absolute path
        navigate(`/build-resume/${stepPath}`);
    };

    const isStepCompleted = (stepId) => {
        return resumeData.completedSteps.includes(stepId);
    };

    const updateResumeData = (newData) => {
        setResumeData((prev) => ({ ...prev, ...newData }));
    };

    // Template component mapping
    const getTemplateComponent = (templateId) => {
        const templateMap = {
            Cv1,
            Cv2,
            Cv3,
            Cv4,
            Cv5,
            Cv6,
            Cv7,
            Cv8,
            Cv9,
            Cv10,
            Cv11,
            Cv12,
            Cv13,
            Cv14,
            Cv15,
            Cv16,
            Cv17,
            Cv18,
            Cv19,
            Cv20,
            Cv21,
            Cv22,
            Cv23,
            Cv24,
            Cv25,
            Cv26,
            Cv27,
            Cv28,
            Cv29,
            Cv30,
            Cv31,
            Cv32,
            Cv33,
            Cv34,
            Cv35,
            Cv36,
            Cv37,
            Cv38,
            Cv39,
            Cv40,
            Cv41,
            Cv42,
            Cv43,
            Cv44,
            Cv45,
            Cv46,
            Cv47,
            Cv48,
            Cv49,
            Cv50,
            Cv51,
        };

        return templateMap[templateId] || Cv1; // Default to Cv1 if template not found
    };

    // Get user-friendly template name
    const getTemplateName = (templateId) => {
        const templateNames = {
            Cv1: t('BuildResume.templates.professionalClassic'),
            Cv2: t('BuildResume.templates.modernCreative'),
            Cv3: t('BuildResume.templates.creativeBold'),
            Cv4: t('BuildResume.templates.executivePro'),
            Cv5: t('BuildResume.templates.techModern'),
            Cv6: t('BuildResume.templates.simpleElegant'),
            Cv7: t('BuildResume.templates.designerSpecial'),
            Cv8: t('BuildResume.templates.cleanSimple'),
            Cv9: t('BuildResume.templates.corporateElite'),
            Cv10: t('BuildResume.templates.startupReady'),
            Cv11: t('BuildResume.templates.creativePro'),
            Cv12: t('BuildResume.templates.minimalPro'),
            Cv13: t('BuildResume.templates.businessClassic'),
            Cv14: t('BuildResume.templates.modernEdge'),
            Cv15: t('BuildResume.templates.artistPortfolio'),
            Cv16: t('BuildResume.templates.techInnovation'),
            Cv17: t('BuildResume.templates.executiveSuite'),
            Cv18: t('BuildResume.templates.creativeShowcase'),
            Cv19: t('BuildResume.templates.cleanProfessional'),
            Cv20: t('BuildResume.templates.futureForward'),
            Cv21: t('BuildResume.templates.professional21'),
            Cv22: t('BuildResume.templates.professional22'),
            Cv23: t('BuildResume.templates.professional23'),
            Cv24: t('BuildResume.templates.professional24'),
            Cv25: t('BuildResume.templates.professional25'),
            Cv26: t('BuildResume.templates.professional26'),
            Cv27: t('BuildResume.templates.professional27'),
            Cv28: t('BuildResume.templates.professional28'),
            Cv29: t('BuildResume.templates.professional29'),
            Cv30: t('BuildResume.templates.professional30'),
            Cv31: t('BuildResume.templates.professional31'),
            Cv32: t('BuildResume.templates.professional32'),
            Cv33: t('BuildResume.templates.professional33'),
            Cv34: t('BuildResume.templates.professional34'),
            Cv35: t('BuildResume.templates.professional35'),
            Cv36: t('BuildResume.templates.professional36'),
            Cv37: t('BuildResume.templates.professional37'),
            Cv38: t('BuildResume.templates.professional38'),
            Cv39: t('BuildResume.templates.professional39'),
            Cv40: t('BuildResume.templates.professional40'),
            Cv41: t('BuildResume.templates.professional41'),
            Cv42: t('BuildResume.templates.professional42'),
            Cv43: t('BuildResume.templates.professional43'),
            Cv44: t('BuildResume.templates.professional44'),
            Cv45: t('BuildResume.templates.professional45'),
            Cv46: t('BuildResume.templates.professional46'),
            Cv47: t('BuildResume.templates.professional47'),
            Cv48: t('BuildResume.templates.professional48'),
            Cv49: t('BuildResume.templates.professional49'),
            Cv50: t('BuildResume.templates.professional50'),
        };

        return templateNames[templateId] || templateId;
    };

    const handleTemplateSelect = (templateId) => {
        setCurrentTemplate(templateId);
        // Save to localStorage for persistence
        localStorage.setItem('selectedTemplate', templateId);

        // Update resume data with template's default colors if they exist
        // For templates with null colors (Cv21+), let them use their hardcoded defaults
        const templateColors = getTemplateDefaultColors(templateId);
        if (templateColors) {
            updateResumeData({ colors: templateColors });
        } else {
            // Remove colors from resumeData to let template use its hardcoded defaults
            const { colors, ...restData } = resumeData;
            setResumeData(restData);
        }

        // Show success feedback (you can replace this with a toast notification)
        console.log(t('BuildResume.analytics.templateChanged', { templateName: getTemplateName(templateId), templateId }));

        // You can add additional logic here like updating analytics, etc.
        // trackEvent('template_changed', 'Templates', templateId, 1);
    };

    // Load saved template and language on component mount
    React.useEffect(() => {
        // Initialize language from localStorage
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && savedLanguage !== i18n.language) {
            i18n.changeLanguage(savedLanguage);
        }

        const savedTemplate = localStorage.getItem('selectedTemplate');
        if (savedTemplate) {
            setCurrentTemplate(savedTemplate);
        }

        // Set default colors for the current template if they exist
        // For templates with null colors (Cv21+), let them use their hardcoded defaults
        const templateToUse = savedTemplate || currentTemplate;
        const templateColors = getTemplateDefaultColors(templateToUse);
        if (templateColors) {
            updateResumeData({ colors: templateColors });
        }
    }, []);

    // Get default colors for each template based on their actual defaults
    const getTemplateDefaultColors = (templateId) => {
        const templateColors = {
            Cv1: { primary: '#000000', secondary: '#f5f5f5' },
            Cv2: { primary: '#f0c30e', secondary: '#f5f5f5' },
            Cv3: { primary: '#be8a95', secondary: '#000000' },
            Cv4: { primary: '#3d3e42', secondary: '#3d3e42' },
            Cv5: { primary: '#000000', secondary: '#2d3039' },
            Cv6: { primary: '#000000', secondary: '#09043c' },
            Cv7: { primary: '#000000', secondary: '#f5f5f5' },
            Cv8: { primary: '#353f58', secondary: '#3d3e42' },
            Cv9: { primary: '#838383', secondary: '#000000' },
            Cv10: { primary: '#078dff', secondary: '#000000' },
            Cv11: { primary: '#86198f', secondary: '#fdf4ff' },
            Cv12: { primary: '#166534', secondary: '#f0fdf4' },
            Cv13: { primary: '#1e40af', secondary: '#eff6ff' },
            Cv14: { primary: '#b91c1c', secondary: '#fef2f2' },
            Cv15: { primary: '#9333ea', secondary: '#faf5ff' },
            Cv16: { primary: '#0d9488', secondary: '#f0fdfa' },
            Cv17: { primary: '#374151', secondary: '#f9fafb' },
            Cv18: { primary: '#f59e0b', secondary: '#fffbeb' },
            Cv19: { primary: '#3730a3', secondary: '#eef2ff' },
            Cv20: { primary: '#be185d', secondary: '#fdf2f8' },
            // Cv21-Cv50: No color initialization - let them use their hardcoded defaults
            Cv21: null,
            Cv22: null,
            Cv23: null,
            Cv24: null,
            Cv25: null,
            Cv26: null,
            Cv27: null,
            Cv28: null,
            Cv29: null,
            Cv30: null,
            Cv31: null,
            Cv32: null,
            Cv33: null,
            Cv34: null,
            Cv35: null,
            Cv36: null,
            Cv37: null,
            Cv38: null,
            Cv39: null,
            Cv40: null,
            Cv41: null,
            Cv42: null,
            Cv43: null,
            Cv44: null,
            Cv45: null,
            Cv46: null,
            Cv47: null,
            Cv48: null,
            Cv49: null,
            Cv50: null,
            Cv51: null,
        };

        return templateColors[templateId] || templateColors.Cv1;
    };

    // Create preview data ensuring arrays exist to prevent errors
    const getPreviewData = () => {
        const templateColors = getTemplateDefaultColors(currentTemplate);

        return {
            ...resumeData,
            // Ensure arrays exist to prevent component errors
            employments: resumeData.employments || [],
            // Transform skills from new format (skillName) to old format (name) for Cv1 compatibility
            skills: (resumeData.skills || []).map((skill, index) => ({
                name: skill.skillName || skill.name || '',
                rating: skill.rating || 50,
                date: skill.date || index + 1,
            })),
            educations: resumeData.educations || [],
            languages: resumeData.languages || [],
            // Include template-specific default colors
            colors: resumeData.colors || templateColors,
        };
    };

    // Show Toast function similar to BoardFilling.jsx
    const showToast = (type) => {
        if (type === 'Download') {
            setIsDownloadToastVisible(true);
            setTimeout(() => {
                setIsDownloadToastVisible(false);
            }, 8000);
        }
        if (type === 'Success') {
            setIsSuccessToastVisible(true);
            setTimeout(() => {
                setIsSuccessToastVisible(false);
            }, 8000);
        }
        if (type === 'Upgrade') {
            setIsUpgradeToastVisible(true);
            setTimeout(() => {
                setIsUpgradeToastVisible(false);
            }, 8000);
        }
    };

    // Enhanced Download PDF functionality with subscription verification
    const handleDownload = async () => {
        if (isDownloading) return;

        console.log('Download initiated. Global subscription status:', userData.subscriptionsStatus);
        console.log('User:', userData.user);
        console.log('User membership:', userData.membership);

        // Check if user is logged in first
        if (!userData.user) {
            console.log('User not logged in, showing login prompt');
            // Show alert and redirect to home page where they can log in
            alert(t('BuildResume.errors.loginRequired', 'Please log in to download your resume. You will be redirected to the login page.'));
            navigate('/');
            return;
        }

        // Check global subscription status first - if subscriptions are disabled globally, allow download
        // Handle both cases: subscriptionsStatus could be a boolean OR an object with .state property
        const isSubscriptionDisabled =
            userData.subscriptionsStatus === false || // Case 1: direct boolean value
            (userData.subscriptionsStatus && userData.subscriptionsStatus.state === false); // Case 2: object with state property

        if (isSubscriptionDisabled) {
            console.log('Global subscriptions disabled, allowing free download');
            showToast('Download');
            await performDownload();
            return;
        }

        // If global subscriptions are enabled, check user membership
        if (userData.membership === 'Premium') {
            console.log('Premium user, allowing download');
            showToast('Download');
            await performDownload();
        } else {
            // User is not premium and subscriptions are enabled, redirect to billing
            console.log('Non-premium user with subscriptions enabled, redirecting to billing');

            // Save the resume first (like in BoardFilling.jsx)
            try {
                // Generate resume ID if it doesn't exist
                if (!localStorage.getItem('currentResumeId')) {
                    localStorage.setItem('currentResumeId', Math.floor(Math.random() * 20000).toString() + 'xknd');
                }

                // Save resume data to database for export
                await setJsonPb(localStorage.getItem('currentResumeId'), getPreviewData());

                showToast('Success');
            } catch (error) {
                console.error('Error saving resume:', error);
            }

            // Show upgrade message and redirect after a short delay to let user see the message
            showToast('Upgrade');
            setTimeout(() => {
                window.location.href = '/billing/plans';
            }, 3000);
        }
    };

    // Separate function for actual download (only called for Premium users)
    const performDownload = async () => {
        setIsDownloading(true);

        try {
            // Generate resume ID if it doesn't exist
            if (!localStorage.getItem('currentResumeId')) {
                localStorage.setItem('currentResumeId', Math.floor(Math.random() * 20000).toString() + 'xknd');
            }

            // Save resume data to database for export
            await setJsonPb(localStorage.getItem('currentResumeId'), getPreviewData());

            // Increment download counter
            await IncrementDownloads();

            // Add to user's download count if user is logged in
            const user = localStorage.getItem('user');
            if (user) {
                await addOneToNumberOfDocumentsDownloaded(user);
            }

            // Make API call to generate PDF
            const response = await axios.post(
                `${config.provider}://${config.backendUrl}/api/export`,
                {
                    language: i18n.language, // Use current language from i18n
                    resumeId: localStorage.getItem('currentResumeId'),
                    resumeName: currentTemplate, // Using selected template
                },
                {
                    responseType: 'blob',
                }
            );

            // Track download analytics
            trackDownload(currentTemplate, 'resume');
            trackEvent('download_document', 'Documents', currentTemplate, 1);
            trackEngagement('document_downloaded', {
                template_name: currentTemplate,
                document_type: 'resume',
                user_id: user,
            });

            // Download the file
            const content = response.headers['content-type'];
            download(response.data, 'resume.pdf', content);
        } catch (error) {
            console.error('Download failed:', error);
            // Track download failure
            trackEvent('download_failed', 'Documents', currentTemplate, 0);
            alert(t('BuildResume.errors.downloadFailed'));
        } finally {
            setIsDownloading(false);
        }
    };

    // Fetch global subscription status on component mount
    React.useEffect(() => {
        // Fetch global subscription status first
        getSubscriptionStatus()
            .then((subscriptionData) => {
                console.log('Global subscription status:', subscriptionData);
                setUserData((prevData) => ({
                    ...prevData,
                    subscriptionsStatus: subscriptionData,
                }));
            })
            .catch((error) => {
                console.error('Error fetching subscription status:', error);
            });
    }, []);

    // Auth listener and user data fetching (similar to Welcome.jsx and DashboardMain.jsx)
    React.useEffect(() => {
        const authListener = fire.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is logged in
                console.log('User logged in:', user.uid);
                setUserData((prevData) => ({
                    ...prevData,
                    user: user.uid,
                }));
                localStorage.setItem('user', user.uid);

                // Fetch user membership information
                getUserMembership(user.uid)
                    .then((value) => {
                        if (value && value.membership) {
                            console.log('User membership data:', value);
                            setUserData((prevData) => ({
                                ...prevData,
                                membership: value.membership,
                                membershipEnds: value.membershipEnds ? value.membershipEnds.toDate() : null,
                            }));
                        } else {
                            console.log('No membership data found, defaulting to Basic');
                            setUserData((prevData) => ({
                                ...prevData,
                                membership: 'Basic',
                            }));
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching user membership:', error);
                        setUserData((prevData) => ({
                            ...prevData,
                            membership: 'Basic',
                        }));
                    });
            } else {
                // User is not logged in
                console.log('User not logged in');
                setUserData({
                    user: null,
                    membership: 'Basic',
                    subscriptionsStatus: null,
                    membershipEnds: null,
                });
                localStorage.removeItem('user');
            }
        });

        // Cleanup function
        return () => authListener();
    }, []); // Empty dependency array to run only on mount

    // Redirect to first step if on base path
    React.useEffect(() => {
        if (location.pathname === '/build-resume' || location.pathname === '/build-resume/') {
            navigate('/build-resume/heading');
        }
    }, [location.pathname, navigate]);

    const progressPercentage = Math.round((resumeData.completedSteps.length / steps.length) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
            {/* Toast Notifications */}
            <AnimatePresence>
                {isSuccessToastVisible && (
                    <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }} className="fixed top-6 right-6 z-50">
                        <Toasts type="Success" />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isDownloadToastVisible && (
                    <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }} className="fixed top-6 right-6 z-50">
                        <Toasts type="Download" />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isUpgradeToastVisible && (
                    <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }} className="fixed top-6 right-6 z-50">
                        <Toasts type="Upgrade" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Header - Only visible on mobile */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 px-4 py-3 z-30 flex items-center justify-between">
                {/* Mobile Menu Button */}
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg" aria-label="Open navigation menu">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Logo */}
                <Link to="/">
                    <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                </Link>

                {/* Mobile Preview Button */}
                <button onClick={() => setIsMobilePreviewOpen(true)} className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg" aria-label="Open resume preview">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-30"
                        onClick={() => setIsMobileMenuOpen(false)}>
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl"
                            onClick={(e) => e.stopPropagation()}>
                            {/* Mobile Navigation Header */}
                            <div className="px-4 py-6 border-b border-slate-100 flex justify-between items-center">
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                                    <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                                </Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Mobile Steps Navigation */}
                            <div className="flex-1 px-3 py-4 overflow-y-auto">
                                <nav className="space-y-1">
                                    {steps.map((step, index) => {
                                        const isActive = currentStep.id === step.id;
                                        const isCompleted = isStepCompleted(step.id);
                                        const isPrevious = index < currentStepIndex;

                                        return (
                                            <button
                                                key={step.id}
                                                onClick={() => {
                                                    handleStepClick(step.path);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`w-full flex items-center text-left p-3 rounded-lg transition-all duration-200 group relative ${
                                                    isActive
                                                        ? 'bg-blue-50 border border-blue-200 text-blue-900 shadow-sm'
                                                        : isCompleted || isPrevious
                                                        ? 'text-slate-700 hover:bg-slate-50 hover:border-slate-200 border border-transparent'
                                                        : 'text-slate-400 hover:text-slate-600 border border-transparent'
                                                }`}
                                                disabled={!isCompleted && !isPrevious && !isActive}
                                                aria-current={isActive ? 'step' : undefined}>
                                                <div className="flex items-center">
                                                    {/* Step Icon/Number */}
                                                    <div
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold mr-3 transition-all duration-200 ${
                                                            isActive
                                                                ? 'bg-blue-600 text-white shadow-sm'
                                                                : isCompleted
                                                                ? 'bg-green-500 text-white'
                                                                : isPrevious
                                                                ? 'bg-slate-200 text-slate-600'
                                                                : 'bg-slate-100 text-slate-400'
                                                        }`}>
                                                        {isCompleted ? (
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            step.icon
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-sm font-medium block truncate">{step.name}</span>
                                                        {isActive && <span className="text-xs text-blue-600">{t('BuildResume.navigation.current')}</span>}
                                                        {isCompleted && !isActive && <span className="text-xs text-green-600">✓</span>}
                                                    </div>
                                                </div>

                                                {/* Active indicator */}
                                                {isActive && <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>}
                                            </button>
                                        );
                                    })}
                                </nav>

                                {/* Mobile Progress Section */}
                                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-slate-700">{t('BuildResume.progress.progress')}</span>
                                        <span className="text-sm font-bold text-slate-900">{progressPercentage}%</span>
                                    </div>

                                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${progressPercentage}%` }}></div>
                                    </div>

                                    <p className="text-xs text-slate-600">
                                        {resumeData.completedSteps.length}/{steps.length} {t('BuildResume.progress.completed')}
                                    </p>
                                </div>
                            </div>

                            {/* Mobile User Status and Actions */}
                            <div className="px-4 py-4 border-t border-slate-200 bg-white">
                                {/* User Status */}
                                {userData.user && (
                                    <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-800">Plan:</span>
                                            <span
                                                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                                    userData.membership === 'Premium' ||
                                                    userData.subscriptionsStatus === false ||
                                                    (userData.subscriptionsStatus && userData.subscriptionsStatus.state === false)
                                                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200/80'
                                                        : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200/80'
                                                }`}>
                                                {userData.subscriptionsStatus === false || (userData.subscriptionsStatus && userData.subscriptionsStatus.state === false)
                                                    ? 'Free Access'
                                                    : userData.membership}
                                                {(userData.membership === 'Premium' ||
                                                    userData.subscriptionsStatus === false ||
                                                    (userData.subscriptionsStatus && userData.subscriptionsStatus.state === false)) && <span className="ml-1">✓</span>}
                                            </span>
                                        </div>
                                        {userData.membership === 'Basic' &&
                                            userData.subscriptionsStatus !== false &&
                                            !(userData.subscriptionsStatus && userData.subscriptionsStatus.state === false) && (
                                                <button
                                                    onClick={() => {
                                                        window.location.href = '/billing/plans';
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    className="w-full mt-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
                                                    Upgrade to Premium
                                                </button>
                                            )}
                                        {(userData.subscriptionsStatus === false || (userData.subscriptionsStatus && userData.subscriptionsStatus.state === false)) && (
                                            <div className="w-full mt-2 text-sm text-center text-green-700 font-semibold">🎉 Free downloads enabled</div>
                                        )}
                                    </div>
                                )}

                                {/* Mobile Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            setShowTemplateSelection(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center justify-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>{t('BuildResume.preview.changeTemplate')}</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowPreview(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full border border-slate-300 text-slate-700 py-3 px-4 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-sm flex items-center justify-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        <span>{t('BuildResume.preview.viewFullSize')}</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            handleDownload();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        disabled={isDownloading}
                                        className={`w-full py-3 px-4 font-medium transition-all duration-200 text-sm rounded-lg flex items-center justify-center space-x-2 ${
                                            isDownloading
                                                ? 'border border-slate-300 text-slate-400 cursor-not-allowed'
                                                : 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400'
                                        }`}>
                                        {isDownloading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="hidden sm:inline">{t('BuildResume.navigation.downloading')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                <span className="hidden sm:inline">{t('BuildResume.navigation.download')}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Preview Overlay */}
            <AnimatePresence>
                {isMobilePreviewOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-30"
                        onClick={() => setIsMobilePreviewOpen(false)}>
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl"
                            onClick={(e) => e.stopPropagation()}>
                            {/* Mobile Preview Header */}
                            <div className="px-4 py-4 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">{t('BuildResume.preview.livePreview')}</h3>
                                    <p className="text-xs text-slate-600 mt-1">{getTemplateName(currentTemplate)}</p>
                                </div>
                                <button onClick={() => setIsMobilePreviewOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Mobile Resume Preview */}
                            <div className="flex-1 px-4 py-4 overflow-y-auto">
                                {/* Preview Window */}
                                <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                    {/* Preview Header */}
                                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-2.5 flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            </div>
                                            <div className="text-white text-xs font-medium ml-2">{t('BuildResume.preview.resumePdf')}</div>
                                        </div>
                                    </div>

                                    {/* Resume Content */}
                                    <div className="relative h-80 overflow-hidden bg-gradient-to-br from-slate-50 to-gray-50">
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setShowPreview(true);
                                                setIsMobilePreviewOpen(false);
                                            }}
                                            style={{ transform: 'scale(0.35)', transformOrigin: 'top left', width: '285%', height: '285%' }}>
                                            {(() => {
                                                try {
                                                    const TemplateComponent = getTemplateComponent(currentTemplate);
                                                    return <TemplateComponent values={getPreviewData()} language={i18n.language} />;
                                                } catch (error) {
                                                    console.error('Error rendering template:', error);
                                                    return (
                                                        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                                                            <div className="text-center">
                                                                <div className="text-sm">{t('BuildResume.errors.templateError')}</div>
                                                                <div className="text-xs mt-1">{t('BuildResume.errors.usingDefault')}</div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>

                                    {/* Progress indicator */}
                                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-3 py-2 border-t border-slate-200">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600">{t('BuildResume.progress.completeness')}</span>
                                            <span className="text-blue-600 font-semibold">{progressPercentage}%</span>
                                        </div>
                                        <div className="mt-1 w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${progressPercentage}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Action Buttons */}
                                <div className="mt-4 space-y-2">
                                    <button
                                        onClick={() => {
                                            setShowTemplateSelection(true);
                                            setIsMobilePreviewOpen(false);
                                        }}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center justify-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>{t('BuildResume.preview.changeTemplate')}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowPreview(true);
                                            setIsMobilePreviewOpen(false);
                                        }}
                                        className="w-full border border-slate-300 text-slate-700 py-2.5 px-4 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-sm flex items-center justify-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        <span>{t('BuildResume.preview.viewFullSize')}</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Sidebar - Steps Navigation - Desktop Optimized */}
            <div className={`${isMounted ? 'hidden md:flex md:flex-col' : 'hidden'} w-64 bg-white border-r border-slate-200 shadow-sm min-h-screen flex-shrink-0`}>
                {/* Header */}
                <div className="px-4 py-6 border-b border-slate-100 flex-shrink-0 flex justify-center">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                    </Link>
                </div>

                {/* Steps Navigation */}
                <div className="flex-1 px-3 py-4 overflow-y-auto">
                    <nav className="space-y-1">
                        {steps.map((step, index) => {
                            const isActive = currentStep.id === step.id;
                            const isCompleted = isStepCompleted(step.id);
                            const isPrevious = index < currentStepIndex;

                            return (
                                <button
                                    key={step.id}
                                    onClick={() => handleStepClick(step.path)}
                                    className={`w-full flex items-center text-left p-2 rounded-lg transition-all duration-200 group relative ${
                                        isActive
                                            ? 'bg-blue-50 border border-blue-200 text-blue-900 shadow-sm'
                                            : isCompleted || isPrevious
                                            ? 'text-slate-700 hover:bg-slate-50 hover:border-slate-200 border border-transparent'
                                            : 'text-slate-400 hover:text-slate-600 border border-transparent'
                                    }`}
                                    disabled={!isCompleted && !isPrevious && !isActive}
                                    aria-current={isActive ? 'step' : undefined}>
                                    <div className="flex items-center">
                                        {/* Step Icon/Number */}
                                        <div
                                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold mr-2 transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : isCompleted
                                                    ? 'bg-green-500 text-white'
                                                    : isPrevious
                                                    ? 'bg-slate-200 text-slate-600'
                                                    : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {isCompleted ? (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            ) : (
                                                step.icon
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-medium block truncate">{step.name}</span>
                                            {isActive && <span className="text-xs text-blue-600">{t('BuildResume.navigation.current')}</span>}
                                            {isCompleted && !isActive && <span className="text-xs text-green-600">✓</span>}
                                        </div>
                                    </div>

                                    {/* Active indicator */}
                                    {isActive && <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Progress Section */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-700">{t('BuildResume.progress.progress')}</span>
                            <span className="text-xs font-bold text-slate-900">{progressPercentage}%</span>
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                        </div>

                        <p className="text-xs text-slate-600">
                            {resumeData.completedSteps.length}/{steps.length} {t('BuildResume.progress.completed')}
                        </p>
                    </div>
                </div>

                <div className="px-4 py-4 border-t border-slate-200 bg-white flex-shrink-0">
                    {/* User Status */}
                    {userData.user && (
                        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-800">Plan:</span>
                                <span
                                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                        userData.membership === 'Premium' || userData.subscriptionsStatus === false || (userData.subscriptionsStatus && userData.subscriptionsStatus.state === false)
                                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200/80'
                                            : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200/80'
                                    }`}>
                                    {userData.subscriptionsStatus === false || (userData.subscriptionsStatus && userData.subscriptionsStatus.state === false) ? 'Free Access' : userData.membership}
                                    {(userData.membership === 'Premium' ||
                                        userData.subscriptionsStatus === false ||
                                        (userData.subscriptionsStatus && userData.subscriptionsStatus.state === false)) && <span className="ml-1">✓</span>}
                                </span>
                            </div>
                            {userData.membership === 'Basic' && userData.subscriptionsStatus !== false && !(userData.subscriptionsStatus && userData.subscriptionsStatus.state === false) && (
                                <button
                                    onClick={() => (window.location.href = '/billing/plans')}
                                    className="w-full mt-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
                                    Upgrade to Premium
                                </button>
                            )}
                            {(userData.subscriptionsStatus === false || (userData.subscriptionsStatus && userData.subscriptionsStatus.state === false)) && (
                                <div className="w-full mt-2 text-sm text-center text-green-700 font-semibold">🎉 Free downloads enabled</div>
                            )}
                        </div>
                    )}

                    {/* Footer Links */}
                    <div className="space-y-2">
                        <a href="#" className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium group">
                            <svg className="w-4 h-4 mr-2 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>{t('BuildResume.sidebar.helpSupport')}</span>
                        </a>
                        <a href="#" className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium group">
                            <svg className="w-4 h-4 mr-2 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                            <span>{t('BuildResume.sidebar.privacyPolicy')}</span>
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-xs text-slate-400 pt-4 mt-4 border-t border-slate-200/80">{t('BuildResume.sidebar.copyright')}</div>
                </div>
            </div>

            {/* Main Content Area - Responsive Center Section */}
            <div className="flex-1 flex flex-col min-h-full pt-16 md:pt-0 relative z-10 min-w-0">
                {/* Main Form Content */}
                <div className="flex-1 bg-white flex flex-col">
                    {/* Scrollable content area */}
                    <div className="flex-1 overflow-y-auto bg-slate-50">
                        <div className="min-h-full">
                            <Routes>
                                <Route path="heading" element={<HeadingStep resumeData={resumeData} updateResumeData={updateResumeData} />} />
                                <Route path="work-history" element={<WorkHistoryStep resumeData={resumeData} updateResumeData={updateResumeData} />} />
                                <Route path="education" element={<EducationStep resumeData={resumeData} updateResumeData={updateResumeData} />} />
                                <Route path="skills" element={<SkillsStep resumeData={resumeData} updateResumeData={updateResumeData} />} />
                                <Route path="summary" element={<SummaryStep resumeData={resumeData} updateResumeData={updateResumeData} />} />
                                <Route path="" element={<HeadingStep resumeData={resumeData} updateResumeData={updateResumeData} />} />
                            </Routes>
                        </div>
                    </div>

                    {/* Navigation Footer - Fixed at bottom with improved visibility */}
                    <div className="bg-white border-t border-slate-200 px-4 md:px-6 py-3 md:py-4 flex-shrink-0 relative z-10">
                        <div className="flex justify-between items-center max-w-4xl mx-auto">
                            {/* Left side - Progress indicator - Hidden on mobile */}
                            <div className="hidden md:flex items-center space-x-3">
                                <div className="text-xs text-slate-600">{t('BuildResume.progress.step', { current: currentStepIndex + 1, total: steps.length })}</div>
                                <div className="flex items-center space-x-1">
                                    {steps.map((_, index) => (
                                        <div key={index} className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${index <= currentStepIndex ? 'bg-blue-500' : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                            </div>

                            {/* Mobile progress indicator */}
                            <div className="md:hidden flex items-center space-x-2">
                                <span className="text-xs font-medium text-slate-600">
                                    {currentStepIndex + 1}/{steps.length}
                                </span>
                                <div className="flex items-center space-x-1">
                                    {steps.map((_, index) => (
                                        <div key={index} className={`w-2 h-2 rounded-full transition-all duration-200 ${index <= currentStepIndex ? 'bg-blue-500' : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                            </div>

                            {/* Right side - Action buttons */}
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentStepIndex === 0}
                                    className="flex items-center px-2 md:px-3 py-2 border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs rounded-lg">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span className="hidden sm:inline">{t('BuildResume.navigation.previous')}</span>
                                </button>

                                {/* Mobile Menu and Preview buttons - Only on mobile */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    className="md:hidden flex items-center px-2 py-2 border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-xs rounded-lg">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => setIsMobilePreviewOpen(true)}
                                    className="md:hidden flex items-center px-2 py-2 border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-xs rounded-lg">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>

                                {/* Desktop Preview Button */}
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="hidden md:flex items-center px-3 py-2 border border-blue-300 text-blue-700 font-medium hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 text-xs rounded-lg">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    {t('BuildResume.navigation.preview')}
                                </button>

                                {/* Download Button */}
                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className={`flex items-center px-2 md:px-3 py-2 font-medium transition-all duration-200 text-xs rounded-lg ${
                                        isDownloading
                                            ? 'border border-slate-300 text-slate-400 cursor-not-allowed'
                                            : 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400'
                                    }`}>
                                    {isDownloading ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-1"></div>
                                            <span className="hidden sm:inline">{t('BuildResume.navigation.downloading')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            <span className="hidden sm:inline">{t('BuildResume.navigation.download')}</span>
                                        </>
                                    )}
                                </button>

                                {/* Next/Complete Button */}
                                {currentStepIndex < steps.length - 1 ? (
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-xs shadow-md hover:shadow-lg">
                                        <span className="hidden sm:inline">{t('BuildResume.navigation.nextStep', { stepName: steps[currentStepIndex + 1]?.name })}</span>
                                        <span className="sm:hidden">Next</span>
                                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            /* Handle final submission */
                                        }}
                                        className="flex items-center px-3 md:px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 text-xs shadow-md hover:shadow-lg">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="hidden sm:inline">{t('BuildResume.navigation.complete')}</span>
                                        <span className="sm:hidden">Done</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Resume Preview - Improved Desktop Support */}
            <div className="hidden lg:flex w-80 bg-white border-l border-slate-200 flex-col min-h-screen flex-shrink-0">
                {/* Simplified Header Section */}
                <div className="px-4 py-4 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">{t('BuildResume.preview.livePreview')}</h3>
                            <p className="text-xs text-slate-600 mt-1">{getTemplateName(currentTemplate)}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-slate-600">{t('BuildResume.preview.autoUpdating')}</span>
                        </div>
                    </div>
                </div>

                {/* Resume Preview - Scrollable */}
                <div className="flex-1 px-4 py-4 overflow-y-auto">
                    {/* Preview Window */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        {/* Enhanced Preview Header */}
                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-2.5 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                </div>
                                <div className="text-white text-xs font-medium ml-2">{t('BuildResume.preview.resumePdf')}</div>
                            </div>
                        </div>

                        {/* Resume Content with Loading State */}
                        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-slate-50 to-gray-50">
                            {/* Loading Overlay for better UX */}
                            <div className="absolute inset-0 bg-white bg-opacity-50 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <div onClick={() => setShowPreview(true)} className="cursor-pointer bg-white px-3 py-2 rounded-lg shadow-lg border">
                                    <span className="text-xs text-slate-600">{t('BuildResume.preview.clickToView')}</span>
                                </div>
                            </div>

                            <div
                                className="cursor-pointer transition-transform duration-200 group-hover:scale-105"
                                onClick={() => setShowPreview(true)}
                                style={{ transform: 'scale(0.35)', transformOrigin: 'top left', width: '285%', height: '285%' }}>
                                {(() => {
                                    try {
                                        const TemplateComponent = getTemplateComponent(currentTemplate);
                                        return <TemplateComponent values={getPreviewData()} language={i18n.language} />;
                                    } catch (error) {
                                        console.error('Error rendering template:', error);
                                        return (
                                            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                                                <div className="text-center">
                                                    <div className="text-sm">{t('BuildResume.errors.templateError')}</div>
                                                    <div className="text-xs mt-1">{t('BuildResume.errors.usingDefault')}</div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        </div>

                        {/* Progress indicator */}
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-3 py-2 border-t border-slate-200">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600">{t('BuildResume.progress.completeness')}</span>
                                <span className="text-blue-600 font-semibold">{progressPercentage}%</span>
                            </div>
                            <div className="mt-1 w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="mt-4 space-y-2">
                        <button
                            onClick={() => setShowTemplateSelection(true)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <span>{t('BuildResume.preview.changeTemplate')}</span>
                        </button>
                        <button
                            onClick={() => setShowPreview(true)}
                            className="w-full border border-slate-300 text-slate-700 py-2.5 px-4 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 text-sm flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            <span>{t('BuildResume.preview.viewFullSize')}</span>
                        </button>
                    </div>
                </div>

                {/* Enhanced Footer */}
                <div className="px-4 py-4 bg-white border-t border-slate-200 flex-shrink-0">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1.5 rounded-full border border-amber-200/80">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-slate-800 ml-1">4.9/5</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-700 font-semibold">{t('BuildResume.preview.trustedBy')}</p>
                        <p className="text-xs text-slate-500 mt-1">{t('BuildResume.preview.joinSuccess')}</p>
                    </div>
                </div>
            </div>

            {/* Modal Components */}
            <PreviewModal
                showPreview={showPreview}
                setShowPreview={setShowPreview}
                resumeData={getPreviewData()}
                onDownload={handleDownload}
                isDownloading={isDownloading}
                currentTemplate={currentTemplate}
                getTemplateComponent={getTemplateComponent}
                getTemplateName={getTemplateName}
            />

            <TemplateSelectionModal
                showModal={showTemplateSelection}
                setShowModal={setShowTemplateSelection}
                currentTemplate={currentTemplate}
                onTemplateSelect={handleTemplateSelect}
                resumeData={getPreviewData()}
            />
        </div>
    );
};

export default BuildResume;
