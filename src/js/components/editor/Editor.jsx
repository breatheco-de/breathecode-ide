import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import PropTypes from 'prop-types';
import './editor.scss';
export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...'
    };
  }
  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  onChange(newValue, e) {
    this.props.onChange(newValue);
  }
  render() {
    const tabs = this.props.files.map((f,i) => (<li key={i} className="nav-item">
        <button className="nav-link" onClick={() => this.props.onOpen(f)}>
            {f.name}
        </button>
    </li>));
    return (<div className="bc-editor">
        {(this.props.files && tabs.length>0) ?
            <ul className="nav nav-tabs">{tabs}</ul>:''
        }
        <MonacoEditor
            width={window.innerWidth}
            height={this.props.height}
            language="javascript"
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
  onOpen: PropTypes.func,
  onChange: PropTypes.func
};
Editor.defaultProps = {
  buffer: null, 
  height: null, 
  files: []
};