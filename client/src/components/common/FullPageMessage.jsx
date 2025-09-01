import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";

const FullPageMessage = ({ title, message, redirectAdmin = "/dashboard", redirectDefault = "/" }) => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <Spinner />;

 const handleBack = () => {
  if (auth?.role === "admin") {
    navigate(redirectAdmin);
  } else if (auth?.role === "customer") {
    navigate(redirectDefault);
  } else {
    navigate("/");
  }
};


  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      textAlign: "center",
      padding: "1rem",
    }}>
      <h1 style={{ margin: 0 }}>{title}</h1>
      <p>{message}</p>
      <button onClick={handleBack}>Go back</button>
    </div>
  );
};

export default FullPageMessage;
