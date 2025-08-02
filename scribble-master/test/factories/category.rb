# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    association :user, factory: :user
    name { Faker::Name.name }
  end
end
