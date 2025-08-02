# frozen_string_literal: true

json.array! @categories do | category |
  json.extract! category, :id, :name
  json.count category.articles.count
end
