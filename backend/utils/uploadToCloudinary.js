const cloudinary = require('./cloudinary');

const uploadToCloudinary = (buffer, folder = 'posts') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

module.exports = uploadToCloudinary;