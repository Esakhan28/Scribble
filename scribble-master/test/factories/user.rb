# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    association :organization, factory: :organization
    name { Faker::Name.name[0..29] }
    email { Faker::Internet.email }
    id { 1 }
  end
end
