# frozen_string_literal: true

FactoryBot.define do
  factory :organization do
    name { Faker::Name.name[0..49] }
    password { "welcome123" }
    is_password_protected { true }
  end
end
