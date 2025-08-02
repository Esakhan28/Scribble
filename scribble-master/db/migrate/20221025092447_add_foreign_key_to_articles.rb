# frozen_string_literal: true

class AddForeignKeyToArticles < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key :articles, :users
  end
end
