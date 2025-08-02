# frozen_string_literal: true

class Api::Public::CategoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization, is_password_protected: false)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
  end

  def test_should_list_all_categories
    get api_public_categories_path
    assert_response :success

    response_json = response.parsed_body
    all_categories = @user.categories.count
    assert_equal all_categories, response_json.count
  end
end
