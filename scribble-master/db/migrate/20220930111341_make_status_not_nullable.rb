# frozen_string_literal: true

class MakeStatusNotNullable < ActiveRecord::Migration[6.1]
  def change
    change_column_null :articles, :status, false
  end
end
