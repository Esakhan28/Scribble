# frozen_string_literal: true

class Category < ApplicationRecord
  MAX_NAME_LENGTH = 60
  VALID_NAME_REGEX = /\w*[aA-zZ]\w*/

  acts_as_list scope: :user

  has_many :articles
  belongs_to :user

  validates :name, presence: true, uniqueness: true, length: { maximum: MAX_NAME_LENGTH }, format: {
    with: VALID_NAME_REGEX,
    message: "must contain at least one letter."
  }
end
