# frozen_string_literal: true

json.extract! article,
  :id,
  :title,
  :body,
  :status,
  :category_id,
  :slug,
  :updated_at,
  :version_status,
  :restored_at,
  :scheduled_publish,
  :scheduled_unpublish

json.category article.category, :id, :name, :position
