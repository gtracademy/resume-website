import React, { Component } from 'react';
import './Login.scss';
import GoogleImage from '../../../assets/google.png';
import FacebookImage from '../../../assets/facebook.png';
import Input from '../../Form/simple-input/SimpleInput';
import fire, { googleProvider, facebookProvider } from '../../../conf/fire';
import addUser from '../../../firestore/auth';
import { withTranslation } from 'react-i18next';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
        this.handleInputs = this.handleInputs.bind(this);
        this.login = this.login.bind(this);
        this.signInWithGoogle = this.signInWithGoogle.bind(this);
        this.signInWithFacebook = this.signInWithFacebook.bind(this);
    }

    handleInputs(title, value) {
        switch (title) {
            case "Email":
                this.setState({ email: value });
                break;
            case "Password":
                this.setState({ password: value });
                break;
            default:
                break;
        }
    }

    async login(event) {
        event.preventDefault();
        try {
            await fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
            this.props.closeModal();
        } catch (error) {
            console.log(error);
            this.props.throwError(error.message);
        }
    }

    async signInWithGoogle() {
        try {
            const result = await fire.auth().signInWithPopup(googleProvider);
            const user = result.user;
            await addUser(user.uid, "Welcome", "back", user.email);
            this.props.closeModal();
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                alert('This email is already used with a different login method. Please use that method.');
            } else {
                console.log(error);
                this.props.throwError(error.message);
            }
        }
    }

    async signInWithFacebook() {
        try {
            const result = await fire.auth().signInWithPopup(facebookProvider);
            const user = result.user;
            await addUser(user.uid, "Welcome", "back", user.email);
            this.props.closeModal();
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                alert('This email is already used with a different login method. Please use that method.');
            } else {
                console.log(error);
                this.props.throwError(error.message);
            }
        }
    }

    render() {
        const { t } = this.props;
        return (
            <div className="auth">
                <div className="head">
                    <span>{t("login.login")}</span>
                </div>
                <div className="body">
                    <div className="socialAuth">
                        {/* Google Login */}
                        <div onClick={this.signInWithGoogle} className="googleAuthItem">
                            <img src={GoogleImage} alt="Google Login" />
                            <span>{t("login.googleLogin")} Google</span>
                        </div>
                        {/* Facebook Login */}
                        <div onClick={this.signInWithFacebook} className="facebookAuthItem">
                            <img src={FacebookImage} alt="Facebook Login" />
                            <span>{t("login.facebookLogin")} Facebook</span>
                        </div>
                        {/* Divider */}
                        <div className="devider">
                            <hr />
                            <span>{t("login.or")}</span>
                        </div>
                        {/* Email/Password Login Form */}
                        <form onSubmit={this.login}>
                            <div>
                                <Input
                                    name="Email"
                                    title={t("login.email")}
                                    handleInputs={this.handleInputs}
                                />
                            </div>
                            <div>
                                <Input
                                    name="Password"
                                    type="Password"
                                    title={t("login.password")}
                                    handleInputs={this.handleInputs}
                                />
                            </div>
                            <input className="inputSubmit" value={t("login.login")} type="submit" />
                        </form>
                    </div>
                </div>
                {/* Modal Footer */}
                <div className="modalFooter">
                    <span>
                        {t("login.dontHaveAcc")} 
                        <a onClick={this.props.handleNavigationClick}>{t("login.signup")}</a>
                    </span>
                    <span>
                        {t("login.passwordLost")} 
                        <a onClick={this.props.showPasswordRecovery}>{t("login.recoverPassword")}</a>
                    </span>
                </div>
            </div>
        );
    }
}

export default withTranslation('common')(Login);
