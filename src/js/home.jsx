import React from 'react';
import logo from '../img/rigo-baby.jpg';
import Editor from './components/editor/Editor.jsx';
import Readme from './components/readme/Readme.jsx';
import Terminal from './components/terminal/Terminal.jsx';
import SplitPane from 'react-split-pane';
const HOST = "http://breathecode-tools-alesanchezr.c9users.io:8080";
//create your first component
export class Home extends React.Component{
    constructor(){
        super();
        this.state = {
            editorSize: 450,
            exercises: [],
            error: null,
            files: [],
            consoleLogs: [],
            consoleStatus: 'loading',
            current: null,
            currentInstructions: null,
            currentFile: null,
            currentFileName: null,
            readme: '',
            getIndex: (slug) => {
                for(let i=0; i<this.state.exercises.length; i++)
                    if(this.state.exercises[i].slug == slug) return i;
                    
                return false;
            },
            next: () => {
                const i = this.state.getIndex(this.state.currentSlug)+1;
                if(typeof(this.state.exercises[i]) != 'undefined') return this.state.exercises[i];
                else return null;
            },
            previous: () => {
                const i = this.state.getIndex(this.state.currentSlug)-1;
                if(typeof(this.state.exercises[i]) != 'undefined') return this.state.exercises[i];
                else return null;
            }
        };
    }
    componentDidMount(){
        fetch(HOST+'/exercise')
            .then(resp => resp.json())
            .then(exercises => this.setState({exercises, error: null}))
            .catch((error) => this.setState({error: 'There seems to be an error connecting with the server'}));

        window.addEventListener("hashchange", () => this.loadInstructions());
        if(window.location.hash && window.location.hash!='#') this.loadInstructions();
        
    }
    loadInstructions(slug=null){
        if(!slug) slug = window.location.hash.slice(1,window.location.hash.length);
        if(slug=='' || slug=='/'){
            fetch(HOST+'/readme')
                .then(resp => resp.text())
                .then(readme => this.setState({readme, currentSlug: null}));
        } 
        else{
            fetch(HOST+'/exercise/'+slug)
                .then(resp => resp.json())
                .then(_files => {
                    const files = _files.filter(f => f.path.indexOf('.md') == -1);
                    this.setState({ files, currentSlug: slug });
                    this.loadFile(files[0]);
                });
            fetch(HOST+'/exercise/'+slug+'/readme/')
                .then(resp => resp.text())
                .then(readme => this.setState({ readme }));
        }
    }
    loadFile({name}){
        fetch(HOST+'/exercise/'+this.state.currentSlug+'/file/'+name)
            .then(resp => resp.text())
            .then(readme => this.setState({ currentFile: readme, currentFileName: name }));
    }
    saveFile(){
        return fetch(HOST+'/exercise/'+this.state.currentSlug+'/file/'+this.state.currentFileName,{
            method: 'PUT',
            body: this.state.currentFile
        });
    }
    render(){
        return (
            <SplitPane split="vertical" minSize={50} defaultSize={450}>
                <div>
                    {(this.state.error) ?
                        <div className="alert alert-danger">{this.state.error}</div>:''
                    }
                    <div className="prev-next-bar">
                        {(this.state.previous()) ? <a className="prev-exercise" href={"#"+this.state.previous().slug}>Previous</a>:''}
                        {(this.state.next()) ? <a className="next-exercise" href={"#"+this.state.next().slug}>Next</a>:''}
                    </div>
                    <Readme 
                        readme={this.state.currentInstructions ? this.state.currentInstructions : this.state.readme} 
                        exercises={this.state.exercises} 
                    />
                </div>
                <div>
                    <SplitPane split="horizontal" 
                        minSize={50} 
                        defaultSize={450}
                        onChange={ size => this.setState({editorSize: size}) }
                    >
                        <Editor 
                            files={this.state.files} 
                            buffer={this.state.currentFile} 
                            onOpen={(file) => this.loadFile(file)} 
                            height={this.state.editorSize}
                            onChange={(content) => this.setState({currentFile: content})}
                        />
                        <Terminal 
                            host={HOST} 
                            beforeCompile={() => this.saveFile()}
                            height={window.innerHeight - this.state.editorSize}
                            exercise={this.state.currentSlug}
                        />
                    </SplitPane>
                </div>
            </SplitPane>
        );
    }
}
