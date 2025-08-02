# frozen_string_literal: true

json.article_versions @article_versions do | version |
  json.extract! version, :id, :object
  if version.object != nil && @_current_user.categories.where(id: version.object["category_id"]).present?
    json.category @_current_user.categories.find(version.object["category_id"])
  end
end
