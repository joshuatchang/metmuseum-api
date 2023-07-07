const { MongoClient } = require('mongodb');
require('dotenv').config();

/**
 * @description         es6 style module to support mongo connection adn crud operations
 * @return {Object}     object containing functions
 */
const mongo = () => {
    const mongoURL = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_KEY}@${process.env.MONGO_DB}.t6oek6a.mongodb.net/?retryWrites=true&w=majority`;
    let db = null;

    /**
     * @description         connects to mongo atlas via url and sets db instance
     */
    async function connect() {
        try {
            const client = new MongoClient(mongoURL);
            await client.connect();

            db = client.db();

            console.log('Connected to Mongo DB');
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description                      performs an insert into the specified collection
     * @param {String} collectionName    name of a collection in mongo
     * @param {Object} data              data object to insert into mongo collection
     */
    async function save(collectionName, data) {
        try {
            const collection = db.collection(collectionName);
            await collection.insertOne(data);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description                      performs a query on a mongo collection by deckId
     * @param {String} collectionName    name of a collection in mongo
     * @param {Object} query             object containing keyword
     * @return {Object or Array}         all results or the specific object with keyword
     */
    async function find(collectionName, query) {
        try {
            const collection = db.collection(collectionName);
            //check if query exists
            if (query) {
                //find the item
                return await collection.find(query).next();
            } else {
                //return all
                return await collection.find({}).toArray();
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @description                      performs an update on a mongo collection by deckId
     * @param {String} collectionName    name of a collection in mongo
     * @param {Object} artTerm           artTerm to query
     * @param {Object} data              data to update into mongo collection
     */
    async function update(collectionName, artTerm, data) {
        try {
            const collection = db.collection(collectionName);

            await collection.updateOne(
                { searchTerm: artTerm },
                { $set: data }
            );
        } catch (error) {
            console.log(error);
        }
    }

    return {
        connect,
        save,
        find,
        update
    };
};

module.exports = mongo();