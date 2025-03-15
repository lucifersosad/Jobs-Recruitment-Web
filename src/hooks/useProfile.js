import { useEffect, useState } from "react";

const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  const getProfile = async () => {
    const result = await getProfile("67585c031a46cc7de695328b");
    setData(result?.data);
  };

  useEffect(() => {
    const getFullData = async () => {
      await getProfile();
      setLoading(false);
    };
    getFullData();
  }, []);

  return [loading, data, getProfile];
};

export default useProfile
