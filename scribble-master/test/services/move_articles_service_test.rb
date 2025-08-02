# frozen_string_literal: true

require "test_helper"

class MoveArticlesServiceTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_move_articles_to_selected_category
    test_category = create(:category, user: @user)
    first_article = create(:article, category: @category, user: @user)
    second_article = create(:article, category: @category, user: @user)

    moved_articles = MoveArticlesService.new(@user, [first_article.id, second_article.id], test_category.id).process

    assert_equal test_category.articles, moved_articles
  end
end
