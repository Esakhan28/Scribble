# frozen_string_literal: true

class AddUserIdDefaultValueToArticle < ActiveRecord::Migration[6.1]
  def change
    change_column_default :articles, :user_id, 1
  end
end
