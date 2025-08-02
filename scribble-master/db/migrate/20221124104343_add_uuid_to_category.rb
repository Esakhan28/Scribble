# frozen_string_literal: true

class AddUuidToCategory < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :uuid, :uuid, default: "gen_random_uuid()", null: false
    rename_column :categories, :id, :categories_id
    rename_column :categories, :uuid, :id
    execute "ALTER TABLE categories drop constraint categories_pkey;"
    execute "ALTER TABLE categories ADD PRIMARY KEY (id);"
    remove_column :categories, :categories_id
  end
end
