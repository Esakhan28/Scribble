# frozen_string_literal: true

class ArticleScheduleUnpublishLaterWorker
  include Sidekiq::Worker

  def perform
    unpublish_later
  end

  private

    def unpublish_later
      articles = Article.select { |article|
        (article.scheduled_unpublish and article.scheduled_unpublish <= Time.zone.now)
      }

      articles.each do |article|
        article_schedule_unpublish_later = ArticleScheduleUnpublishLaterService.new(article)
        article_schedule_unpublish_later.process
      end
    end
end
