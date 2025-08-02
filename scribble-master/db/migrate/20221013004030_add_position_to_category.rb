# frozen_string_literal: true

class AddPositionToCategory < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :position, :integer
  end
end
