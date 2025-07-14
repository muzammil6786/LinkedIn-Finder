// backend/cache.js
const { MongoClient } = require('mongodb');

let db;

async function connectToMongo(uri) {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    await db.collection('queries').createIndex({ query: 1 }, { unique: true });  //avoid duplication
}

async function getCachedResult(query) {
    const result = await db.collection('queries').findOne({ query });
    return result?.data || null;
}

async function cacheResult(query, data) {
    await db.collection('queries').updateOne(
        { query },
        { $set: { data, createdAt: new Date() } },
        { upsert: true }
    );
}



module.exports = { connectToMongo, getCachedResult, cacheResult };
