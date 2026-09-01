import { v2 as cloudinary } from "cloudinary";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function isRemoteAssetUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

export function getPublicIdFromUrl(url) {
  if (!isRemoteAssetUrl(url)) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.findIndex((segment) => segment === "upload");

    if (uploadIndex === -1) {
      return null;
    }

    const dataSegments = segments.slice(uploadIndex + 1);
    if (!dataSegments.length) {
      return null;
    }

    const firstSegment = dataSegments[0];
    const normalizedSegments = /^v\d+$/.test(firstSegment) ? dataSegments.slice(1) : dataSegments;
    if (!normalizedSegments.length) {
      return null;
    }

    const publicPath = normalizedSegments.join("/");
    if (!publicPath) {
      return null;
    }

    const lastDot = publicPath.lastIndexOf(".");
    return lastDot > -1 ? publicPath.slice(0, lastDot) : publicPath;
  } catch (_error) {
    return null;
  }
}

export function getCloudinaryAssetUrl(value) {
  if (!value) {
    return null;
  }

  return isRemoteAssetUrl(value) ? value : null;
}

export function buildCloudinaryPublicId(fileName, folderName) {
  const safeName = path
    .basename(fileName, path.extname(fileName))
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 80) || "file";

  return `${folderName}/${Date.now()}-${safeName}`;
}

export async function uploadToCloudinary(file, folderName, customFileName) {
  if (!file?.buffer) {
    throw new Error("No file buffer received for upload");
  }

  const resource = await new Promise((resolve, reject) => {
    const publicId = buildCloudinaryPublicId(customFileName || file.originalname || "upload", folderName);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: folderName,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload returned no result"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });

  return resource;
}

export async function deleteCloudinaryAsset(value) {
  const publicId = getPublicIdFromUrl(value);
  if (!publicId) {
    return false;
  }

  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
  return result?.result === "ok" || result?.result === "not_found";
}
