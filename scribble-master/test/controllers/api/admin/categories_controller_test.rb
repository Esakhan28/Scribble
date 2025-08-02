# frozen_string_literal: true

require "test_helper"

class Api::Admin::CategoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
  end

  def test_should_create_category
    post api_admin_categories_path, params: { category: { name: "Getting Started", user: @user } }
    assert_response :success

    response_json = response.parsed_body
    assert_equal t("successfully_created", entity: "Category"), response_json["notice"]
  end

  def test_should_update_category
    category_params = { category: { name: "Updated title" } }
    put api_admin_category_path(@category.id), params: category_params
    assert_response :success

    response_json = response.parsed_body
    assert_equal t("successfully_updated", entity: "Category"), response_json["notice"]
  end

  def test_should_destroy_category
    test_category = create(:category, user: @user)
    assert_difference "Category.count", -1 do
      delete api_admin_category_path(test_category.id)
    end
    assert_response :ok

    response_json = response.parsed_body
    assert_equal t("successfully_deleted", entity: "Category"), response_json["notice"]
  end

  def test_should_update_category_position
    first_category = create(:category, user: @user)
    second_category = create(:category, user: @user)
    third_category = create(:category, user: @user)

    put position_update_api_admin_category_path(first_category.id),
      params: { new_position: third_category.position }
    assert_response :success

    response_json = response.parsed_body
    assert_equal t("position_updated", entity: "Category"), response_json["notice"]
  end

  def test_should_list_all_categories
    get api_admin_categories_path
    assert_response :success

    response_json = response.parsed_body
    all_categories = @user.categories.count
    assert_equal all_categories, response_json.count
  end

  def test_should_show_articles_of_given_category
    get api_admin_category_path(@category.id)
    assert_response :success

    response_json = response.parsed_body
    all_articles_count_of_category = @category.articles.count
    assert_equal all_articles_count_of_category, response_json["articles"].count
  end
end
