import axiosClient from "../api/axiosClient"

export const fetchSites = (params = {}) => {
    return axiosClient.get("/sites", {params})
    .then(r => r.data);
}

export const fetchSiteById = (id) => {
    return axiosClient.get(`/sites/${id}`)
    .then(r => r.data);
}

export const fetchCountries = () => {
    return axiosClient.get("sites/countries")
    .then(r => {
        return r.data;
    });
}

export const uploadSiteImage = (
  siteId,
  imageFile,
  adminSecret
) => {
  const formData = new FormData();

  formData.append(
    "image",
    imageFile
  );

  return axiosClient
    .post(
      `/sites/${siteId}/image`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
          Authorization:
            `Bearer ${adminSecret}`,
        },
      }
    )
    .then((res) => res.data);
};