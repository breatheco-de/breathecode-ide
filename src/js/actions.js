/* global fetch */

export default {
    HOST: null,
    loadExercises = () =>
        new Promise((resolve, reject) =>
            fetch(this.HOST+'/exercise')
                .then(resp => resp.json())
                .then(exercises => {
                    if(Array.isArray(exercises) && exercises.length >0 ) resolve(exercises);
                    else throw new Error('No exercises where found on the currect directory');
                })
                .catch((error) => {
                    throw new Error('There seems to be an error connecting with the server');
                })
        ),
    loadSingleExercise = (exerciseSlug) =>
        new Promise((resolve, reject) =>
            fetch(this.HOST+'/exercise/'+exerciseSlug)
                .then(resp => resp.json())
                .then(files => {
                    if(Array.isArray(files)) resolve(files);
                    else{
                        reject('Invalid array of files found for the exercise');
                        throw new Error('Invalid array of files found for the exercise');
                    }
                })
                .catch((error) => {
                    reject('There seems to be an error connecting with the server');
                    throw new Error('There seems to be an error connecting with the server');
                })
        ),
    loadFile = (exerciseSlug, fileName) => new Promise((resolve, reject) =>
        fetch(this.HOST+'/exercise/'+exerciseSlug+'/file/'+fileName).then(resp => {
            resolve(resp.text());
        })
        .catch(error => reject(error))
    ),
    saveFile = (exerciseSlug, fileName, content) =>
        fetch(this.HOST+'/exercise/'+exerciseSlug+'/file/'+fileName,{
            method: 'PUT',
            body: content
        })
};