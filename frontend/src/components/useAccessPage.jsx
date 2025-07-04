import { useEffect, useState } from "react";
import axios from "axios";
import api from "../libs/apiCall";

const usePageAccess = (component) => {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      try {
        const res = await api.post(
          "/auth/check",
          { component },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          setAllowed(true);
        }
      } catch (err) {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [component]);

  return { allowed, loading };
};

export default usePageAccess;
