import React, { Component } from 'react';
import Logo from '../../../assets/logo/logo.png';
import conf from '../../../conf/configuration';

import './Plans.scss';
import '../../CustomPage/CustomPage.scss';
import { getPageByName, getPages, getWebsiteDetails, getSocialLinks, getWebsiteData, getSubscriptionStatus } from '../../../firestore/dbOperations';
import Checkout from './Checkout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { AuthContext } from '../../../main'; // Import AuthContext
import HomepagePricing from '../../Dashboard2/elements/HomepagePricing';
import { trackEvent, trackEngagement } from '../../../utils/ga4';
import i18n from '../../../i18n';
import HomepageFooter from '../../Dashboard2/elements/HomepageFooter';
import HomepageNavbar from '../../Dashboard2/elements/HomepageNavbar';

class Billing extends Component {
    static contextType = AuthContext; // Set contextType to AuthContext
    constructor(props) {
        super(props);
        this.state = {
            pages: [],
            websiteName: '',
            websiteDescription: '',
            pageContent: '',
            socialLinks: null,
            step: 0,
            monthly: null,
            quartarly: null,
            yearly: null,
            selectedPlan: null,
            isLoading: true,
            onlyPP: false,
            currency: '',
        };
        this.customStyles();
        this.stripePromise = loadStripe(conf.stripe_publishable_key);
        window.location.pathname.substring(0, 14) == '/billing/plans' && this.customStyles();
        this.customStyles = this.customStyles.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
    }

    // Helper function to convert currency symbols to proper currency codes
    getCurrencyCode(currency) {
        if (!currency) return 'USD'; // Default to USD if no currency provided

        // Convert common currency symbols to ISO currency codes
        const currencyMap = {
            $: 'USD',
            '€': 'EUR',
            '£': 'GBP',
            '¥': 'JPY',
            '₹': 'INR',
            C$: 'CAD',
            A$: 'AUD',
            CHF: 'CHF',
            USD: 'USD',
            EUR: 'EUR',
            GBP: 'GBP',
            JPY: 'JPY',
            INR: 'INR',
            CAD: 'CAD',
            AUD: 'AUD',
        };

        return currencyMap[currency] || 'INR'; // Default to USD if currency not found
    }

    nextStep(plan) {
        // Track plan selection
        trackEvent('plan_selected', 'Billing', plan, 1);
        trackEngagement('checkout_started', {
            plan_type: plan,
            step: 'plan_selection',
        });

        this.setState((prevState) => ({
            step: prevState.step + 1,
            selectedPlan: plan,
        }));
    }
    previousStep() {
        this.setState((prevState) => ({
            step: prevState.step - 1,
        }));
    }
    // Giving the proper stylicn for custom pages
    customStyles() {
        document.getElementById('root').style.overflow = 'unset';
    }
    componentDidMount() {
        // Track page view for billing page
        trackEvent('page_view', 'Billing', 'Plans page visited');

        getPages().then((value) => this.setState({ pages: value }));
        getWebsiteData().then((value) => {
            value !== null &&
                this.setState({
                    websiteName: value.title,
                    websiteDescription: value.description,
                });
        });
        getSocialLinks().then((value) => {
            value !== null && this.setState({ socialLinks: value });
        });
        getSubscriptionStatus().then((data) => {
            this.setState({
                monthly: data.monthlyPrice,
                quartarly: data.quartarlyPrice,
                yearly: data.yearlyPrice,
                onlyPP: data.onlyPP,
                currency: data.currency,
            });
        });

        // Log user status from context
        console.log('User in Plans.js:', this.context);
    }
    componentWillMount() {
        // Check which language
        if (localStorage.getItem('language')) {
            this.handleLanguageClick(localStorage.getItem('language'));
        } else {
            // this.handleLanguageClick('en')
        }
    }
    // Handle language click
    handleLanguageClick(language) {
        i18n.changeLanguage(language);
        this.setState({ language: language });
        localStorage.setItem('language', language);
    }

    // function to render the navbar

