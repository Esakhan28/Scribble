# frozen_string_literal: true

class ChangeArticleTable < ActiveRecord::Migration[6.1]
  def change
    change_column_null :articles, :title, false
    change_column_null :articles, :description, false
    change_column :articles, :status, :string, default: "Draft"
    add_column :articles, :assigned_category_id, :integer
  end
end
