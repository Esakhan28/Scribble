# frozen_string_literal: true

class AddForeignKeyConstraints < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key "articles", "categories", on_delete: :cascade
    add_foreign_key "articles", "users"
    add_foreign_key "categories", "users", on_delete: :cascade
    add_foreign_key "redirections", "organizations", on_delete: :cascade
    add_foreign_key "users", "organizations", on_delete: :cascade
    add_foreign_key "visits", "articles", on_delete: :cascade
  end
end
