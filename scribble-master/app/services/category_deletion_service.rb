# frozen_string_literal: true

class CategoryDeletionService
  attr_reader :id, :new_category_id, :current_user

  def initialize(id, new_category_id, current_user)
    @id = id
    @new_category_id = new_category_id
    @current_user = current_user
  end

  def process
    @category = current_user.categories.find(id)

    if @category.articles.count == 0
      destroy_category

      return
    end

    if current_user.categories.count == 1 && @category.name == "General"
      return
    end

    if current_user.categories.count == 1
      category = current_user.categories.create!(name: "General")
      @new_category_id = category.id
    end

    update_articles_category_id
    destroy_category
  end

  def update_articles_category_id
    articles = current_user.articles.where(category_id: id)
    article_ids = articles.map { |article| article.id }

    MoveArticlesService.new(current_user, article_ids, @new_category_id).process
  end

  def destroy_category
    @category.remove_from_list
    @category.destroy!
  end
end
