var mongoose=require("mongoose")

function doMongooseConnection()
{
    let url=process.env.ATLAS_URL;
    //console.log(url);

    const dns=require('dns');
    dns.setServers(['8.8.8.8', '8.8.4.4']);

    mongoose.connect(url).then(
                        () => console.log("Connect to Mongodb"))
                        .catch((err)=> console.log(err.message))
}

module.exports={doMongooseConnection}