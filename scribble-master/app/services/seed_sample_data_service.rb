# frozen_string_literal: true

require "faker"
require "database_cleaner/active_record"

DatabaseCleaner.strategy = :truncation

class SeedSampleDataService
  def process
    clean_database
    create_sample_data
  end

  private

    def create_sample_data
      create_sample_organization_data
      create_sample_user_data
      create_sample_categories_data
      create_sample_drafted_articles_data
      create_sample_published_articles_data
      create_version_history_of_articles
    end

    def clean_database
      DatabaseCleaner.clean
    end

    def create_version_history_of_articles
      delete_category_and_move_articles_to_another_category
      move_articles_to_selected_category
      schedule_articles_status_later
    end

    def create_sample_organization_data
      Organization.create!(
        name: "Spinkart",
        password: nil,
        is_password_protected: false
      )
    end

    def create_sample_user_data
      current_organization.users.create!(
        name: "Oliver Smith",
        email: "oliver@example.com",
      )
    end

    def create_sample_categories_data
      6.times do
        current_user.categories.create!(
          name: Faker::Name.name,
        )
      end
    end

    def create_sample_drafted_articles_data
      categories = current_user.categories
      categories.each do |category|
        2.times do
          current_user.articles.create!(
            title: Faker::Lorem.sentence[0..25],
            body: Faker::Lorem.paragraph(sentence_count: 50),
            category_id: category.id,
            )
        end
      end
    end

    def create_sample_published_articles_data
      categories = current_user.categories
      categories.each do |category|
        3.times do
          current_user.articles.create!(
            title: Faker::Lorem.sentence[0..25],
            body: Faker::Lorem.paragraph(sentence_count: 50),
            status: "Published",
            category_id: category.id,
            )
        end
      end
    end

    def delete_category_and_move_articles_to_another_category
      first_category = current_user.categories.first
      second_category = current_user.categories.second

      CategoryDeletionService.new(first_category.id, second_category.id, current_user).process
    end

    def move_articles_to_selected_category
      first_category = current_user.categories.first
      second_category = current_user.categories.second
      article_ids = first_category.articles.where(status: "Draft").map { |article| article.id }

      MoveArticlesService.new(current_user, article_ids, second_category.id).process
    end

    def schedule_articles_status_later
      category = current_user.categories.last
      3.times do
        current_user.articles.create!(
          title: Faker::Lorem.sentence[0..25],
          body: Faker::Lorem.paragraph(sentence_count: 50),
          status: "Published",
          category_id: category.id,
          scheduled_unpublish: Time.zone.now + 1.hour,
          )
        current_user.articles.create!(
          title: Faker::Lorem.sentence[0..25],
          body: Faker::Lorem.paragraph(sentence_count: 50),
          category_id: category.id,
          scheduled_publish: Time.zone.now + 1.hour,
          scheduled_unpublish: Time.zone.now + 3.hours,
          )
      end
    end

    def current_organization
      @_current_organization ||= Organization.first
    end

    def current_user
      @_current_user ||= current_organization.users.first
    end
end
