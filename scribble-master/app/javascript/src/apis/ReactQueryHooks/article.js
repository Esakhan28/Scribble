import { useMutation, useQuery } from "react-query";

import { articlesApi } from "apis/admin";

const generatePdf = async () => {
  try {
    await articlesApi.generatePdf();
  } catch (error) {
    logger.error(error);
  }
};

const downloadPdf = () => articlesApi.download();

export const useGeneratePdf = () => useMutation({ mutationFn: generatePdf });

export const useDownloadPdf = () => useQuery("download-pdf", downloadPdf);
