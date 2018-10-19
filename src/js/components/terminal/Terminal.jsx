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
            {(this.props.onCompile && this.props.showCompileBtn)?
                <button 
                  disabled={this.props.disabled}
                  data-toggle="tooltip" data-placement="top" title="Build"
                  className="btn" 
                  onClick={() => this.props.onCompile()}
                >
                    <i className="fas fa-box-open"></i>
                    <small>Build</small>
                </button>:''
            }
            {(this.props.onPrettify)?
                <button 
                  disabled={this.props.disabled}
                  data-toggle="tooltip" data-placement="top" title="Pretty"
                  className="btn" 
                  onClick={() => this.props.onPrettify()}
                >
                    <i className="fas fa-paint-brush"></i>
                    <small>Pretty</small>
                </button>:''
            }
            {(this.props.onOpen && this.props.showOpenBtn)?
                <button 
                  disabled={this.props.disabled}
                  data-toggle="tooltip" data-placement="top" title="Open"
                  className="btn" 
                  onClick={() => this.props.onOpen()}
                >
                    <i className="fas fa-play"></i>
                    <small>Preview</small>
                </button>:''
            }
            {(this.props.onTest && this.props.showTestBtn)?
                <button 
                  disabled={this.props.disabled}
                  data-toggle="tooltip" data-placement="top" title="Open"
                  className="btn" 
                  onClick={() => this.props.onTest()}
                >
                    <i className="fas fa-check"></i>
                    <small>Test</small>
                </button>:''
            }
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
  onCompile: PropTypes.func,
  showTestBtn: PropTypes.bool,
  showOpenBtn: PropTypes.bool,
  showCompileBtn: PropTypes.bool,
  onPrettify: PropTypes.func,
  onTest: PropTypes.func,
  onOpen: PropTypes.func
};
Terminal.defaultProps = {
  status: '',
  logs: [],
  height: null,
  disabled: true,
  showTestBtn: true,
  showCompileBtn: true,
  showOpenBtn: true,
  onCompile: null,
  onTest: null,
  onPrettify: null,
  onOpen: null
};