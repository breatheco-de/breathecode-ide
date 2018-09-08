import React from 'react';
import PropTypes from 'prop-types';
import './terminal.scss';
import io from 'socket.io-client';
import Ansi from 'ansi-to-react';

const Bar = ({status}) => (<div className={"collapsable-bar "+status}></div>);
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
              Save & Build
            </button>
            <button 
              className="btn" 
              onClick={() => window.open(this.props.host+'/preview')}
            >
              Open
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