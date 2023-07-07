const router = require('express').Router();
const database = require('./db.js');

/* REQUIREMENTS
Must contain the logic for the getting the history of searches from the database
This endpoint accepts an optional query parameter for finding history by searchTerm
    If there is NO query parameter 
        - then this endpoint should return a JSON response of all the history saved in your Atlas Cloud Mongo DB.
    If there is a query parameter 
        - then this endpoint should return a JSON response of the history associated to the search term in your Atlas Cloud Mongo DB.
*/

/**
 * @api {GET} /history/?k           returns the database contents based off of keyword
 *                                      (or all items if no keyword is provided)
 * @apiOptionalQuery {String} k     OPTIONAL: keyword
 * @apiExample                      localhost:3000/history
 *                                  localhost:3000/history/?k=sun
 */
router.get('/:k?', async (req,res) => {
    try{
        const {query} = req;
        const {k} = query; 
        if(k){
            //keyword is used
            const records = await database.find('Results', {searchTerm:k});
            res.json(records);
        }else{
            const records = await database.find('Results');
            res.json(records);
        }
        
    }catch(error){
        res.status(500).json(error.toString());
    }
});


module.exports = router;