const sha1 = async (value) => {
  const data = new TextEncoder().encode(value);

  const hashBuffer = await crypto.subtle.digest(
    "SHA-1",
    data
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const uploadSiteImageToCloudinary = async ({
  file,
  publicId,
  cloudinary,
}) => {
  const {
    cloudName,
    apiKey,
    apiSecret,
  } = cloudinary;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary secrets are not configured."
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);

  const folder = "Nomia/Sites";

  const signatureString =
    `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

  const signature = await sha1(signatureString);

  const blob = new Blob(
    [file.buffer],
    {
      type: file.mimetype,
    }
  );

  const formData = new FormData();

  formData.append(
    "file",
    blob,
    file.originalname
  );

  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("public_id", publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Cloudinary upload failed."
    );
  }

  return result;
};