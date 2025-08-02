# frozen_string_literal: true

require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
  end

  def test_should_get_successfully_from_root_url
    get root_path
    assert_response :success
  end

  def test_should_redirect_from_redirection_from_path
    test_redirection = @organization.redirections.create(from: "/1", to: "/2")
    get test_redirection.from
    assert_response :moved_permanently

    assert_redirected_to test_redirection.to
  end
end
