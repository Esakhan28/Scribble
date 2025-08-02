# frozen_string_literal: true

if Rails.env.test? || Rails.env.heroku?
  require "sidekiq/testing"
  Sidekiq::Testing.inline!
end

Sidekiq::Extensions.enable_delay!

Sidekiq.configure_server do |config|
  config.redis = { url: Rails.application.secrets.redis_url, size: 9 }
  unless Rails.env.test? || Rails.env.production?
    schedule_file = "config/schedule.yml"

    if File.exist?(schedule_file)
      Sidekiq::Cron::Job.load_from_hash! YAML.load_file(schedule_file)[Rails.env]
    end
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: Rails.application.secrets.redis_url, size: 1 }
end
