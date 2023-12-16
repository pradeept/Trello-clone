import { storage } from "@/appwrite";


const getUrl = async (image: Image)=>{
    const url = storage.getFilePreview(image.bucketId, image.fileId)
    console.log(url);
    
    return url;
}

export default getUrl