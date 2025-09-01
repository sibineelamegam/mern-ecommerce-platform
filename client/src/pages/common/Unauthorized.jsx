import FullPageMessage from "../../components/common/FullPageMessage";

const Unauthorized = () => (
  <FullPageMessage 
    title="401 - Unauthorized"
    message="You do not have permission to access this page."
  />
);

export default Unauthorized;