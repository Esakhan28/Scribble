# frozen_string_literal: true

class RenameDescriptionToBody < ActiveRecord::Migration[6.1]
  def change
    rename_column :articles, :description, :body
  end
end
