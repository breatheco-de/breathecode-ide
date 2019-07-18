import React from 'react';
import logo from '../img/breathecode.png';
import Editor from './components/editor/Editor.jsx';
import Readme from './components/readme/Readme.jsx';
import Terminal from './components/terminal/Terminal.jsx';
import SplitPane from 'react-split-pane';
import Socket, { isPending, getStatus } from './socket';
import { getHost, loadExercises, loadSingleExercise, loadFile, saveFile } from './actions.js';
import Joyride from 'react-joyride';
import { Session } from 'bc-react-session';

//create your first component
export class Home extends React.Component{
    constructor(){
        super();
        this.state = {
            host: getHost(),
            helpSteps: [
                {
                    target: '.bc-readme',
                    content: <span><h4>1) Read!</h4>Every exercise will come with a brief introduction and some instructions on how to complete it.</span>,
                    placement: 'right',
                    disableBeacon: true
                },
                {
                    target: '.react-monaco-editor-container',
                    content: <span><h4>2) Code!</h4>Use this coding editor on the right of the screen to code and propose a solution.</span>,
                    placement: 'left'
                },
                {
                    target: '.bc-terminal .button-bar',
                    content: <span><h4>3) Compile!</h4>Use the terminal buttons to <code>build</code> and <code>test</code> your exercises solutions.</span>,
                    placement: 'left'
                },
                {
                    target: '.bc-terminal .status',
                    content: <span>The console will always display the current state of the code, compilation errors or test results.</span>,
                    placement: 'bottom'
                },
                {
                    target: '.next-exercise',
                    content: 'Once you are satisfied with your code solution, you can go ahead to the next exercise.',
                    placement: 'bottom'
                },
                {
                    target: 'body',
                    content: <span><h4>4) Deliver!</h4>After finishing all exercises run <code>$ bc deliver:exercises</code> on your command line to deliver the exercises into the breathecode platform.</span>,
                    placement: 'center'
                }
            ],
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
        if(this.state.host){

            const session = Session.getSession();
            if(!session.active) Session.start({ showHelp: true });
            else if(typeof session.payload.showHelp === 'undefined') Session.setPayload({ showHelp:true });

            loadExercises()
                .then((exercises) => {
                    console.log("Exercises: ", exercises);
                    this.setState({ exercises, error: null });
                    if(!window.location.hash || window.location.hash == '#') this.loadInstructions(exercises[0].slug);
                })
                .catch(error => this.setState({ error }));

            //check for changes on the hash
            window.addEventListener("hashchange", () => this.loadInstructions());
            if(window.location.hash && window.location.hash!='#') this.loadInstructions();

            //connect to the compiler
            Socket.start(this.state.host);
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
    }
    loadInstructions(slug=null){
        if(!slug) slug = window.location.hash.slice(1,window.location.hash.length);
        if(slug=='' || slug=='/'){
            this.state.next();
        }
        else{
            loadSingleExercise(slug)
                .then(files => {

                    const { runHelp } = Session.getPayload();
                    console.log("Run help: ",runHelp);
                    this.setState({
                        runHelp: runHelp && this.state.getIndex(slug) === 1,
                        files,
                        currentSlug: slug,
                        consoleLogs: [],
                        codeHasBeenChanged: true,
                        consoleStatus: { code: 'ready', message: getStatus('ready') }
                    });
                    if(files.length > 0) loadFile(slug, files[0].name).then(content => this.setState({
                        currentFileContent: content,
                        currentFileName: files[0].name
                    }));
                })
                .catch(error => this.setState({ error }));
            loadFile(slug,'README.md').then(readme => this.setState({ readme }));
        }
    }
    render(){
        const { runHelp } = Session.getPayload();
        if(!this.state.host) return (<div className="alert alert-danger text-center"> ⚠️ No host specified for the application</div>);
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

        const LeftSide = (p) => (<div className={p.className}>
            <Joyride
                steps={this.state.helpSteps}
                continuous={true}
                run={runHelp === true}
                locale={{ back: 'Previous', close: 'Close', last: 'Finish', next: 'Next' }}
                styles={{
                    options: {
                        backgroundColor: '#FFFFFF',
                        overlayColor: 'rgba(0, 0, 0, 0.9)'
                    }
                }}
                callback = {(tour) => {
                    const { type } = tour;
                    if (type === 'tour:end') {
                        Session.setPayload({ runHelp: false });
                    }
                }}
            />
            <div className={"credits "+p.creditsPosition}>
                <img className={"bclogo"} src={logo} />
                <span>Made with love <br/> by <a href="https://breatheco.de" target="_blank" rel="noopener noreferrer">BreatheCode</a></span>
            </div>
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
        </div>);

        if(this.state.files.length == 0) return <LeftSide className="ml-5 mr-5" creditsPosition="bottom-center" />;

        return (
            <SplitPane split="vertical" minSize={size.vertical.min} defaultSize={size.vertical.init}>
                <LeftSide creditsPosition="top-right" />
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
                                            .then(status => this.setState({ isSaving: false, consoleLogs: ['Your code has been saved successfully.', 'Ready to compile...'] }))
                                            .catch(error => this.setState({ error, isSaving: false, consoleLogs: ['There was an error saving your code.'] }));
                            }}
                            height={this.state.editorSize}
                            onChange={(content) => this.setState({
                                currentFileContent: content,
                                codeHasBeenChanged: true,
                                isSaving: true,
                                consoleLogs: [],
                                consoleStatus: { code: 'ready', message: getStatus('ready') }
                            })}
                        />
                        <Terminal
                            disabled={isPending(this.state.consoleStatus) || this.state.isSaving}
                            host={this.state.host}
                            status={this.state.isSaving ? { code: 'saving', message: getStatus('saving') } : this.state.consoleStatus}
                            logs={this.state.consoleLogs}
                            showTestBtn={!this.state.codeHasBeenChanged}
                            showOpenBtn={!this.state.codeHasBeenChanged}
                            onCompile={() => this.state.compilerSocket.emit('build', { exerciseSlug: this.state.currentSlug })}
                            onTest={() => this.state.compilerSocket.emit('test', { exerciseSlug: this.state.currentSlug })}
                            onOpen={() => window.open(this.state.host+'/preview')}
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