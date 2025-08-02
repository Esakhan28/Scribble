# frozen_string_literal: true

class AddForeignKeyCategoryIdToArticle < ActiveRecord::Migration[6.1]
  def change
    change_column_null :articles, :category_id, false
    change_column_null :articles, :user_id, false
    add_foreign_key :articles, :categories, on_delete: :cascade
  end
end
