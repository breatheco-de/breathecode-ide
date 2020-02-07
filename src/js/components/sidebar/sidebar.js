import React from "react";
import PropTypes from "prop-types";
import Menu from '../menu/Menu.js';
import { LanguageSwitcher } from '../language/LanguageSwitcher.js';
import { languages } from "monaco-editor";

export default class Sidebar extends React.Component {
    constructor(){
        super();
        this.state = {
            open: false
        };
    }
    render(){
        const { className, children, next, previous, disabled, onClick, exercises, onOpen, currentTanslation, translations } = this.props;

        return (<div className={className}>
            <div className={`prev-next-bar`}>
                {<button onClick={e => {
                    this.setState({ open: !this.state.open });
                    if(onOpen) onOpen(!this.state.open);
                }} className="btn text-white btn-sm"><i className="fas fa-bars"></i></button>}
                <LanguageSwitcher current={currentTanslation} translations={translations} />
                {next && 
                    <button className="next-exercise btn btn-dark btn-sm" disabled={disabled} onClick={() => {
                        this.setState({ open: false });
                        onClick(next.slug);
                    }}>
                        Next <i className="fas fa-arrow-right"></i> 
                    </button>
                }
                {previous && 
                    <button className="prev-exercise btn btn-dark btn-sm mr-2" disabled={disabled} onClick={() => {
                        this.setState({ open: false });
                        onClick(previous.slug);
                    }}>
                        <i className="fas fa-arrow-left"></i> Previous
                    </button>
                }
            </div>
            <Menu className={`${this.state.open ? "open":""}`} exercises={exercises} onClick={slug => {
                this.setState({ open: false });
                onClick(slug);
            }} />
            {children}
        </div>);
    }
}

Sidebar.propTypes = {
  className: PropTypes.string,
  currentTanslation: PropTypes.string,
  previous: PropTypes.object,
  next: PropTypes.object,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onOpen: PropTypes.func,
  exercises: PropTypes.array,
  translations: PropTypes.array
};
Sidebar.defaultProps = {
  className: '',
  currentTanslation: 'en',
  children: null,
  disabled: false,
  onOpen: null,
  onClick: null,
  exercises: [],
  translations: []
};