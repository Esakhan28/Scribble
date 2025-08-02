# frozen_string_literal: true

require "test_helper"

class ArticlesCountServiceTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_show_all_articles_status_count_if_no_category_selected
    test_category = create(:category, user: @user)
    first_article = create(:article, category: test_category, user: @user)
    second_article = create(:article, category: @category, user: @user)

    articles_count = ArticlesCountService.new(@user.articles, []).process
    assert_equal @user.articles.count, articles_count[:all]
  end

  def test_should_show_articles_status_count_of_category_selected
    test_category = create(:category, user: @user)
    first_article = create(:article, category: test_category, user: @user)
    second_article = create(:article, category: @category, user: @user)

    articles_count = ArticlesCountService.new(@user.articles, [@category.id]).process
    assert_equal @category.articles.count, articles_count[:all]
  end
end
