# frozen_string_literal: true

module Authenticable
  extend ActiveSupport::Concern

  private

    def authenticate_user_using_x_auth_token
      auth_token = request.headers["X-Auth-Token"]
      is_valid_token = auth_token && ActiveSupport::SecurityUtils.secure_compare(
        current_organization.authentication_token, auth_token)

      unless is_valid_token || current_organization.is_password_protected == false
        respond_with_error(t("organization.could_not_auth"), :unauthorized)
      end
    end
end
