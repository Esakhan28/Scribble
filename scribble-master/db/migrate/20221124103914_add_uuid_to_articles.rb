# frozen_string_literal: true

class AddUuidToArticles < ActiveRecord::Migration[6.1]
  def change
    add_column :articles, :uuid, :uuid, default: "gen_random_uuid()", null: false
    rename_column :articles, :id, :articles_id
    rename_column :articles, :uuid, :id
    execute "ALTER TABLE articles drop constraint articles_pkey;"
    execute "ALTER TABLE articles ADD PRIMARY KEY (id);"
    remove_column :articles, :articles_id
  end
end
