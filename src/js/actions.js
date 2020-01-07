/* global fetch */

const urlParams = new URLSearchParams(window.location.search);
const fullURL = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
const HOST = process.env.HOST || urlParams.get('host') || fullURL;

const actions = {
    getHost: function(){
        return HOST;
    },
    loadExercises: function(){
        return new Promise((resolve, reject) =>
            fetch(HOST+'/exercise')
                .then(resp => {
                    if(resp.ok) return resp.json();
                    else throw new Error('There seems to be an error connecting with the server');
                })
                .then(details => {
                    const exercises = Array.isArray(details) ? details : details.exercises;

                    if(Array.isArray(exercises) && exercises.length >0 ) resolve(exercises);
                    else throw new Error('No exercises where found on the currect directory');
                })
                .catch((error) => {
                    reject(error);
                })
        );
    },
    loadSingleExercise: function(exerciseSlug){
        return new Promise((resolve, reject) =>
            fetch(HOST+'/exercise/'+exerciseSlug)
                .then(resp => {
                    if(resp.ok) return resp.json();
                    else throw new Error('There seems to be an error connecting with the server');
                })
                .then(files => {
                    if(Array.isArray(files)) resolve(files);
                    else{
                        console.log("Single exercise: ", files);
                        throw new Error('Invalid array of files found for the exercise', files);
                    }
                })
                .catch((error) => {
                    reject(error);
                })
        );
    },
    loadFile: function(exerciseSlug, file){
        return new Promise((resolve, reject) =>
            fetch(HOST+'/exercise/'+exerciseSlug+'/file/'+(file.name || file)).then(resp => {
                resolve(resp.text());
            })
            .catch(error => reject(error))
        );
    },
    loadReadme: function(exerciseSlug){
        return new Promise((resolve, reject) =>
            fetch(HOST+'/exercise/'+exerciseSlug+'/readme').then(resp => {
                if(resp.status == 200){
                    resp.text().then(originalText => {
                        try {
                            const data = JSON.parse(originalText);
                            resolve(data);
                        } catch (e) {
                            console.log("Error", originalText);
                            resolve(originalText);
                        }
                    });
                }
                else reject();
            })
            .catch(error => reject(error))
        );
    },
    saveFile: function(exerciseSlug, file, content){
        return new Promise((resolve, reject) =>
            fetch(HOST+'/exercise/'+exerciseSlug+'/file/'+(file.name || file),{
                method: 'PUT',
                body: content
            })
            .then(resp => resolve(resp.text()))
            .catch(error => reject(error))
        );
    }
};

export const {getHost, loadExercises, loadSingleExercise, loadFile, saveFile, loadReadme } = actions;