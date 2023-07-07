const superagent = require('superagent');


const base = 'https://collectionapi.metmuseum.org/public/collection/v1';


// gets a list of art in a given department.
const getArt = async (deptID, medium, keyword) => {
    try {
        //example url
        //https://collectionapi.metmuseum.org/public/collection/v1/search?departmentID=6&q=sky&medium=Paintings
        
        const getArtTypeURL = `${base}/search?departmentId=${deptID}&q=${keyword}&medium=${medium}`;
        const artType = await superagent.get(getArtTypeURL);

        // Return message if no object Ids are found
        if(artType.body.total === 0){
            console.log("This Department has no results")
            return [];
        }
        // Get the Object Ids
        let objectIds = artType.body.objectIDs;

        // Robot optimized version
        // const searchResult = await Promise.all(objectIds.map(async id =>({"id":id, "name": (await getArtInfo(id)).title})));

        // human readable
        const searchResult = await Promise.all(
            objectIds.map(async id =>{
                const { title } = await getArtInfo(id);
                return {
                    id,
                    title
                }
            })
        );

        return searchResult;
    } catch (error) {
        console.log('An error has ocurred\n', error);
    }
}

// Get the Art information of a specific art piece
const getArtInfo = async (id) => {  
    try {
        
        const artUrl = `${base}/objects/${id}`;
        const response = await superagent.get(artUrl);

        const output = {
           'department':  response.body.department,
           'type':response.body.classification,
           'title':response.body.title,
           'artist':response.body.artistDisplayName,
           'imageUrl':response.body.primaryImage,
           'artUrl': artUrl
        }
        return output;

    } catch (error) {
        console.log('Not a valid ID: '+ error);
        return {};
    }
};

// Allow functions to be called by app.js
module.exports = {
    getArt,
    getArtInfo
};
