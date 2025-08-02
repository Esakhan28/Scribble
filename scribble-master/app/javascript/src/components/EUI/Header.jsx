import React, { useState, useEffect } from "react";

import { Search } from "neetoicons";
import { Typography, PageLoader, Kbd } from "neetoui";

import { organizationsApi } from "apis/admin";

const Header = ({ isEUI, setShowSearchBar }) => {
  const [organizationData, setOrganizationData] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    fetchOrganizationDetails();
  }, []);

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      const { data } = await organizationsApi.fetch();
      setOrganizationData(data);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-full border-b-2">
      {isEUI && (
        <div className="mt-2 ml-8 h-10 w-3/12">
          <div
            className="border flex cursor-text justify-between rounded-sm"
            onClick={() => setShowSearchBar(true)}
          >
            <Typography className="m-1 flex text-gray-400">
              <Search />
              Search for articles here.
            </Typography>
            <div className="mt-1 flex gap-x-1">
              <Kbd keyName="⌘" />
              <Kbd className="mr-1" keyName="K" />
            </div>
          </div>
        </div>
      )}
      <div className="w-full">
        <Typography className="flex justify-center py-3" style="h4">
          {organizationData.name}
        </Typography>
      </div>
    </div>
  );
};

export default Header;
