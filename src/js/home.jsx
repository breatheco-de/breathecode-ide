import React from 'react';
import logo from '../img/breathecode.png';
import Editor from './components/editor/Editor.jsx';
import Readme from './components/readme/Readme.jsx';
import Terminal from './components/terminal/Terminal.jsx';
import SplitPane from 'react-split-pane';
import Socket, { isPending } from './socket';
import { loadExercises, loadSingleExercise, loadFile, saveFile } from './actions';

//create your first component
export class Home extends React.Component{
    constructor(){
        super();
        this.state = {
            editorSocket: null,
            editorSize: 450,
            codeHasBeenChanged: true,
            exercises: [],
            error: null,
            files: [],
            compilerSocket: null,
            consoleLogs: [],
            consoleStatus: null,
            isSaving: false,
            current: null,
            currentInstructions: null,
            currentFileContent: null,
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
        loadExercises()
            .then((exercises) => {
                this.setState({exercises, error: null });
                if(!window.location.hash || window.location.hash == '#') this.loadInstructions(exercises[0].slug);
            })
            .catch(error => this.setState({ error }));

        //check for changes on the hash
        window.addEventListener("hashchange", () => this.loadInstructions());
        if(window.location.hash && window.location.hash!='#') this.loadInstructions();
        
        Socket.start(process.env.HOST);
        //connect to the compiler
        const compilerSocket = Socket.createScope('compiler');
        compilerSocket.whenUpdated((scope, data) => {
            let state = { consoleLogs: scope.logs, consoleStatus: scope.status };
            if(typeof data.code == 'string') state.currentFileContent = data.code;
            this.setState(state);
        });
        compilerSocket.onStatus('compiler-success', () => {
            loadFile(this.state.currentSlug, this.state.currentFileName)
                .then(content => this.setState({ currentFileContent: content, codeHasBeenChanged: false }));
        });
        this.setState({ compilerSocket });
    }
    loadInstructions(slug=null){
        if(!slug) slug = window.location.hash.slice(1,window.location.hash.length);
        if(slug=='' || slug=='/'){
            this.state.next();
        } 
        else{
            loadSingleExercise(slug)
                .then(files => {
                    this.setState({ files, currentSlug: slug });
                    loadFile(slug, files[0].name).then(content => this.setState({ 
                        currentFileContent: content, 
                        currentFileName: files[0].name, 
                        codeHasBeenChanged: true,
                        consoleLogs: []
                    }));
                });
            loadFile(slug,'README.md').then(readme => this.setState({ readme }));
        }
    }
    render(){
        const size = {
            vertical: {
                min: 50,
                init: 550
            },
            horizontal: {
                min: 50,
                init: 450
            }
        };
        return (
            <SplitPane split="vertical" minSize={size.vertical.min} defaultSize={size.vertical.init}>
                <div>
                    <img className="bclogo" src={logo} />
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
                        minSize={size.horizontal.min} 
                        defaultSize={size.horizontal.init}
                        onChange={ size => this.setState({editorSize: size}) }
                    >
                        <Editor 
                            files={this.state.files} 
                            buffer={this.state.currentFileContent} 
                            onOpen={(fileName) => loadFile(this.state.currentSlug,fileName).then(content => this.setState({ currentFileContent: content, currentFileName: fileName })) } 
                            showStatus={true}
                            onIdle={() => {
                                saveFile(this.state.currentSlug, this.state.currentFileName, this.state.currentFileContent)
                                            .then(status => this.setState({ isSaving: false }))
                                            .catch(error => this.setState({ error, isSaving: false }));
                            }}
                            height={this.state.editorSize}
                            onChange={(content) => this.setState({ currentFileContent: content, codeHasBeenChanged:true, isSaving: true })}
                        />
                        <Terminal 
                            disabled={isPending(this.state.consoleStatus) || this.state.isSaving}
                            host={process.env.HOST}
                            status={this.state.isSaving ? { code: 'saving', message: 'Saving Files'} : this.state.consoleStatus}
                            logs={this.state.consoleLogs}
                            showTestBtn={!this.state.codeHasBeenChanged}
                            showOpenBtn={!this.state.codeHasBeenChanged}
                            onCompile={() => this.state.compilerSocket.emit('build', { exerciseSlug: this.state.currentSlug })}
                            onTest={() => this.state.compilerSocket.emit('test', { exerciseSlug: this.state.currentSlug })}
                            onOpen={() => window.open(process.env.HOST+'/preview')}
                            height={window.innerHeight - this.state.editorSize}
                            exercise={this.state.currentSlug}
                        />
                    </SplitPane>
                </div>
            </SplitPane>
        );
    }
}

/*
    onPrettify={() => this.state.compilerSocket.emit('prettify', { 
        fileName: this.state.currentFileName,
        exerciseSlug: this.state.currentSlug
    })}
*/