    renderNavbar() {
        const { t } = this.props;
        return (
            <div className="custom-page__nav">
                <a>
                    <img className="custom-page__nav__logo" src={Logo} />
                </a>
                <ul className="custom-page__navlinks">
                    <li>
                        {' '}
                        <Link className="custom-page__navlinks" to={{ pathname: '/' }}>
                            {t('billing.navbar.home')}
                        </Link>{' '}
                    </li>
                    {this.state.pages !== null &&
                        this.state.pages.map((value, index) => {
                            return (
                                <li key={index}>
                                    {' '}
                                    <Link className="custom-page__navlinks" to={{ pathname: '/p/' + value.id }}>
                                        {value.id}
                                    </Link>{' '}
                                </li>
                            );
                        })}
                    <li>
                        {' '}
                        <Link className="custom-page__navlinks" to={{ pathname: '/contact' }}>
                            {t('billing.navbar.contact')}
                        </Link>{' '}
                    </li>
                </ul>
                <div className="custom-page__nav__action">
                    <Link to={{ pathname: '/' }}>{t('billing.navbar.home')}</Link>
                </div>
            </div>
        );
    }
    render() {
        const { t } = this.props;

        // Get the converted currency code first
        const convertedCurrency = this.getCurrencyCode(this.state.currency);

        // PayPal configuration options
        const paypalOptions = {
            'client-id': conf.paypalClientID,
            currency: convertedCurrency,
            intent: 'capture',
            'disable-funding': 'credit,card',
        };

        // Debug PayPal configuration
        console.log('=== PayPal Currency Debug ===');
        console.log('Original currency from state:', this.state.currency);
        console.log('Converted currency code:', convertedCurrency);
        console.log('PayPal Options:', paypalOptions);
        console.log('PayPal Client ID:', conf.paypalClientID);
        console.log('=== End Debug ===');

        // Only render PayPal provider if we have a valid client ID
        if (!conf.paypalClientID || conf.paypalClientID === 'YOUR_PAYPAL_CLIENT_ID') {
            console.error('PayPal Client ID is not configured properly');
            return (
                <Elements stripe={this.stripePromise}>
                    <div className="custom-page">
                        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg m-4">
                            <h3 className="text-red-800 font-semibold">PayPal Configuration Error</h3>
                            <p className="text-red-600">PayPal Client ID is not configured. Please check your configuration.</p>
                        </div>
                    </div>
                </Elements>
            );
        }

        return (
            <PayPalScriptProvider options={paypalOptions} deferLoading={false}>
                <Elements stripe={this.stripePromise}>
                    <div className="custom-page">
                        {/* Navbar */}
                        {/* {this.renderNavbar()} */}

                        <HomepageNavbar user={this.props.user} />

                        {/* Page Content */}
                        <div className="custom-page__content w-full">
                            <div className="custom-page__Plans w-full">
                                {this.state.step == 0 && (
                                    // <PlansTable currency={this.state.currency} monthly={this.state.monthly} quartarly={this.state.quartarly} yearly={this.state.yearly} nextStep={this.nextStep} />
                                    <HomepagePricing nextStep={this.nextStep} />
                                )}
                                {this.state.step == 1 && (
                                    <ElementsConsumer>
                                        {({ stripe, elements }) => (
                                            <Checkout
                                                currency={this.state.currency}
                                                currencyCode={this.getCurrencyCode(this.state.currency)}
                                                onlyPP={this.state.onlyPP}
                                                previousStep={this.previousStep}
                                                stripe={stripe}
                                                elements={elements}
                                                monthly={this.state.monthly}
                                                quartarly={this.state.quartarly}
                                                yearly={this.state.yearly}
                                                selectedPlan={this.state.selectedPlan}
                                            />
                                        )}
                                    </ElementsConsumer>
                                )}
                            </div>
                        </div>
                        {/* Page Footer */}
                        <HomepageFooter />
                    </div>
                </Elements>
            </PayPalScriptProvider>
        );
    }
}

const MyComponent = withTranslation('common')(Billing);
export default MyComponent;
