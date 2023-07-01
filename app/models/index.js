const { MongoClient, ServerApiVersion } = require('mongodb');

const { createLog } = require('../functions');
const { mongodbUri, mongodbDatabase, mongodbCollection } = require('../config.json');

// Connect to MongoDB and initialise variables
const mongodbClient = new MongoClient(mongodbUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const db = mongodbClient.db(mongodbDatabase);
const collection = db.collection(mongodbCollection);

exports.insertOne = async function insertOne(_object) {
    const result = await collection.insertOne(_object);
    createLog('database', 'insertOne', 'info', `Inserted object with _id: ${result.insertedId} – ${result.acknowledged ? 'Success' : 'Failure'}`);
}

exports.findOne = async function findOne(_object) {
    const result = await collection.findOne(_object);
    createLog('database', 'findOne', 'info', `Searched for object: ${JSON.stringify(_object)} – ${null !== result ? 'Success' : 'Failure'}`);
    return result;
}

exports.updateOne = async function updateOne(_query, _update) {
    const result = await collection.updateOne(_query, _update);
    createLog('database', 'updateOne', 'info', `Updated object with _id: ${JSON.stringify(_query)} – ${result.acknowledged ? 'Success' : 'Failure'}`);
}

exports.deleteOne = async function deleteOne(_object) {
    const result = await collection.insertOne(_object);
    createLog('database', 'deleteOne', 'info', `Deleted object with _id: ${_object._id} – ${result.acknowledged ? 'Success' : 'Failure'}`);
}
