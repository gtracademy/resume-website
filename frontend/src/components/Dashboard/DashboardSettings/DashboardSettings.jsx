import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { uploadImageToFirebase, getProfileOfUser, addProfileToUser, getAccountInfo, changePassword } from '../../../firestore/dbOperations';
import { FaUser, FaCog, FaCamera, FaTrash, FaUserCircle, FaKey, FaCalendarAlt, FaEnvelope, FaCreditCard, FaUpload, FaCheckCircle, FaExclamationTriangle, FaBars } from 'react-icons/fa';

function DashboardSettings(props) {
    // State management
    const [selectedSettings, setSelectedSettings] = useState('Profile');

    // Function to toggle mobile sidebar
    const toggleMobileSidebar = () => {
        window.dispatchEvent(new CustomEvent('toggleMobileSidebar'));
    };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [accountSettings, setAccountSettings] = useState({
        email: '',
        password: '',
    });
    const [databaseAccountSettings, setDatabaseAccountSettings] = useState({
        email: '',
        membership: '',
        membershipEnds: '',
    });
    const [profile, setProfile] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        selectedImage: null,
    });
    const [isDragging, setIsDragging] = useState(false);
    const { t } = props;

    //  handle profile form submit and update the profile state
    const handleInputChange = (e) => {
        e.preventDefault();
        const field = e.target.name;
        const value = e.target.value;
        setProfile({
            ...profile,
            [field]: value,
        });
    };

    const handleAccountInputChange = (e) => {
        e.preventDefault();
        const field = e.target.name;
        const value = e.target.value;
        setAccountSettings({
            ...accountSettings,
            [field]: value,
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const imageFile = e.dataTransfer.files[0];
            const reader = new FileReader();

            if (imageFile.size > 30000) {
                const img = new Image();
                img.src = URL.createObjectURL(imageFile);
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 200;
                    canvas.height = img.height * (200 / img.width);
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg');
                    setProfile({
                        ...profile,
                        selectedImage: dataUrl,
                    });
                    await uploadImageToFirebase(dataUrl, localStorage.getItem('user'));
                    await getProfileOfUserFront();
                };
            } else {
                reader.onloadend = async () => {
                    setProfile({
                        ...profile,
                        selectedImage: reader.result,
                    });
                    await uploadImageToFirebase(reader.result, localStorage.getItem('user'));
                };
                reader.readAsDataURL(imageFile);
            }
        }
    };

    // handle image upload and resize it to 200px width
    // if image is larger than 30kb we scale it down to 30kb
    const handleImageUpload = (e) => {
        e.preventDefault();
        // get the image file
        const imageFile = e.target.files[0];
        // create a new FileReader
        const reader = new FileReader();
        // if the image is larger than 30kb we scale it down to 30kb
        if (imageFile.size > 30000) {
            // create a new image
            const img = new Image();
            // set the image src to the image file BLOB
            img.src = URL.createObjectURL(imageFile);
            // once the image loads
            img.onload = async () => {
                // create a canvas element
                const canvas = document.createElement('canvas');
                // set the canvas width to 200px
                canvas.width = 200;
                // set the canvas height to the image height
                canvas.height = img.height * (200 / img.width);
                // get the canvas context
                const ctx = canvas.getContext('2d');
                // draw the image on the canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // get the data url from the canvas
                const dataUrl = canvas.toDataURL('image/jpeg');
                // set the selected image state
                setProfile({
                    ...profile,
                    selectedImage: dataUrl,
                });

                await uploadImageToFirebase(dataUrl, localStorage.getItem('user'));
                await getProfileOfUserFront();
            };
        } else {
            // if the image is less than 30kb we just set the image state
            reader.onloadend = async () => {
                setProfile({
                    ...profile,
                    selectedImage: reader.result,
                });
                await uploadImageToFirebase(reader.result, localStorage.getItem('user'));
            };
            reader.readAsDataURL(imageFile);
        }
    };

    const getProfileOfUserFront = async () => {
        let profile = await getProfileOfUser(localStorage.getItem('user'));

        // add only the fields that are in profile to state
        setProfile({
            ...profile,
            name: profile.name ? profile.name : '',
            phone: profile.phone ? profile.phone : '',
            address: profile.address ? profile.address : '',
            city: profile.city ? profile.city : '',
            postalCode: profile.postalCode ? profile.postalCode : '',
            country: profile.country ? profile.country : '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await addProfileToUser(localStorage.getItem('user'), profile);
            if (result) {
                props.showToast('success', t('dashNew.profileUpdated'), t('dashNew.profileUpdatedDesc'));
            } else {
                props.showToast('error', 'Error', 'Profile could not be updated');
            }
        } catch (error) {
            props.showToast('error', 'Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAccountSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (accountSettings.password.length > 5) {
                await changePassword(accountSettings.password);
                props.showToast('success', t('dashNew.passChanged'), t('dashNew.passChangedDesc'));
                setAccountSettings({
                    ...accountSettings,
                    password: '',
                });
            } else {
                props.showToast('error', t('dashNew.passError'), t('dashNew.passErrorDesc'));
            }
        } catch (error) {
            props.showToast('error', 'Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAccountInfoFront = async () => {
        let accountInfo = await getAccountInfo(localStorage.getItem('user'));
        setDatabaseAccountSettings({
            ...databaseAccountSettings,
            email: accountInfo.email,
            membership: accountInfo.membership,
            membershipEnds: accountInfo.membershipEnds,
        });
    };

    // handle Password change
    const handleChangePassword = async () => {
        if (accountSettings.password.length > 5) {
            await changePassword(accountSettings.password);
            props.showToast('success', t('dashNew.passChanged'), t('dashNew.passChangedDesc'));
        } else {
            props.showToast('error', t('dashNew.passError'), t('dashNew.passErrorDesc'));
        }
    };

    useEffect(() => {
        getProfileOfUserFront();
        getAccountInfoFront();
    }, []);

    // Get password strength info
    const getPasswordStrength = (password) => {
        if (password.length < 6) return { strength: 'weak', width: 'w-1/4', color: 'bg-red-500', text: t('DashboardSettings.account.passwordStrength.weak') };
        if (password.length < 8) return { strength: 'fair', width: 'w-2/4', color: 'bg-yellow-500', text: t('DashboardSettings.account.passwordStrength.fair') };
        if (password.length < 10) return { strength: 'good', width: 'w-3/4', color: 'bg-blue-500', text: t('DashboardSettings.account.passwordStrength.good') };
        return { strength: 'strong', width: 'w-full', color: 'bg-green-500', text: t('DashboardSettings.account.passwordStrength.strong') };
    };

    const passwordStrength = getPasswordStrength(accountSettings.password);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className={`mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 max-w-none w-full transition-all duration-300 ${props.sidebarCollapsed ? '' : ''}`} style={{maxWidth: '1600px'}}>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <FaCog className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">{t('DashboardSettings.pageTitle')}</h1>
                                <p className="text-slate-600 text-sm mt-1">{t('DashboardSettings.pageDescription')}</p>
                            </div>
                        </div>

                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-1">
                        <nav className="flex space-x-1">
                            {[
                                { id: 'Profile', label: t('DashboardSettings.tabs.profile'), icon: FaUser },
                                { id: 'Account', label: t('DashboardSettings.tabs.account'), icon: FaCog },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedSettings(tab.id)}
                                        className={`flex-1 inline-flex items-center justify-center py-3 px-4 font-medium text-sm transition-all duration-200 rounded-md ${
                                            selectedSettings === tab.id 
                                                ? 'bg-slate-900 text-white shadow-sm' 
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}>
                                        <Icon className={`mr-2 h-4 w-4 ${selectedSettings === tab.id ? 'text-white' : 'text-slate-500'}`} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content Sections */}
                    {selectedSettings === 'Profile' ? (
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <FaUserCircle className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">{t('DashboardSettings.profile.title')}</h2>
                                    <p className="text-sm text-slate-600">{t('DashboardSettings.profile.description')}</p>
                                </div>
                            </div>

                            {/* Avatar Upload Section */}
                            <div
                                className={`mb-8 p-8 border-2 border-dashed rounded-lg transition-all duration-200 ${
                                    isDragging ? 'border-slate-400 bg-slate-100' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}>
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 border-4 border-white shadow-lg">
                                            {profile.image ? (
                                                <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-600">
                                                    <FaUser className="w-8 h-8 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center border-3 border-white shadow-md">
                                            <FaCamera className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <p className="text-sm font-semibold text-slate-900">{t('DashboardSettings.profile.uploadPicture')}</p>
                                        <p className="text-xs text-slate-600">{t('DashboardSettings.profile.dragOrUpload')}</p>
                                    </div>

                                    <div className="flex space-x-3">
                                        <label className="relative">
                                            <input type="file" onChange={handleImageUpload} className="sr-only" accept="image/*" />
                                            <span className="inline-flex items-center px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 cursor-pointer transition-colors duration-200">
                                                <FaUpload className="w-3.5 h-3.5 mr-2" />
                                                {t('DashboardSettings.profile.uploadButton')}
                                            </span>
                                        </label>

                                        <button className="inline-flex items-center px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:text-red-600 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
                                            <FaTrash className="w-3.5 h-3.5 mr-2" />
                                            {t('DashboardSettings.profile.removeButton')}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-900">{t('DashboardSettings.profile.fullName')}</label>
                                        <p className="text-xs text-slate-500">{t('DashboardSettings.profile.fullNameDesc')}</p>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm transition-colors duration-200"
                                            placeholder={t('DashboardSettings.profile.placeholders.fullName')}
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-900">{t('DashboardSettings.profile.phone')}</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm transition-colors duration-200"
                                            placeholder={t('DashboardSettings.profile.placeholders.phone')}
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-900">{t('DashboardSettings.profile.address')}</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={profile.address}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm transition-colors duration-200"
                                            placeholder={t('DashboardSettings.profile.placeholders.address')}
                                        />
                                    </div>

                                    {/* City */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-900">{t('DashboardSettings.profile.city')}</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={profile.city}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm transition-colors duration-200"
                                            placeholder={t('DashboardSettings.profile.placeholders.city')}
                                        />
                                    </div>

                                    {/* Postal Code */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-900">{t('DashboardSettings.profile.postalCode')}</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={profile.postalCode}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm transition-colors duration-200"
                                            placeholder={t('DashboardSettings.profile.placeholders.postalCode')}
                                        />
                                    </div>

                                    {/* Country */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-900">{t('DashboardSettings.profile.country')}</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={profile.country}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm transition-colors duration-200"
                                            placeholder={t('DashboardSettings.profile.placeholders.country')}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-colors duration-200 ${
                                            isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
                                        }`}>
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('dashNew.saving')}
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle className="w-4 h-4 mr-2" />
                                                {t('dashNew.saveChanges')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <FaCog className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">{t('DashboardSettings.account.title')}</h2>
                                    <p className="text-sm text-slate-600">{t('DashboardSettings.account.description')}</p>
                                </div>
                            </div>

                            <form onSubmit={handleAccountSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-slate-900">
                                            <FaEnvelope className="w-4 h-4 mr-2 text-slate-500" />
                                            {t('DashboardSettings.account.email')}
                                        </label>
                                        <p className="text-xs text-slate-500">{t('DashboardSettings.account.emailDesc')}</p>
                                        <input
                                            type="email"
                                            disabled
                                            value={databaseAccountSettings.email}
                                            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm bg-slate-50 text-slate-500 cursor-not-allowed text-sm"
                                        />
                                    </div>

                                    {/* Subscription */}
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-slate-900">
                                            <FaCreditCard className="w-4 h-4 mr-2 text-slate-500" />
                                            {t('DashboardSettings.account.subscription')}
                                        </label>
                                        <p className="text-xs text-slate-500">{t('DashboardSettings.account.subscriptionDesc')}</p>
                                        <input
                                            type="text"
                                            disabled
                                            value={databaseAccountSettings.membership || 'Free Plan'}
                                            className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm bg-slate-50 text-slate-500 cursor-not-allowed text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Subscription Details Card */}
                                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                                            <FaCalendarAlt className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-900">{t('DashboardSettings.account.subscriptionEnd')}</h3>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-3">{t('DashboardSettings.account.subscriptionEndDesc')}</p>
                                    <div className="text-sm font-medium text-slate-900 bg-white px-4 py-2 rounded-lg border border-slate-200">
                                        {databaseAccountSettings.membershipEnds
                                            ? new Date(databaseAccountSettings.membershipEnds.seconds * 1000).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                              })
                                            : t('DashboardSettings.account.noActiveSubscription')}
                                    </div>
                                </div>

                                {/* Password Change Section */}
                                <div className="space-y-6">
                                    <div className="border-t border-slate-200 pt-8">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="p-2 bg-slate-100 rounded-lg">
                                                <FaKey className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <h3 className="text-base font-semibold text-slate-900">{t('DashboardSettings.account.changePassword')}</h3>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-slate-900">{t('DashboardSettings.account.newPassword')}</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={accountSettings.password}
                                                onChange={handleAccountInputChange}
                                                className="block w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm transition-colors duration-200"
                                                placeholder={t('DashboardSettings.account.newPassword')}
                                            />

                                            {accountSettings.password && (
                                                <div className="mt-3">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                            <div className={`h-full transition-all duration-300 ${passwordStrength.width} ${passwordStrength.color}`}></div>
                                                        </div>
                                                        <span
                                                            className={`text-xs font-medium ${
                                                                passwordStrength.strength === 'weak'
                                                                    ? 'text-red-600'
                                                                    : passwordStrength.strength === 'fair'
                                                                    ? 'text-yellow-600'
                                                                    : passwordStrength.strength === 'good'
                                                                    ? 'text-slate-600'
                                                                    : 'text-green-600'
                                                            }`}>
                                                            {passwordStrength.text}
                                                        </span>
                                                    </div>

                                                    {accountSettings.password.length < 6 && (
                                                        <div className="flex items-center space-x-2 text-xs text-red-600">
                                                            <FaExclamationTriangle className="w-3 h-3" />
                                                            <span>{t('DashboardSettings.account.passwordRequirement')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || accountSettings.password.length < 6}
                                        className={`inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-colors duration-200 ${
                                            isSubmitting || accountSettings.password.length < 6
                                                ? 'bg-slate-400 cursor-not-allowed'
                                                : 'bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
                                        }`}>
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('dashNew.saving')}
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle className="w-4 h-4 mr-2" />
                                                {t('dashNew.saveChanges')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const MyComponent = withTranslation('common')(DashboardSettings);
export default MyComponent;
