# frozen_string_literal: true

class CreateVisits < ActiveRecord::Migration[6.1]
  def change
    create_table :visits do |t|
      t.integer :visit, default: 0
      t.integer :article_id
      t.timestamps
    end
  end
end
