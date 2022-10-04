const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const filePath = process.env.FILE_PATH;

const file = './lib/waitlyst.js';

const uploadFile = () => {
    fs.readFile(file, (err, data) => {
        if (err) throw err;
        const fileContent  = Buffer.from(data, 'binary');
        const params = {
            Bucket: 'waitlyst', // pass your bucket name
            Key: filePath, // file will be saved as testBucket/contacts.csv
            Body: fileContent
        };
        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err
            console.log(`File uploaded successfully at ${data.Location}`)
        });
    });
};

uploadFile();
