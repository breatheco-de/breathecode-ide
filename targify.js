var targz = require('targz');
const simpleGit = require('simple-git')();

// compress files into tar.gz archive
targz.compress({
    src: './public',
    dest: './dist/app.tar.gz'
}, function(err){
    if(err) {
        console.log(err);
        process.exit(1);
    } else {
        simpleGit.add('./dist/app.tar.gz');
        console.log("Successfully compresed!");
        process.exit(0);
    }
});
