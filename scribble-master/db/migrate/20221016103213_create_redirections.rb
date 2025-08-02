# frozen_string_literal: true

class CreateRedirections < ActiveRecord::Migration[6.1]
  def change
    create_table :redirections do |t|
      t.text :from, null: false
      t.text :to, null: false

      t.timestamps
    end
  end
end
