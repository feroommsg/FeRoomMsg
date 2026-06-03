import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
})

export async function uploadImage(
  base64Image: string,
  folder: string = "el-gedada"
): Promise<{ url: string; publicId: string }> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary not configured")
  }

  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    resource_type: "auto",
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

export async function deleteImage(publicId: string) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return
  await cloudinary.uploader.destroy(publicId)
}
