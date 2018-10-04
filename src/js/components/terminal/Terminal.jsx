import React from 'react';
import PropTypes from 'prop-types';
import './terminal.scss';
import io from 'socket.io-client';
import Ansi from 'ansi-to-react';

const getStatus = function(status){
  switch(status){
    case "initializing": return "Setting up the coding environment";
    case "ready": return "Ready to compile";
    case "compiling": return "Building your code...";
    case "compiler-error": return "Your code has errors";
    case "compiler-warning": return "Your code compiled, but with some warnings";
    case "compiler-success": return "Congrats! Was successfully built.";
    case "testing-error": return "Bad news! Your output is not as expected";
    case "testing": return "Testing your code...";
    case "testing-success": return "Great! Your code output matches what was expected";
    case "internal-error": return "Woops! There has been an internal error";
    case "pending": return "Working...";
    default: return "I'm working, have some patience";
  }
};

const Bar = ({status}) => (<div className={"collapsable-bar "+status}><span className="status">{getStatus(status)}</span></div>);
Bar.propTypes = {
  status: PropTypes.string
};

export default class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      status: 'initializing',
      logs: []
    };
  }
  
  componentDidMount(){
    const socket = io.connect(this.props.host);
    socket.on('compiler',  (data) => {
      console.log(data);
        let state = {};
        switch(data.action){
          case "log": 
            if(data.status) state.status = data.status;
            if(data.logs) state.logs = this.state.logs.concat(data.logs);
            this.setState(state);
          break;
          case "clean": 
            this.setState({
              logs: []
            });
          break;
          default:
            if(data.status) state.status = data.status;
            this.setState(state);
          break;
        }
    });
    this.setState({ socket });
  }
  
  emit(action, data=null){
    this.state.socket.emit('compiler', {action, data});
  }
  
  render() {
    return (<div className="bc-terminal">
        <Bar status={this.state.status} />
        <div className="button-bar">
            <button 
              data-toggle="tooltip" data-placement="top" title="Build"
              className="btn" 
              onClick={() => {
                if(this.props.beforeCompile){
                  const promise = this.props.beforeCompile();
                  promise.then(resp => {
                    if(resp.status == 200)
                      this.emit('build',{ exerciseSlug: this.props.exercise });
                  });
                }
                else{
                  this.emit('build',{ exerciseSlug: this.props.exercise });
                }
              }}
            >
                <i className="fas fa-box-open"></i>
                <small>Build</small>
            </button>
            <button 
              data-toggle="tooltip" data-placement="top" title="Open"
              className="btn" 
              onClick={() => window.open(this.props.host+'/preview')}
            >
                <i className="fas fa-play"></i>
                <small>Run</small>
            </button>
            <button 
              data-toggle="tooltip" data-placement="top" title="Open"
              className="btn" 
              onClick={() => {
                if(this.props.beforeCompile){
                  const promise = this.props.beforeCompile();
                  promise.then(resp => {
                    if(resp.status == 200)
                      this.emit('test',{ exerciseSlug: this.props.exercise });
                  });
                }
                else{
                  this.emit('test',{ exerciseSlug: this.props.exercise });
                }
              }}
            >
                <i className="fas fa-check"></i>
                <small>Test</small>
            </button>
        </div>
        <ul className="logs" style={{height: this.props.height}}>
            {this.state.logs.map((log,i)=>(
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
  host: PropTypes.string,
  beforeCompile: PropTypes.func,
  height: PropTypes.number,
  exercise: PropTypes.string
};
Terminal.defaultProps = {
  host: null,
  height: null,
  exercise: null,
  beforeCompile: null
};