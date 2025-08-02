# frozen_string_literal: true

class ArticleSchedulePublishLaterService
  attr_accessor :article

  def initialize(article)
    @article = article
  end

  def process
    publish
  end

  private

    def publish
      article.update!(status: "Published", scheduled_publish: nil)
    end
end
