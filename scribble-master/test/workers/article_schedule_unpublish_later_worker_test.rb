# frozen_string_literal: true

require "test_helper"

class ArticleScheduleUnpublishLaterWorkerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @time = Time.zone.now + 2.seconds
  end

  def test_should_unpublish_article_if_scheduled_unpublish_present_with_before_current_time
    test_article = create(
      :article, category: @category, user: @user, status: "Published",
      scheduled_unpublish: Time.zone.now + 1.second)
    travel_to @time

    ArticleScheduleUnpublishLaterWorker.perform_async

    assert_equal "Draft", test_article.reload.status
    assert_nil test_article.scheduled_unpublish
  end
end
