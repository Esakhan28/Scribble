# frozen_string_literal: true

require "test_helper"

class Api::Admin::RedirectionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @redirection = create(:redirection, organization: @organization)
  end

  def test_should_create_redirection
    test_redirection = build(:redirection, organization: @organization)
    post api_admin_redirections_path, params: {
      redirection: {
        from: test_redirection.from,
        to: test_redirection.to, organization: @organization
      }
    }
    assert_response :success

    response_json = response.parsed_body
    assert_equal t("successfully_created", entity: "Redirection"), response_json["notice"]
  end

  def test_should_destroy_redirection
    delete api_admin_redirection_path(@redirection.id)
    assert_response :success

    response_json = response.parsed_body
    assert_equal t("successfully_deleted", entity: "Redirection"), response_json["notice"]
  end

  def test_should_update_redirection
    put api_admin_redirection_path(@redirection.id), params: {
      redirection: {
        from: "https://lacalhost:3000/settings",
        to: "https://lacalhost:3000/settings/general"
      }
    }
    assert_response :success

    response_json = response.parsed_body
    assert_equal t("successfully_updated", entity: "Redirection"), response_json["notice"]
  end

  def test_should_list_all_redirections
    get api_admin_redirections_path
    assert_response :success

    response_json = response.parsed_body
    all_redirections = @organization.redirections.count
    assert_equal all_redirections, response_json["redirections"].count
  end

  def test_redirection_should_be_invalid_if_from_and_to_path_are_same
    put api_admin_redirection_path(@redirection.id), params: {
      redirection: {
        from: "https://lacalhost:3000/settings",
        to: "https://lacalhost:3000/settings"
      }
    }
    assert_response :unprocessable_entity

    response_json = response.parsed_body
    assert_match t("redirection.equal_path"), response_json["error"]
  end
end
