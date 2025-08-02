# frozen_string_literal: true

class AddUuidToVisit < ActiveRecord::Migration[6.1]
  def change
    add_column :visits, :uuid, :uuid, default: "gen_random_uuid()", null: false
    rename_column :visits, :id, :visits_id
    rename_column :visits, :uuid, :id
    execute "ALTER TABLE visits drop constraint visits_pkey;"
    execute "ALTER TABLE visits ADD PRIMARY KEY (id);"
    remove_column :visits, :visits_id
  end
end
