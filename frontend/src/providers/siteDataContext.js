"use client";

import { getSiteData } from "@/services/setting.service";
import { createContext, useContext, useEffect, useState } from "react";

const SiteDataContext = createContext(null);

const SiteDataProvider = ({ children }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    (async () => {
      const res = await getSiteData();

      setData(res);
    })();
  }, []);

  const value = {
    ...data,
    socialMedia: data?.socialMedia ? JSON.parse(data.socialMedia) : "",
  };

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const value = useContext(SiteDataContext);
  return value;
};
export default SiteDataProvider;
