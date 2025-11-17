import React, { Component } from "react";
import "./LanguagePicker.scss";
import UsFlag from "../../../assets/countries/united-states.png";
import DenmarkFlag from "../../../assets/countries/denmark.png";
import SwedenFlag from "../../../assets/countries/sweden.png";
import SpainkFlag from "../../../assets/countries/spain.png";
import RussianFlag from "../../../assets/countries/russia.png";
import FranceFlag from "../../../assets/countries/france.png";
import PortugalFlag from "../../../assets/countries/portugal.png";
import GermanyFlag from "../../../assets/countries/germany.png";
import ItalyFlag from "../../../assets/countries/italy.png";
import GreeceFlag from "../../../assets/countries/greece.png";
import IcelandFlag from "../../../assets/countries/iceland.png";
import NorwayFlag from "../../../assets/countries/norway.png";
import PolandFlag from "../../../assets/countries/poland.png";
import RomaniaFlag from "../../../assets/countries/romania.png";
import NetherlandFlag from "../../../assets/countries/netherlands.png";

class LanguagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: "false",
      language: "en",
    };
    // Binding the function to this
    this.handleClick = this.handleClick.bind(this);
    this.closePicker = this.closePicker.bind(this);
  }
  // Handling the click on the language button to open/hide dropdown based on the state isOpen
  handleClick() {
    this.state.isOpen === "true"
      ? this.setState({ isOpen: "false" })
      : this.setState({ isOpen: "true" });
  }
  // Closing language picker
  closePicker() {
    this.setState({
      isOpen: false,
    });
  }
  render() {
    return (
      <div
        style={this.props.isHome ? { transform: "translateX(20px)" } : null}
        className="languagePickerWrapper"
      >
        {/* Current Language */}
        <div className="languagePicker">
          <img
            src={
              this.props.values.language === "en"
                ? UsFlag
                : this.props.values.language === "es"
                ? SpainkFlag
                : this.props.values.language === "fr"
                ? FranceFlag
                : this.props.values.language === "ru"
                ? RussianFlag
                : this.props.values.language === "dk"
                ? DenmarkFlag
                : this.props.values.language === "se"
                ? SwedenFlag
                : this.props.values.language == "de"
                ? GermanyFlag
                : this.props.values.language == "pt"
                ? PortugalFlag
                : this.props.values.language == "it"
                ? ItalyFlag
                : this.props.values.language == "gk"
                ? GreeceFlag
                : this.props.values.language == "is"
                ? IcelandFlag
                : this.props.values.language == "no"
                ? NorwayFlag
                : this.props.values.language == "pl"
                ? PolandFlag
                : this.props.values.language == "ro"
                ? RomaniaFlag
                : this.props.values.language == "nl"
                ? NetherlandFlag
                : UsFlag
            }
            alt="us"
          />
          <span onClick={this.handleClick} className="language">
            {this.props.values.language === "en"
              ? "English"
              : this.props.values.language === "es"
              ? "Spanish"
              : this.props.values.language === "fr"
              ? "French"
              : this.props.values.language === "ru"
              ? "Russian"
              : this.props.values.language === "dk"
              ? "Denmark"
              : this.props.values.language === "se"
              ? "Swedish"
              : this.props.values.language === "de"
              ? "German"
              : this.props.values.language == "pt"
              ? "Portuguese"
              : this.props.values.language == "it"
              ? "Italian"
              : this.props.values.language == "gk"
              ? "Greek"
              : this.props.values.language == "is"
              ? "Icelandic"
              : this.props.values.language == "no"
              ? "Norwegian"
              : this.props.values.language == "pl"
              ? "Polish"
              : this.props.values.language == "ro"
              ? "Romanian"
              : this.props.values.language == "nl"
              ? "Dutch"
              : "English"}
          </span>
        </div>
        {/* Language Dropdown */}
        <div
          className={
            this.state.isOpen === "true"
              ? "languageDropdown"
              : "languageDropDown hidden"
          }
        >
          <ul>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("dk");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={DenmarkFlag} alt="danish" />
              <span className="language">Danish</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("se");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={SwedenFlag} alt="swedish" />
              <span className="language">Swedish</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("es");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={SpainkFlag} alt="spanish" />
              <span className="language">Spanish</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("en");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={UsFlag} alt="english" />
              <span className="language">English</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("ru");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={RussianFlag} alt="russian" />
              <span className="language">Russian</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("fr");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={FranceFlag} alt="french" />
              <span className="language">French</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("pt");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={PortugalFlag} alt="french" />
              <span className="language">Portuguese</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("de");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={GermanyFlag} alt="french" />
              <span className="language">German</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("it");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={ItalyFlag} alt="fitalyrench" />
              <span className="language">Italian</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("gk");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={GreeceFlag} alt="french" />
              <span className="language">Greek</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("is");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={IcelandFlag} alt="french" />
              <span className="language">Icelandic</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("no");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={NorwayFlag} alt="french" />
              <span className="language">Norwegian</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("pl");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={PolandFlag} alt="french" />
              <span className="language">Polish</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("ro");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={RomaniaFlag} alt="french" />
              <span className="language">Romanian</span>
            </li>
            {/* Language item */}
            <li
              onClick={() => {
                this.props.handleLanguageClick("nl");
                this.closePicker();
              }}
              className="languagePicker"
            >
              <img src={NetherlandFlag} alt="french" />
              <span className="language">Dutch</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
export default LanguagePicker;
