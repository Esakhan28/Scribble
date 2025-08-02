# frozen_string_literal: true

require "test_helper"

class ArticlesFilterServiceTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_list_all_articles_if_articles_status_is_all
    first_article = create(:article, category: @category, user: @user)
    second_article = create(:article, category: @category, user: @user)

    filtered_data = ArticlesFilterService.new(@user.articles, "All", [], "").process
    assert_equal @user.articles, filtered_data
  end

  def test_should_filter_articles_by_search_term
    first_article = create(:article, title: "first", category: @category, user: @user)
    second_article = create(:article, title: "second", category: @category, user: @user)
    third_article = create(:article, title: "third", category: @category, user: @user)

    filtered_data = ArticlesFilterService.new(@user.articles, "", [], "first").process
    assert_equal [first_article], filtered_data
  end

  def test_should_filter_articles_by_categories
    test_category = create(:category, user: @user)
    first_article = create(:article, category: test_category, user: @user)
    second_article = create(:article, category: test_category, user: @user)
    third_article = create(:article, category: @category, user: @user)

    filtered_data = ArticlesFilterService.new(@user.articles, "", [test_category.id], "").process
    assert_equal [first_article, second_article], filtered_data
  end

  def test_should_filter_articles_by_status
    first_article = create(:article, status: "Published", category: @category, user: @user)
    second_article = create(:article, status: "Published", category: @category, user: @user)
    third_article = create(:article, category: @category, user: @user)

    filtered_data = ArticlesFilterService.new(@user.articles, "Published", [], "").process
    assert_equal [first_article, second_article], filtered_data
  end

  def test_should_filter_articles_by_status_and_search_term
    first_article = create(:article, title: "first", category: @category, user: @user)
    second_article = create(:article, status: "Published", title: "second", category: @category, user: @user)
    third_article = create(:article, title: "third", category: @category, user: @user)

    filtered_data = ArticlesFilterService.new(@user.articles, "Published", [], "second").process
    assert_equal [second_article], filtered_data
  end

  def test_should_filter_articles_by_status_and_categories
    test_category = create(:category, user: @user)
    first_article = create(:article, status: "Published", category: test_category, user: @user)
    second_article = create(:article, category: test_category, user: @user)
    third_article = create(:article, status: "Published", category: @category, user: @user)

    filtered_data = ArticlesFilterService.new(
      @user.articles, "Published", [test_category.id, @category.id],
      "").process
    assert_equal [first_article, third_article], filtered_data
  end

  def test_should_filter_articles_by_category_and_search_term
    test_category = create(:category, user: @user)
    first_article = create(:article, title: "first", category: @category, user: @user)
    second_article = create(:article, title: "second", category: test_category, user: @user)
    third_article = create(:article, title: "third", category: test_category, user: @user)

    filtered_data = ArticlesFilterService.new(@user.articles, "", [test_category.id], "sec").process
    assert_equal [second_article], filtered_data
  end

  def test_should_filter_articles_by_status_category_and_search_term
    test_category = create(:category, user: @user)
    first_article = create(:article, title: "first", category: @category, user: @user)
    second_article = create(:article, title: "third", category: test_category, user: @user)
    third_article = create(:article, status: "Published", title: "third", category: test_category, user: @user)

    filtered_data = ArticlesFilterService.new(@user.articles, "Published", [test_category.id], "thi").process
    assert_equal [third_article], filtered_data
  end
end
