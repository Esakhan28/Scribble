# frozen_string_literal: true

class RenamePasswordToPasswordDigestInSite < ActiveRecord::Migration[6.1]
  def change
    rename_column :sites, :password, :password_digest
  end
end
