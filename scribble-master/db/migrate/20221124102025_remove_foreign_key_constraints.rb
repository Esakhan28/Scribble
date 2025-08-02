# frozen_string_literal: true

class RemoveForeignKeyConstraints < ActiveRecord::Migration[6.1]
  def change
    remove_foreign_key :articles, :categories
    remove_foreign_key :articles, :users
    remove_foreign_key :categories, :users
    remove_foreign_key :redirections, :organizations
    remove_foreign_key :users, :organizations
    remove_foreign_key :visits, :articles
  end
end
