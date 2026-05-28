import axios from "axios";

const API = "http://localhost:5000/api/articles";

// GET
export const getArticles = async () => {
  const res = await axios.get(API);
  return res.data;
};

// ADD
export const addArticle = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const updateArticle = async (
  id,
  quantite
) => {

  const res = await axios.put(
    `${API}/${id}`,
    { quantite }
  );

  return res.data;
};
