# frozen_string_literal: true

class RenameSiteToOrganization < ActiveRecord::Migration[6.1]
  def change
    rename_table :sites, :organizations
  end
end
