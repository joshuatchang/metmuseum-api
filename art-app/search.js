const router = require('express').Router();
const database = require('./db.js');
const api = require('../art-api/api.js');

/** 
    REQUIREMENTS:
    This endpoint accepts a query parameter that is a keyword/term 
    This endpoint should perform two tasks.
        1 Get the search results and respond with JSON
        2 Create the search history object in MongoD
        
/**
 * @api {GET} /search/k             performs a search using keyword k
 * @apiQuery {String} k             keyword
 * @apiExample                      localhost:3000/search/sun
 */
router.get('/:k',async (req,res) => { 
    try{
        const {params} = req;
        const {k} = params; 
                
        // parameters for getArt (art count, departmentID, what type of medium, keyword) 
        // 6 is the value of the Asian Art Department. This number can change but was removed for simplicity.
        // results is an object containing all the ids of paintings searched with keyword k
        const results = await api.getArt(6, 'Paintings', k);

        // Create data for database
        const dateTime = new Date(); 
        const dbData = {
            "searchTerm": k,
            "lastSearched": dateTime, 
            "count": results.length 
        }

        // Check if the query has already ran once
        const alreadyExists = await database.find('Results', {searchTerm:k})
        
        // Save or update database
        if(alreadyExists) database.update('Results', k, dbData);
        else database.save('Results',dbData);

        //response with json object with search term and results
        res.json({
            "searchTerm": k,
            "results":results
        });

        

    }catch(error){
        res.status(500).json(error.toString());
    }
});


/*
    REQUIREMENTS:
    Where id is the user's selection and some unique dynamic identifier that is related to your API.
        This endpoint accepts a query parameter that was the associated search term to the user's selection
        This endpoint should perform two tasks.
            1 Get the details by id and respond with those details
            2 Updates the search history object in MongoDB
*/

/**
 * @api {GET} /search/k/id/details  returns the details of painting 
 * @apiQuery {String} k             keyword
 * @apiQuery {Number} id            art id 
 * @apiExample                      localhost:3000/search/sun/11111/details
 */
router.get('/:k/:id/details',async (req,res) => {
    try{
        const {params} = req;
        const {id} = params;
        const {k} = params;

        //results is object with info of certain art
        const results = await api.getArtInfo(id);

        //check if db collection "Results" has a selection array for this keyword
        const source = await database.find('Results', {searchTerm:k});
        if(source.selections){
            //selections already exists, add to the array and update
            const selections = [...source.selections, {id, results}];
            database.update('Results', k, {selections});
        }else{
            //create the selections array and update
            const selections = {selections: [{id, results}]}
            database.update('Results', k, selections);
        }

        //json response with specific details on artpiece
        res.json(results);

        

    }catch(error){
        res.status(500).json(error.toString());
    }
});


module.exports = router;