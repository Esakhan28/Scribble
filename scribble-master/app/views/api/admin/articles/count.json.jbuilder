# frozen_string_literal: true

json.all @articles_count[:all]
json.published @articles_count[:published]
json.draft @articles_count[:draft]
