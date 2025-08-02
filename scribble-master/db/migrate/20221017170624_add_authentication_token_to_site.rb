# frozen_string_literal: true

class AddAuthenticationTokenToSite < ActiveRecord::Migration[6.1]
  def change
    add_column :sites, :authentication_token, :string
  end
end
