# frozen_string_literal: true

class User < ApplicationRecord
  MAX_NAME_LENGTH = 30
  VALID_NAME_REGEX = /\w*[aA-zZ]\w*/
  VALID_EMAIL_REGEX = /\A([\w+\-].?)+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i.freeze

  belongs_to :organization
  has_many :categories
  has_many :articles

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }, format: {
    with: VALID_NAME_REGEX,
    message: "must contain at least one letter."
  }
  validates :email, presence: true, uniqueness: true, format: { with: VALID_EMAIL_REGEX }

  before_save :to_lowercase

  private

    def to_lowercase
      email.downcase!
    end
end
