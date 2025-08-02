# frozen_string_literal: true

require "test_helper"

class Api::Admin::UserssControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
  end

  def test_should_show_organization_details
    get api_admin_user_path
    assert_response :success

    response_json = response.parsed_body
    assert_equal @user.id, response_json["id"]
  end
end
