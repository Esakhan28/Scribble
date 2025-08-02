# frozen_string_literal: true

require "test_helper"

class Api::Admin::ArticlesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_list_all_articles
    get api_admin_articles_path
    assert_response :success

    response_json = response.parsed_body
    all_articles = @user.articles.count
    assert_equal all_articles, response_json["articles"].count
  end

  def test_should_destroy_article
    assert_difference "Article.count", -1 do
      delete api_admin_article_path(@article.id)
    end
    assert_response :ok

    response_json = response.parsed_body
    assert_equal t("successfully_deleted", entity: "Article"), response_json["notice"]
  end

  def test_should_create_article
    post api_admin_articles_path,
      params: {
        article: {
          title: @article.title, category_id: @category.id, user_id: @user.id,
          body: @article.body
        }
      }
    assert_response :success

    response_json = response.parsed_body
    assert_equal t("successfully_created", entity: "Article"), response_json["notice"]
  end

  def test_should_update_article
    article_params = { article: { title: "Updated title", body: "Updated body", status: "Published" } }
    put api_admin_article_path(@article.id), params: article_params
    assert_response :success

    response_json = response.parsed_body
    assert_equal t("successfully_updated", entity: "Article"), response_json["notice"]
  end

  def test_should_list_all_published_articles
    get published_list_api_admin_articles_path
    assert_response :success

    response_json = response.parsed_body
    all_published_articles = @user.articles.where(status: "Published").count
    assert_equal all_published_articles, response_json["articles"].count
  end

  def test_should_list_all_versions_of_an_article
    @article.title = "test article title"
    @article.save!
    get versions_api_admin_article_path(@article.id)
    assert_response :success
    response_json = response.parsed_body

    all_version_count = @article.versions.count
    assert_equal all_version_count, response_json["article_versions"].count
  end

  def test_should_list_all_articles_according_to_categories
    test_category = create(:category, user: @user)
    first_article = create(:article, status: "Published", category: test_category, user: @user)
    second_article = create(:article, status: "Published", category: @category, user: @user)
    third_article = create(:article, category: test_category, user: @user)

    get count_api_admin_articles_path(category_ids: [@category.id, test_category.id])
    assert_response :success

    response_json = response.parsed_body
    category_articles_count = @category.articles.count
    test_category_articles_count = test_category.articles.count

    total_articles_count = category_articles_count + test_category_articles_count
    assert_equal total_articles_count, response_json["all"]
  end

  def test_should_show_article
    get api_admin_article_path(@article.id)
    assert_response :success

    response_json = response.parsed_body
    assert_equal @article.id, response_json["id"]
  end

  def test_should_not_show_article_with_invalid_id
    @article.destroy!
    get api_admin_article_path(@article.id)
    assert_response :not_found
  end

  def test_should_not_update_article_if_parameter_missing
    article_params = { article: {} }
    put api_admin_article_path(@article.id), params: article_params
    assert_response :internal_server_error
  end

  def test_should_update_article_position
    first_article = create(:article, category: @category, user: @user)
    second_article = create(:article, category: @category, user: @user)
    third_article = create(:article, category: @category, user: @user)

    put position_update_api_admin_article_path(first_article.id),
      params: { new_position: third_article.position }
    assert_response :success

    response_json = response.parsed_body
    assert_equal t("position_updated", entity: "Article"), response_json["notice"]
  end

  def test_should_move_articles_to_selected_category
    test_category = create(:category, user: @user)
    first_article = create(:article, category: @category, user: @user)
    second_article = create(:article, category: @category, user: @user)

    test_category_articles_count = test_category.articles.count
    put move_api_admin_articles_path,
      params: { article_ids: [first_article.id, second_article.id], category_id: test_category.id }
    assert_response :success

    response_json = response.parsed_body
    assert_equal t("moved", entity: "Articles"), response_json["notice"]
    assert_not_equal test_category_articles_count, test_category.articles.count
  end
end
