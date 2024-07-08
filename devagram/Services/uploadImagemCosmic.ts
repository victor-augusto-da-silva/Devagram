import { createBucketClient } from "@cosmicjs/sdk";
import multer from "multer";

const { BUCKET_SLUG, READ_KEY, WRITE_KEY } = process.env;

const bucketDevagram = createBucketClient({
  bucketSlug: BUCKET_SLUG as string,
  readKey: READ_KEY as string,
  writeKey: WRITE_KEY as string,
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const uploadImagemCosmic = async (req: any) => {
  if (req?.file?.originalname) {
    const fileName = req.file.originalname.toLowerCase();
    console.log("Nome do arquivo:", fileName);
    if (
      !fileName.includes(".png") &&
      !fileName.includes(".jpg") &&
      !fileName.includes(".jpeg")
    ) {
      console.error("Extensão da imagem inválida:", fileName);
      throw new Error("Extensão da imagem inválida");
    }
    const media_object = {
      originalname: req.file.originalname,
      buffer: req.file.buffer,
    };

    if (req.url && req.url.includes("publicacao")) {
      return await bucketDevagram.media.insertOne({
        media: media_object,
        folder: "publicacao",
      });
    } else {
      return await bucketDevagram.media.insertOne({
        media: media_object,
        folder: "avatar",
      });
    }
  } else {
    console.error("Arquivo não encontrado na requisição");
    throw new Error("Arquivo não encontrado na requisição");
  }
};

export { upload, uploadImagemCosmic };
