const mongoose = require("mongoose");

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == "production") {
    const MONGODB_USERNAME = "biagini";
    const MONGODB_PASSWORD = "2fsuA6BL82gwX37N";
    const connectString = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@nodejs.xqcrckt.mongodb.net/?retryWrites=true&w=majority`;
    //`mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cursonodejs.c9jmpph.mongodb.net/BlogApp?retryWrites=true&w=majority`;
} else {
    const MONGODB_USERNAME = "biagini";
    const MONGODB_PASSWORD = "9EpmJbtque11RBjt";
    const connectString = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cursonodejs.c9jmpph.mongodb.net/BlogApp?retryWrites=true&w=majority`;
}

mongoose.set("strictQuery", false);
const connectToDatabase = async () => {
    //conexão original
    await mongoose.connect(connectString, (err) => {
        if (err) return console.log("Ocorreu um erro de conexão\n\n", err);

        return console.log("conexão bem sucedida com mongodb.net");
    });
};

module.exports = connectToDatabase;
