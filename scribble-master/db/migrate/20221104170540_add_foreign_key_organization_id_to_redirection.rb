# frozen_string_literal: true

class AddForeignKeyOrganizationIdToRedirection < ActiveRecord::Migration[6.1]
  def change
    add_column :redirections, :organization_id, :integer, null: false
    add_foreign_key :redirections, :organizations, on_delete: :cascade
  end
end
