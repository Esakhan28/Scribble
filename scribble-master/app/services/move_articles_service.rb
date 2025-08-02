# frozen_string_literal: true

class MoveArticlesService
  attr_reader :current_user, :article_ids, :category_id

  def initialize(current_user, article_ids, category_id)
    @current_user = current_user
    @article_ids = article_ids
    @category_id = category_id
  end

  def process
    articles = current_user.articles.where(id: article_ids)
    articles.each do |article|
      current_user.articles.find(article.id).remove_from_list
    end

    articles = current_user.articles.where(id: article_ids)
    articles.update(category_id: category_id)
  end
end
