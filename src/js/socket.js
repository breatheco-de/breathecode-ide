import io from 'socket.io-client';

export const getStatus = function(status='initializing'){
  switch(status){
    case "initializing": return "Setting up the coding environment";
    case "compiling": return "Building your code...";
    case "testing": return "Testing your code...";
    case "pending": return "Working...";
    case "conecting": return "Conecting...";
    case "saving": return "Saving Files...";
    
    case "ready": return "Ready to compile";
    case "compiler-error": return "Your code has errors";
    case "compiler-warning": return "Your code compiled, but with some warnings";
    case "compiler-success": return "Congrats! Was successfully built.";
    case "testing-error": return "Bad news! Your output is not as expected";
    case "testing-success": return "Great! Your code output matches what was expected";
    case "internal-error": return "Woops! There has been an internal error";
    case "prettifying": return "Making code prettier";
    case "prettify-success": return "Look how beautiful your code is now";
    case "prettify-error": return "Warning! Unable to prettify and save";
    default: throw new Error('Invalid status: '+status);
  }
};

export const isPending = (status) => (status) ? (['initializing', 'compiling', 'testing', 'pending', 'conecting' ].indexOf(status.code || status) > 0) : true;

const actions = ['build','prettify', 'test'];

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
            if(scope.updatedCallback) console.log(data) | scope.updatedCallback(scope, data);
        });
        
        return scope;
    }
};
