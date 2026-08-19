const dns = require('dns');
const dotenv = require('dotenv');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

dns.setServers(['8.8.8.8', '1.1.1.1']);

// Trae a llamar el archivo de variables de entorno
dotenv.config({
  path: path.join(__dirname, 'atlas-credentials.env')
});


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// Añadir la ubicacion directa del archivo .env
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  await client.connect();
  console.log('Conectado a MongoDB');

  return client.db('serverzenio');
}

async function setupDatabase() {
  const db = await connectToDatabase();

  await db.createCollection('users', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'name', 'age', 'codePhone', 'cellphone'],
        properties: {
          userId: { bsonType: 'string' },
          name: { bsonType: 'string' },
          age: { bsonType: 'int', minimum: 18 },
          codePhone: { bsonType: 'string' },
          cellphone: { bsonType: 'string' }
        }
      }
    },
    validationLevel: 'strict',
    validationAction: 'error'
  });

  return db;
}



module.exports = { client, connectToDatabase, setupDatabase };
