import React from "react";
import PropTypes from "prop-types";
import Menu from '../menu/Menu.js';

export default class Sidebar extends React.Component {
    constructor(){
        super();
        this.state = {
            open: false
        };
    }
    render(){
        const { className, children, next, previous, disabled, onClick, exercises, onOpen } = this.props;

        return (<div className={className}>
            <div className={`prev-next-bar`}>
                {<button onClick={e => {
                    this.setState({ open: !this.state.open });
                    if(onOpen) onOpen(!this.state.open);
                }} className="btn text-white"><i className="fas fa-bars"></i></button>}
                {next && 
                    <button className="next-exercise btn btn-dark" disabled={disabled} onClick={() => {
                        this.setState({ open: false });
                        onClick(next.slug);
                    }}>
                        Next exercise <i className="fas fa-arrow-right"></i> 
                    </button>
                }
                {previous && 
                    <button className="prev-exercise btn btn-dark mr-2" disabled={disabled} onClick={() => {
                        this.setState({ open: false });
                        onClick(previous.slug);
                    }}>
                        <i className="fas fa-arrow-left"></i> Previous exercise
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
  previous: PropTypes.object,
  next: PropTypes.object,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onOpen: PropTypes.func,
  exercises: PropTypes.array
};
Sidebar.defaultProps = {
  className: '',
  children: null,
  disabled: false,
  onOpen: null,
  onClick: null,
  exercises: []
};