import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Adminhome from "../pages/Admin/Adminhome";
import DemandeAdmin from "../pages/Admin/DemandeAdmin";
import DemandeDetail from "../pages/Admin/DemandeDetail";
import Article from "../pages/Admin/Article";
import StockSuivi from "../pages/Admin/StockSuivi";
import Profile from "../pages/Profile";
import Stock from "../pages/Admin/Stock";
import UserStock from "../pages/Stock/Stock";
import UserArticle from "../pages/User/UserArticle";
import Demande from "../pages/User/Demande";
import EditProfile from "../pages/EditProfile";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adminhome" element={<Adminhome />} />
      <Route path="/demandeAdmin" element={<DemandeAdmin />} />
      <Route path="/stockSuivi" element={<StockSuivi />} />
      <Route path="/admin/demandes/:id" element={<DemandeDetail />}/>
      <Route path="/article" element={<Article />} />
      <Route path="/UserStock" element={<UserStock />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/stock" element={<Stock />} />
      <Route path="/userArticle" element={<UserArticle />} />
       <Route path="/demande" element={<Demande />} />
      <Route path="/editProfile" element={<EditProfile />} />
      
    </Routes>
  );
}

export default AppRoutes;