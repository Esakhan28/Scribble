# frozen_string_literal: true

class ArticlesCountService
  attr_accessor :articles, :category_ids

  def initialize(articles, category_ids)
    @articles = articles
    @category_ids = category_ids
  end

  def process
    if category_ids.present?
      self.articles = articles.where(category_id: category_ids)
    end

    articles_count = Hash.new
    articles_count[:all] = self.articles.count
    articles_count[:published] = self.articles.where(status: "Published").count
    articles_count[:draft] = self.articles.where(status: "Draft").count

    articles_count
  end
end
