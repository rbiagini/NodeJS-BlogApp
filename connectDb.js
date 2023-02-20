const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const connectToDatabase = async () => {
    console.log(process.env.NODE_ENV);
    if (1 == 1 || process.env.NODE_ENV == "production") {
        var MONGODB_USERNAME = "biagini";
        var MONGODB_PASSWORD = "2fsuA6BL82gwX37N";
        var MONGODB_SERVER = "nodejs.xqcrckt.mongodb.net/";
        console.log("producao " + MONGODB_USERNAME);
    } else {
        var MONGODB_USERNAME = "biagini";
        var MONGODB_PASSWORD = "9EpmJbtque11RBjt";
        var MONGODB_SERVER = "cursonodejs.c9jmpph.mongodb.net/BlogApp";
        console.log(process.env.NODE_ENV + " " + MONGODB_USERNAME);
    }

    const connectString = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_SERVER}?retryWrites=true&w=majority`;

    //conexão original
    await mongoose.connect(connectString, (err) => {
        if (err) return console.log("Ocorreu um erro de conexão\n\n", err);

        return console.log("conexão bem sucedida com mongodb.net");
    });
};

module.exports = connectToDatabase;
