import React from 'react';
import PropTypes from 'prop-types';
import './terminal.scss';
import Ansi from 'ansi-to-react';

const Bar = ({status}) => (<div className={"collapsable-bar "+status.code}><span className="status">{status.message}</span></div>);
Bar.propTypes = {
  status: PropTypes.object
};

export default class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (<div className="bc-terminal">
        {(this.props.status) ? <Bar status={this.props.status} />:''}
        <div className="button-bar">
            {this.props.actions.map(a =>
                <button key={a.slug}
                  disabled={this.props.disabled}
                  data-toggle="tooltip" data-placement="top" title={a.label}
                  className="btn"
                  onClick={() => this.props.onAction && this.props.onAction(a)}
                >
                    <i className={a.icon}></i>
                    <small>{a.label}</small>
                </button>
            )}
        </div>
        <ul className="logs" style={{height: this.props.height}}>
            {this.props.logs.map((log,i)=>(
                <li key={i}>
                    <pre>
                        <Ansi>{log}</Ansi>
                    </pre>
                </li>
            ))}
        </ul>
    </div>);
  }
}
Terminal.propTypes = {
  status: PropTypes.object,
  logs: PropTypes.array,
  height: PropTypes.number,
  disabled: PropTypes.bool,
  onAction: PropTypes.func,
  actions: PropTypes.array,
};
Terminal.defaultProps = {
  status: '',
  logs: [],
  actions: [],
  height: null,
  disabled: true,
  onAction: null
};