# frozen_string_literal: true

class AddVersionStatusColumnToArticle < ActiveRecord::Migration[6.1]
  def change
    add_column :articles, :version_status, :boolean, default: false
    add_column :articles, :restored_at, :datetime, default: nil
  end
end
