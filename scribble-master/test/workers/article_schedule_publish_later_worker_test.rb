# frozen_string_literal: true

require "test_helper"

class ArticleSchedulePublishLaterWorkerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @time = Time.zone.now + 2.seconds
  end

  def test_should_publish_article_if_scheduled_publish_present_with_before_current_time
    test_article = create(:article, category: @category, user: @user, scheduled_publish: Time.zone.now + 1.second)
    travel_to @time

    ArticleSchedulePublishLaterWorker.perform_async

    assert_equal "Published", test_article.reload.status
    assert_nil test_article.scheduled_publish
  end
end
