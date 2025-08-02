# frozen_string_literal: true

json.articles @articles do | article |
  json.partial! "api/admin/articles/article", article: article
  json.author article.user, :name
end

json.count @count
