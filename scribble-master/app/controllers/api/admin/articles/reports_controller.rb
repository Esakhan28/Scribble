# frozen_string_literal: true

class Api::Admin::Articles::ReportsController < ApplicationController
  def create
    ReportsWorker.perform_async(current_user.id, report_path)
  end

  def download
    if File.exist?(report_path)
      send_file(
        report_path,
        type: "application/pdf",
        filename: pdf_file_name,
        disposition: "attachment"
      )
    else
      respond_with_error(t("not_found", entity: "report"), :not_found)
    end
  end

  private

    def report_path
      @_report_path ||= Rails.root.join("tmp/#{pdf_file_name}")
    end

    def pdf_file_name
      "scribble_articles_report.pdf"
    end
end
