# frozen_string_literal: true

require "test_helper"

class ArticleScheduleUnpublishLaterServiceTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
    @time = Time.zone.now + 2.seconds
  end

  def test_should_unpublish_article_if_scheduled_unpublish_present_with_before_current_time
    @article.status = "Published"
    @article.scheduled_unpublish = Time.zone.now + 1.second
    travel_to @time

    ArticleScheduleUnpublishLaterService.new(@article).process

    assert_equal "Draft", @article.reload.status
    assert_nil @article.scheduled_unpublish
  end
end
