# frozen_string_literal: true

class Organization < ApplicationRecord
  MAX_NAME_LENGTH = 50
  MIN_PASSWORD_LENGTH = 6
  VALID_NAME_REGEX = /\w*[aA-zZ]\w*/
  VALID_PASSWORD_REGEX = /[^wd]*(([0-9]+.*[A-Za-z]+.*)|[A-Za-z]+.*([0-9]+.*))/

  has_many :users
  has_many :redirections

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }, format: {
    with: VALID_NAME_REGEX,
    message: "must contain at least one letter."
  }
  validates :password, length: { minimum: MIN_PASSWORD_LENGTH },
    format: {
      with: VALID_PASSWORD_REGEX,
      message: "requires 1 letter and 1 number"
    }, if: -> { password.present? }

  has_secure_password validations: false
  has_secure_token :authentication_token

  before_save :regenerate_authentication_token, if: -> { password_digest_changed? }

  private

    def regenerate_authentication_token
      self.authentication_token = SecureRandom.hex(10)
    end
end
