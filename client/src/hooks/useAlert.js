// hooks/useAlert.js
import { useState } from "react";

export default function useAlert() {
  const [alert, setAlert] = useState({ type: "", message: "", open: false });
  const closeAlert = () => setAlert(prev => ({ ...prev, open: false }));
  return { alert, setAlert, closeAlert };
}
