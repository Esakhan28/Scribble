# frozen_string_literal: true

class AddScheduleColumnsToArticle < ActiveRecord::Migration[6.1]
  def change
    add_column :articles, :scheduled_publish, :datetime
    add_column :articles, :scheduled_unpublish, :datetime
  end
end
