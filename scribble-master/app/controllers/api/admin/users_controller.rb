# frozen_string_literal: true

class Api::Admin::UsersController < ApplicationController
  before_action :current_user, only: :show

  def show
    render
  end
end
