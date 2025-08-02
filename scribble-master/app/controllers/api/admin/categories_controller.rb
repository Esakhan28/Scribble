# frozen_string_literal: true

class Api::Admin::CategoriesController < ApplicationController
  before_action :load_category!, only: %i[update position_update show]

  def index
    @categories = current_user.categories.order("position ASC")
    render
  end

  def create
    current_user.categories.create! category_params
    respond_with_success(t("successfully_created", entity: "Category"))
  end

  def update
    @category.update!(category_params)
    respond_with_success(t("successfully_updated", entity: "Category"))
  end

  def destroy
    CategoryDeletionService.new(params[:id], params[:new_category_id], current_user).process
    respond_with_success(t("successfully_deleted", entity: "Category"))
  end

  def show
    render
  end

  def position_update
    @category.insert_at(params[:new_position].to_i)
    respond_with_success(t("position_updated", entity: "Category"))
  end

  private

    def category_params
      params.require(:category).permit(:name)
    end

    def load_category!
      @category = current_user.categories.find(params[:id])
    end
end
