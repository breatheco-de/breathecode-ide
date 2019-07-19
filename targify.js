var targz = require('targz');

// compress files into tar.gz archive
targz.compress({
    src: './public',
    dest: './dist/app.tar.gz'
}, function(err){
    if(err) {
        console.log(err);
    } else {
        console.log("Done!");
    }
});