# frozen_string_literal: true

json.articles @articles do | article |
  json.partial! "api/admin/articles/article", article: article
  json.visits article.visits.sum(:visit)
  json.dates_and_visits article.visits.group("DATE(created_at)").sum(:visit)
end

json.count @count
