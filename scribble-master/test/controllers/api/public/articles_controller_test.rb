# frozen_string_literal: true

require "test_helper"

class Api::Public::ArticlesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization, is_password_protected: false)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_list_all_published_articles
    @article.status = "Published"
    @article.save!
    get api_public_articles_path
    assert_response :success

    response_json = response.parsed_body
    all_articles = @user.articles.where(status: "Published").count
    assert_equal all_articles, response_json["articles"].count
  end

  def test_should_update_visits_count_on_show
    test_article = create(:article, status: "Published", category: @category, user: @user)
    article_visits = test_article.visits.sum(:visit)

    get api_public_article_path(test_article.slug)
    assert_response :ok

    assert_equal article_visits + 1, test_article.visits.sum(:visit)
  end

  def test_shouldnt_list_articles_if_user_is_unauthorized
    @organization.is_password_protected = true
    @organization.save!
    get api_public_articles_path
    assert_response :unauthorized

    response_json = response.parsed_body
    assert_equal t("organization.could_not_auth"), response_json["error"]
  end
end
