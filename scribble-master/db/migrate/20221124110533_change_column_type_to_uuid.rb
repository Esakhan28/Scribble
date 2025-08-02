# frozen_string_literal: true

class ChangeColumnTypeToUuid < ActiveRecord::Migration[6.1]
  def change
    remove_column :articles, :user_id
    add_column :articles, :user_id, :uuid
    remove_column :articles, :category_id
    add_column :articles, :category_id, :uuid
    remove_column :categories, :user_id
    add_column :categories, :user_id, :uuid
    remove_column :redirections, :organization_id
    add_column :redirections, :organization_id, :uuid
    remove_column :users, :organization_id
    add_column :users, :organization_id, :uuid
    remove_column :visits, :article_id
    add_column :visits, :article_id, :uuid
  end
end
