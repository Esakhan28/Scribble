# frozen_string_literal: true

class Article < ApplicationRecord
  MAX_TITLE_LENGTH = 50
  MAX_PAGE_SIZE = 10
  VALID_NAME_REGEX = /\w*[aA-zZ0-9]\w*/
  scope :accessible_to, ->(user_id) { where("user_id = ?", user_id) }

  acts_as_list scope: :category

  has_many :visits
  belongs_to :category
  belongs_to :user

  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }, format: {
    with: VALID_NAME_REGEX,
    message: "must contain at least one letter or number."
  }
  validates :status, :body, presence: true
  validate :slug_not_changed
  validate :article_scheduled_status_time, if: -> { scheduled_publish.present? or scheduled_unpublish.present? }
  validate :article_publish_scheduled_time, if: -> { scheduled_publish.present? }
  validate :article_unpublish_scheduled_time, if: -> { scheduled_unpublish.present? }

  paginates_per MAX_PAGE_SIZE
  has_paper_trail only: [:title, :body, :status, :category_id]

  before_create :set_slug, if: -> { status == "Published" }
  before_update :set_slug, if: -> { slug.nil? && status == "Published" }

  private

    def set_slug
      title_slug = title.parameterize
      latest_article_slug = Article.where(
        "slug LIKE ? or slug LIKE ?",
        "#{title_slug}",
        "#{title_slug}-%"
      ).order("LENGTH(slug) DESC", slug: :desc).first&.slug
      slug_count = 0
      if latest_article_slug.present?
        slug_count = latest_article_slug.split("-").last.to_i
        only_one_slug_exists = slug_count == 0
        slug_count = 1 if only_one_slug_exists
      end
      slug_candidate = slug_count.positive? ? "#{title_slug}-#{slug_count + 1}" : title_slug
      self.slug = slug_candidate
    end

    def slug_not_changed
      if slug_changed? && self.persisted?
        errors.add(:slug, t("article.slug.immutable"))
      end
    end

    def article_scheduled_status_time
      if scheduled_publish.present? && scheduled_publish < Time.zone.now
        errors.add(:article, t("article.scheduled.invalid_time"))
      end
      if scheduled_unpublish.present? && scheduled_unpublish < Time.zone.now
        errors.add(:article, t("article.scheduled.invalid_time"))
      end
    end

    def article_publish_scheduled_time
      if scheduled_unpublish.present? && status == "Published" && scheduled_publish <= scheduled_unpublish
        errors.add(:article, t("article.scheduled.publish"))
      end
      if scheduled_unpublish.nil? && status == "Published"
        errors.add(:article, t("article.scheduled.invalid_publish"))
      end
    end

    def article_unpublish_scheduled_time
      if scheduled_publish.present? && status == "Draft" && scheduled_unpublish <= scheduled_publish
        errors.add(:article, t("article.scheduled.unpublish"))
      end
      if scheduled_publish.nil? && status == "Draft"
        errors.add(:article, t("article.scheduled.invalid_unpublish"))
      end
    end
end
