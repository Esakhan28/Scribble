# frozen_string_literal: true

require "test_helper"

class CategoryDeletionServiceTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_move_articles_to_new_category
    first_category_articles_count = @category.articles.count
    second_category = create(:category, user: @user)
    create(:article, category: second_category, user: @user)
    create(:article, category: second_category, user: @user)
    create(:article, category: second_category, user: @user)

    total_articles_count_of_both_categories = first_category_articles_count + second_category.articles.count

    CategoryDeletionService.new(second_category.id, @category.id, @user).process
    assert_equal total_articles_count_of_both_categories, @category.articles.count
  end

  def test_should_move_articles_to_category_general_if_last_category
    first_article = create(:article, category: @category, user: @user)
    second_article = create(:article, category: @category, user: @user)

    articles_count = @category.articles.count

    CategoryDeletionService.new(@category.id, nil, @user).process
    new_category = @user.categories.first

    assert_equal "General", new_category.name
    assert_equal articles_count, new_category.articles.count
  end

  def test_should_not_delete_last_category_general
    @category.name = "General"
    @category.save!
    categories_count = @user.categories.count

    CategoryDeletionService.new(@category.id, nil, @user).process

    assert_equal categories_count, @user.categories.count
    assert_equal "General", @user.categories.first.name
  end

  def test_should_delete_last_category_with_no_articles
    @article.destroy!
    categories_count = @user.categories.count

    CategoryDeletionService.new(@category.id, nil, @user).process

    assert_not_equal categories_count, @user.categories.count
  end
end
