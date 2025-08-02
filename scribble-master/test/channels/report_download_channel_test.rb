# frozen_string_literal: true

require "test_helper"

class ReportDownloadChannelTest < ActionCable::Channel::TestCase
  def setup
    @user = create(:user)
    @pubsub_token = @user.id
  end

  def test_subscribed
    subscribe pubsub_token: @pubsub_token
    assert subscription.confirmed?
    assert_has_stream @pubsub_token
    unsubscribe
  end

  def test_does_not_subscribe_without_pubsub_token
    subscribe pubsub_token: nil
    assert_no_streams
  end
end
