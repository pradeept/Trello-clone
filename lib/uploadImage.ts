import { storage } from "@/appwrite";
import { ID } from "appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;
  const fileUploaded = await storage.createFile(
    "652d13186ab6fecd4f6d",
    ID.unique(),
    file
  );
  return fileUploaded;
};

export default uploadImage;
