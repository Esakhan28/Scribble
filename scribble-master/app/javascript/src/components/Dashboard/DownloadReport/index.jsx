import React, { useState, useEffect } from "react";

import FileSaver from "file-saver";
import { Button } from "neetoui";

import { useGeneratePdf, useDownloadPdf } from "apis/ReactQueryHooks/article";
import createConsumer from "channels/consumer";
import { subscribeToReportDownloadChannel } from "channels/reportDownloadChannel";
import ProgressBar from "components/Common/ProgressBar";

const DownloadReport = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const { mutate: generatePdf } = useGeneratePdf();
  const { data: downloadPdfResponse, refetch: downloadPdf } = useDownloadPdf();

  const consumer = createConsumer();

  const handleDownloadPdf = async () => {
    try {
      await downloadPdf();
      FileSaver.saveAs(
        downloadPdfResponse.data,
        "scribble_articles_report.pdf"
      );
    } catch (error) {
      logger.error(error);
    }
  };

  useEffect(() => {
    subscribeToReportDownloadChannel({
      consumer,
      setMessage,
      setProgress,
      generatePdf,
    });

    return () => {
      consumer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false);
      setMessage("Report is ready to be downloaded");
    }
  }, [progress]);

  return (
    <div className="mx-auto mt-48 w-3/6 space-y-6 rounded-md border-2 p-4 text-center">
      <h1>{message}</h1>
      <ProgressBar progress={progress} />
      <Button
        label={isLoading ? "Loading" : "Download"}
        loading={isLoading}
        size="medium"
        onClick={handleDownloadPdf}
      />
    </div>
  );
};

export default DownloadReport;
