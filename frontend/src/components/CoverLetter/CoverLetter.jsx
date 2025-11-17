import React,{Component} from 'react';
import './CoverLetter.scss';
import conf from '../../../src/conf/configuration';
import logo from '../../assets/logo/logo.png';
import { withTranslation } from 'react-i18next';


class CoverLetter extends Component {

    constructor(props) {
        super(props);
       
    }


    render () {

        const { t } = this.props;

        return (
           <div className="cover-letter">
              <div className="head">
                 <div className="brand">
                    {conf.brand.useImg == false ? (
                       <span>{conf.brand.name}</span>
                    ) : (
                       <img className="logo" src={logo} />
                    )}
                 </div>
                 <div className="authentication">
               
                       <a onClick={() => {}} className="authenticationButton">
                          {' '}
                          {t('intro.login')}{' '}
                       </a>
                 
              
                 
                 </div>
              </div>
           </div>
        );
    }
}



const MyComponent = withTranslation('common')(CoverLetter)
export default MyComponent;