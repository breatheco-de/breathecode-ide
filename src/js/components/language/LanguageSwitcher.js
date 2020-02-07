import React from "react";
import PropTypes from 'prop-types';
import './language-switcher.scss';
const icons = {
    es: 'https://ucarecdn.com/995a2dbc-c73b-463b-b6f9-9029a8cb0a2f/spainflag32.png',
    en: 'https://ucarecdn.com/18797504-01bb-4b22-97e9-ebccc207def9/unitedstatesusaflag32.png',
    it: 'https://ucarecdn.com/18797504-01bb-4b22-97e9-ebccc207def9/unitedstatesusaflag32.png',
    fr: 'https://ucarecdn.com/18797504-01bb-4b22-97e9-ebccc207def9/unitedstatesusaflag32.png',
};

const Icon = ({ url, className }) => <div className={"icon btn btn-sm "+className} style={{ backgroundImage: `url(${url}` }}>{' '}</div>;
Icon.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string,
};
Icon.defaultProps = {
  className: '',
};
export const LanguageSwitcher = ({ current, translations, onClick }) => {
    const _enabledLangs = translations.filter(l => l !== current);
    return (<div className="language-switcher">
        <ul style={{ width: _enabledLangs.length * 19 }}>
            {
                _enabledLangs.map( lang => {
                    return (<li key={lang} onClick={() => onClick(lang)}><Icon url={icons[lang]} /></li>);
                })
            }
        </ul>
        <Icon className={"current"} url={icons[current]} />
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