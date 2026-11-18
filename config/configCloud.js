var cloudinary=require("cloudinary").v2;
require('dotenv').config(); //to read the .env file

function getCloudinaryObject()
{
    //console.log(process.env.CLOUD_API_KEY+"****")
    cloudinary.config({ 
            cloud_name:process.env.CLOUD_NAME, 
            api_key:process.env.CLOUD_API_KEY , 
            api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
        });
    return cloudinary;
}

module.exports={getCloudinaryObject}