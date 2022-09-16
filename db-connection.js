const mongoose = require("mongoose");
const db = mongoose.connect(process.env.MONGO_SERVER,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
}
);

module.exports = db;