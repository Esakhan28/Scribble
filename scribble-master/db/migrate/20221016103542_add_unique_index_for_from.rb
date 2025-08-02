# frozen_string_literal: true

class AddUniqueIndexForFrom < ActiveRecord::Migration[6.1]
  def change
    add_index :redirections, :from, unique: true
  end
end
