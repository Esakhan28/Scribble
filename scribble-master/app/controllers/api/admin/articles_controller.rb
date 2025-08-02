# frozen_string_literal: true

class Api::Admin::ArticlesController < ApplicationController
  before_action :load_article!, only: %i[destroy update show versions position_update]

  def index
    @articles = ArticlesFilterService.new(
      current_user.articles, params[:status],
      params[:category_ids], params[:search_term]).process
    @count = @articles.count
    @articles = @articles.order("updated_at DESC").page(params[:page_number])
    render
  end

  def count
    @articles_count = ArticlesCountService.new(current_user.articles, params[:category_ids]).process
    render
  end

  def published_list
    @articles = current_user.articles.where(status: "Published").order("updated_at DESC")
    @count = @articles.count
    @articles = @articles.page(params[:page_number])
    render
  end

  def create
    current_user.articles.create! article_params
    respond_with_success(t("successfully_created", entity: "Article"))
  end

  def update
    @article.update!(article_params)
    respond_with_success(t("successfully_updated", entity: "Article"))
  end

  def destroy
    @article.remove_from_list
    @article.destroy!
    respond_with_success(t("successfully_deleted", entity: "Article"))
  end

  def show
    render
  end

  def versions
    @article_versions = @article.versions
    render
  end

  def position_update
    @article.insert_at(params[:new_position].to_i)
    respond_with_success(t("position_updated", entity: "Article"))
  end

  def move
    MoveArticlesService.new(current_user, params[:article_ids], params[:category_id]).process
    respond_with_success(t("moved", entity: "Articles"))
  end

  private

    def article_params
      params.require(:article).permit(
        :title, :body, :category_id, :status, :version_status, :restored_at,
        :scheduled_publish, :scheduled_unpublish)
    end

    def load_article!
      @article = current_user.articles.find(params[:id])
    end
end
