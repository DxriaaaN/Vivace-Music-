const mongoose = require("mongoose");
const dotenv = require('dotenv');
mongoose.set("strictQuery", true);

//Variables .env
dotenv.config({path: '../../../config/.env'});

//MusicSettings
const musicSchema = require('./schemas/musicSchema');
const triggerSchema = require('./schemas/triggerSchema');
const embedSchema = require('./schemas/embedSchema');

module.exports = {
  async initializeMongoose() {
    console.log(`Conectando a MongoDb...`);
    try {
      await mongoose.connect(process.env.MONGO_CONNECTION || '');

      if (mongoose.connect) {
        console.log("Mongoose: Se establecio conexion con la base de datos")
      } else {
        console.log('Mongoose: Fallo al conectar la base de datos :("')
      }

      return mongoose.connection;
    } catch (error) {
      console.error("Mongoose: Fallo al conectar la base de datos", error);
    };
  },
  schemas: {
    musicSchema,
    triggerSchema,
    embedSchema
  }
};
