import React from "react";
import PropTypes from 'prop-types';
import './language-switcher.scss';

const Icon = ({ url, className }) => <div className={"icon btn btn-sm "+className} style={{ backgroundImage: `url(${url}` }}>{' '}</div>;
Icon.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string,
};
Icon.defaultProps = {
  className: '',
};
export const LanguageSwitcher = ({ current, translations, onClick }) => {
    const _enabledLangs = translations;//.filter(l => l !== current);
    return (<div className="language-switcher">
        <ul>
            {
                _enabledLangs.map( lang => {
                    return (<li key={lang} onClick={() => lang != current ? onClick(lang) : null}><Icon url={`https://www.countryflags.io/${lang}/flat/64.png`} /></li>);
                })
            }
        </ul>
        <Icon className={"current"} url={`https://www.countryflags.io/${current}/flat/64.png`} />
    </div>);
};
LanguageSwitcher.propTypes = {
  current: PropTypes.string,
  onClick: PropTypes.func,
  translations: PropTypes.array
};
LanguageSwitcher.defaultProps = {
  onClick: null,
  current: null,
  translations: []
};