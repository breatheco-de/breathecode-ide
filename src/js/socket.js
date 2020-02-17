import io from 'socket.io-client';

export const getStatus = function(status='initializing'){
    const good = () => {
        const icons = ['🤩','🙂','😃','😎','🤓','😍','🤗','👌🏽' ];
        const messages = ['Yeah!', 'Wuju!', 'OMG!', 'YUUUUPPPIII!', 'Congrats!', 'Way to go!', "I'm soooo happy!", "Nice!", "I'm sooo happy for you", "For now...", "Maybe you are smart?", "Coding is your thing", "You are good at this"];
        return `${icons[Math.floor(Math.random() * Math.floor(icons.length))]} ${messages[Math.floor(Math.random() * Math.floor(messages.length))]}`;
    };
    const bad = () => {
        const icons = [ '🤮','🤢','🤐','🤬','😡','😵','🤷🏽‍♂️','🤷🏻‍♀️','😬','😭','😤', '🤭', '🤒', '💩', '🧟‍♂️', '🧟‍♀️' ];
        const messages = ["Don't panic", "Keep trying!", "Different error == good news", "Keep going!", "Never give up", "No pain no gain"];
        return `${icons[Math.floor(Math.random() * Math.floor(icons.length))]} ${messages[Math.floor(Math.random() * Math.floor(messages.length))]}`;
    };
    switch(status){
        case "initializing": return "Setting up the coding environment";
        case "compiling": return "💼 Building your code...";
        case "testing": return "👀 Testing your code...";
        case "pending": return "👩‍💻 Working...";
        case "conecting": return "📳 Conecting...";
        case "saving": return "💾 Saving Files...";

        case "ready": return "🐶 Ready...";
        case "compiler-error": return `${bad()} Your code has errors`;
        case "compiler-warning": return "⚠️ Your code compiled, but with some warnings";
        case "compiler-success": return `Successfully built. ${good()}`;
        case "testing-error": return `Not as expected ${bad()}`;
        case "testing-success": return `Everything as expected ${good()}`;
        case "internal-error": return " 🔥💻 Woops! There has been an internal error";
        case "prettifying": return "Making code prettier";
        case "prettify-success": return "Look how beautiful your code is now";
        case "prettify-error": return "Warning! Unable to prettify and save";
        default: throw new Error('Invalid status: '+status);
    }
};

export const isPending = (status) => (status) ? (['initializing', 'compiling', 'testing', 'pending', 'conecting' ].indexOf(status.code || status) > 0) : true;

const actions = ['build','prettify', 'test', 'run', 'input', 'gitpod-open', 'preview', 'reset'];

export default {
    socket: null,
    start: function(host){
        this.socket = io.connect(host);
    },
    createScope: function(scopeName){

        const scope = {
            socket: this.socket,
            name: scopeName,
            actionCallBacks: {
                clean: function(data, s){
                    s.logs = [];
                }
            },
            statusCallBacks: {},
            updatedCallback: null,
            status: {
                code: 'conecting',
                message: getStatus('conecting')
            },
            logs: [],
            on: function(action, callBack){
                this.actionCallBacks[action] = callBack;
            },
            onStatus: function(status, callBack){
                this.statusCallBacks[status] = callBack;
            },
            emit: function(action, data){
                if(actions.indexOf(action) < 0) throw new Error('Invalid action "'+action+'" for socket connection');
                else this.socket.emit(this.name, { action, data });
            },
            whenUpdated: function(callBack){
                this.updatedCallback = callBack;
            }
        };

        this.socket.on(scopeName,  (data) => {

            if(data.logs) scope.logs = scope.logs.concat(data.logs);
            if(data.status) scope.status = {
                code: data.status,
                message: getStatus(data.status)
            };

            if(typeof scope.actionCallBacks[data.action] == 'function') scope.actionCallBacks[data.action](data, scope);
            if(typeof scope.statusCallBacks[data.status] == 'function') scope.statusCallBacks[data.status](data, scope);
            if(scope.updatedCallback) console.log(scopeName+" event: ",data) | scope.updatedCallback(scope, data);
        });

        return scope;
    }
};
