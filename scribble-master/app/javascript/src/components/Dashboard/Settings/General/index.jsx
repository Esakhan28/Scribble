import React, { useEffect, useState } from "react";

import { Typography, PageLoader } from "neetoui";

import { organizationsApi } from "apis/admin";
import { convertSnakeCaseKeysToCamelCase } from "components/utils";

import Form from "./Form";

const General = () => {
  const [organizationData, setOrganizationData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizationDetails();
  }, []);

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      const { data } = await organizationsApi.fetch();
      const organization = convertSnakeCaseKeysToCamelCase(data);
      setOrganizationData({
        name: organization.name,
        isPasswordProtected: organization.isPasswordProtected,
      });
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
    <div className="mx-auto mt-8 w-4/12">
      <Typography className="h-10" style="h2">
        General
      </Typography>
      <Typography className="text-gray-500" style="body1">
        Configure general attributes of scribble.
      </Typography>
      <div className="mt-8">
        <Form
          organizationData={organizationData}
          refetch={fetchOrganizationDetails}
        />
      </div>
    </div>
  );
};

export default General;
