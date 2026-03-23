import ImageKit, { toFile } from "@imagekit/nodejs";

const client = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadFile = async (file, folder = "attachments") => {
    if (!file) {
        throw new Error("File is required");
    }

    const uploaded = await client.files.upload({
        file: await toFile(file.buffer, file.originalname),
        fileName: file.originalname,
        folder,
    });

    return {
        fileUrl: uploaded.url,
        fileType: file.mimetype.split("/")[0],
        mimeType: file.mimetype,
        size: file.size,
    };
};
