/*eslint no-useless-escape: 0 */
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import PropTypes from 'prop-types';
import './editor.scss';

const languages = {
    js: "javascript",
    css: "css",
    jsx: "javascript",
    html: "html"
};
const StatusBar = ({status}) => (<span className="editor-status">{status}</span>);
StatusBar.propTypes = {
  status: PropTypes.string,
};
StatusBar.defaultProps = {
  status: ''
};
export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
      status: 'idle',
      lastUpdate: null,
      language: "js"
    };
  }
  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor);
    if(Array.isArray(this.props.files) && this.props.files.length > 0) this.setState({ language: this.props.files[0].name.split('.').pop() });
    editor.focus();
  }
  onChange(newValue, e) {
    this.props.onChange(newValue);
    if(this.props.onIdle){
      this.setState({ lastUpdate: new Date().getTime(), status: 'typing' });
      setTimeout(() => {
        const NOW = new Date().getTime();
        if((NOW - this.state.lastUpdate) > this.props.idleTimeFrame){
          this.props.onIdle();
          this.setState({ status: 'idle' });
        }
      },this.props.idleTimeFrame);
    }
  }

  render() {
    const tabs = this.props.files.map((f,i) => (<li key={i} className="nav-item">
        <button className="nav-link" onClick={() => {
            const extension = f.name.split('.').pop();
            console.log(extension);
            this.setState({ language: extension });
            this.props.onOpen(f);
        }}>
            {f.name}
        </button>
    </li>));
    return (<div className="bc-editor">
        {(this.props.files && tabs.length>0) ?
            <ul className="nav nav-tabs">{tabs}</ul>:''
        }
        {(this.props.showStatus) ? <StatusBar status={this.state.status} />:''}
        <MonacoEditor
            width={window.innerWidth}
            height={this.props.height}
            language={languages[this.state.language]}
            theme="vs-dark"
            value={this.props.buffer}
            options={{
              selectOnLineNumbers: true
            }}
            onChange={(newValue, e) => this.onChange(newValue, e)}
            editorDidMount={(editor, monaco) => this.editorDidMount(editor, monaco)}
        />
    </div>);
  }
}
Editor.propTypes = {
  files: PropTypes.array,
  buffer: PropTypes.string,
  height: PropTypes.number,
  showStatus: PropTypes.bool,
  idleTimeFrame: PropTypes.number,
  onOpen: PropTypes.func,
  onChange: PropTypes.func,
  onIdle: PropTypes.func
};
Editor.defaultProps = {
  idleTimeFrame: 1000,
  showStatus: true,
  onIdle: null,
  buffer: null,
  height: null,
  files: []
};