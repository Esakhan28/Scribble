# frozen_string_literal: true

class Api::Public::CategoriesController < ApplicationController
  before_action :authenticate_user_using_x_auth_token

  def index
    @categories = current_user.categories.order("position ASC")
    render
  end
end
