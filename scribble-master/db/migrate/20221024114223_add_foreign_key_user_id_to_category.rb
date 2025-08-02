# frozen_string_literal: true

class AddForeignKeyUserIdToCategory < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :user_id, :integer, default: 1, null: false
    add_foreign_key :categories, :users, on_delete: :cascade
  end
end
