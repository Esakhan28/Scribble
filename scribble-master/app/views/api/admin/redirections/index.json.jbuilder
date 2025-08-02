# frozen_string_literal: true

json.redirections @redirections do | redirection |
  json.extract! redirection, :id, :from, :to
end
