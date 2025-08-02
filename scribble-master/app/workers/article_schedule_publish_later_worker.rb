# frozen_string_literal: true

class ArticleSchedulePublishLaterWorker
  include Sidekiq::Worker

  def perform
    publish_later
  end

  private

    def publish_later
      articles = Article.select { |article|
        (article.scheduled_publish and article.scheduled_publish <= Time.zone.now)
      }

      articles.each do |article|
        article_schedule_publish_later = ArticleSchedulePublishLaterService.new(article)
        article_schedule_publish_later.process
      end
    end
end
