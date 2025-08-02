# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :redirect, only: :index

  def index
    render
  end

  private

    def redirect
      from_path = request.path
      redirection = current_organization.redirections.find_by(from: from_path)
      if redirection != nil
        redirect_to redirection.to, status: :moved_permanently
      end
    end
end
