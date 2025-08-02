# frozen_string_literal: true

class AddPosiitonToArticle < ActiveRecord::Migration[6.1]
  def change
    add_column :articles, :position, :integer
  end
end
