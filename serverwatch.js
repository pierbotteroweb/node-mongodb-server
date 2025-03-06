const { MongoClient } = require('mongodb');
const io = require('socket.io')(3333); // Replace 3000 with your desired port

async function watchChanges() {
  const client = new MongoClient("mongodb://localhost:27017/?replicaSet=rs0");
  await client.connect();

  const db = client.db('shufleTV');
  const collection = db.collection('movies');

  // Watch for changes on the collection
  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    console.log('Change detected:', change);
    io.emit('documentChanged', change); // Broadcast the change
  });
}

watchChanges().catch(console.error);
