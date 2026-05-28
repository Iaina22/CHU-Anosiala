import axios from "axios";

const API = "http://localhost:5000/api/demandes";

export const getAllDemandes = async () => {
  const res = await axios.get(`${API}/all`);
  return res.data;
};

export const getDemandesByUser = async (id) => {
  const res = await axios.get(`${API}/user/${id}`);
  return res.data;
};

export const addDemande = async (data) => {
  const res = await axios.post(`${API}`, data);
  return res.data;
};



export const updateDemandeStatus = async (id, status) => {
  const res = await axios.put(
    `${API}/${id}/status`,
    { status }
  );

  return res.data;
};

export const updateDemande = async (id, data) => {

  const res = await axios.put(
    `${API}/${id}`,
    data
  );

  return res.data;

};
