# frozen_string_literal: true

require "test_helper"

class ArticleTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_article_should_not_be_valid_without_category
    @article.category = nil
    assert_not @article.save
    assert_includes @article.errors_to_sentence, "Category must exist"
  end

  def test_article_should_not_be_valid_without_user
    @article.user = nil
    assert_not @article.save
    assert_includes @article.errors_to_sentence, "User must exist"
  end

  def test_article_title_should_not_exceed_maximum_length
    @article.title = "a" * (Article::MAX_TITLE_LENGTH + 1)
    assert_not @article.valid?
  end

  def test_article_should_not_be_valid_without_title
    @article.title = ""
    assert_not @article.valid?
  end

  def test_published_article_slug_is_parameterized_title
    title = @article.title
    @article.status = "Published"
    @article.save!
    assert_equal title.parameterize, @article.slug
  end

  def test_incremental_slug_generation_for_published_articles_with_duplicate_two_worded_titles
    first_article = Article.create!(
      title: "test article", category: @category,
      status: "Published", user: @user, body: @article.body
    )
    second_article = Article.create!(
      title: "test article", category: @category,
      status: "Published", user: @user, body: @article.body
    )

    assert_equal "test-article", first_article.slug
    assert_equal "test-article-2", second_article.slug
  end

  def test_incremental_slug_generation_for_published_articles_with_duplicate_hyphenated_titles
    first_article = Article.create!(
      title: "test-article", category: @category,
      status: "Published", user: @user, body: @article.body
    )
    second_article = Article.create!(
      title: "test-article", category: @category,
      status: "Published", user: @user, body: @article.body
    )

    assert_equal "test-article", first_article.slug
    assert_equal "test-article-2", second_article.slug
  end

  def test_slug_generation_for_published_articles_having_titles_one_being_prefix_of_the_other
    first_article = Article.create!(
      title: "hyperactive", category: @category,
      status: "Published", user: @user, body: @article.body
    )
    second_article = Article.create!(
      title: "hypertension", category: @category,
      status: "Published", user: @user, body: @article.body
    )

    assert_equal "hyperactive", first_article.slug
    assert_equal "hypertension", second_article.slug
  end

  def test_error_raised_for_duplicate_slug
    another_test_article = Article.create!(
      title: "another test article", category: @category,
      status: "Published", user: @user, body: @article.body
    )

    assert_raises ActiveRecord::RecordInvalid do
      another_test_article.update!(slug: @article.slug)
    end

    error_msg = another_test_article.errors_to_sentence
    assert_match "Slug is immutable!", error_msg
  end

  def test_updating_title_does_not_update_slug
    @article.status = "Published"
    @article.title = "updated title"
    assert_not_equal "updated-title", @article.slug
  end

  def test_slug_suffix_is_maximum_slug_count_plus_one_if_two_or_more_slugs_already_exist
    title = "test-article"
    first_article = Article.create!(
      title: title, category: @category,
      status: "Published", user: @user, body: @article.body
    )
    second_article = Article.create!(
      title: title, category: @category,
      status: "Published", user: @user, body: @article.body
    )
    third_article = Article.create!(
      title: title, category: @category,
      status: "Published", user: @user, body: @article.body
    )
    fourth_article = Article.create!(
      title: title, category: @category,
      status: "Published", user: @user, body: @article.body
    )

    assert_equal fourth_article.slug, "#{title.parameterize}-4"

    third_article.destroy

    expected_slug_suffix_for_new_article = fourth_article.slug.split("-").last.to_i + 1

    new_article = Article.create!(
      title: title, category: @category,
      status: "Published", user: @user, body: @article.body
    )
    assert_equal new_article.slug, "#{title.parameterize}-#{expected_slug_suffix_for_new_article}"
  end

  def test_creates_multiple_articles_with_unique_slug
    articles = create_list(:article, 10, category: @category, status: "Published", user: @user, body: @article.body)
    slugs = articles.pluck(:slug)
    assert_equal slugs.uniq, slugs
  end

  def test_should_delete_articles_if_category_is_deleted
    category_id = @article.category_id
    previous_articles_count = Article.all.where(category_id: category_id).count

    @article.category.destroy
    current_articles_count = Article.all.where(category_id: category_id).count
    assert_not_equal previous_articles_count, current_articles_count
  end

  def test_slug_should_nil_if_article_is_drafted_first_time
    @article.save!
    assert_nil @article.slug
  end

  def test_should_generate_slug_after_article_set_to_publish_first_time
    article_title = @article.title
    assert_nil @article.slug

    @article.status = "Published"
    @article.save!
    assert_equal article_title.parameterize, @article.slug
  end

  def test_should_not_change_slug_after_set_to_draft_from_published
    @article.status = "Published"
    @article.save!

    article_slug = @article.slug
    @article.status = "Draft"
    @article.save!

    assert_equal article_slug, @article.slug
  end

  def test_articles_should_be_deleted_if_category_is_deleted
    previous_articles_count = @category.articles.count

    first_article = create(:article, category: @category, user: @user)
    second_article = create(:article, category: @category, user: @user)

    current_articles_count = @category.articles.count

    assert_equal previous_articles_count + 2, current_articles_count
    @category.destroy!
    assert_equal 0, @category.articles.count
  end

  def test_article_should_contain_at_least_one_alpha_numeric_character
    @article.title = "/--*&"
    assert_not @article.valid?
    assert_includes @article.errors_to_sentence, "Title must contain at least one letter or number."

    @article.title = "A"
    assert @article.valid?
  end

  def test_article_should_not_be_valid_with_scheduled_status_before_current_time
    @article.scheduled_publish = Time.zone.now - 1.day
    assert @article.invalid?
    assert_includes @article.errors_to_sentence, t("article.scheduled.invalid_time")

    @article.scheduled_publish = nil
    assert @article.valid?

    @article.scheduled_unpublish = Time.zone.now - 1.day
    assert @article.invalid?
    assert_includes @article.errors_to_sentence, t("article.scheduled.invalid_time")
  end

  def test_article_should_not_be_valid_with_scheduled_publish_before_unpublish_time
    @article.status = "Published"
    @article.scheduled_unpublish = Time.zone.now + 2.day
    assert @article.valid?

    @article.scheduled_publish = Time.zone.now + 1.day
    assert @article.invalid?
    assert_includes @article.errors_to_sentence, t("article.scheduled.publish")
  end

  def test_article_should_not_valid_with_scheduled_unpublish_before_publish_time
    @article.scheduled_publish = Time.zone.now + 2.day
    @article.scheduled_unpublish = Time.zone.now + 1.day
    assert @article.invalid?
    assert_includes @article.errors_to_sentence, t("article.scheduled.unpublish")
  end

  def test_article_should_be_valid_with_scheduled_status_after_current_time
    @article.scheduled_publish = Time.zone.now + 1.day
    assert @article.valid?

    @article.scheduled_publish = nil
    assert @article.valid?

    @article.status = "Published"
    @article.scheduled_unpublish = Time.zone.now + 1.day
    assert @article.valid?
  end

  def test_article_should_be_valid_with_scheduled_unpublish_after_publish_time
    @article.scheduled_publish = Time.zone.now + 1.day
    @article.scheduled_unpublish = Time.zone.now + 2.day
    assert @article.valid?
  end

  def test_article_should_be_valid_with_scheduled_publish_after_unpublish_time
    @article.status = "Published"
    @article.scheduled_unpublish = Time.zone.now + 1.day
    @article.scheduled_publish = Time.zone.now + 2.day
    assert @article.valid?
  end

  def test_article_should_be_valid_with_scheduled_publish_if_article_is_draft
    @article.status = "Published"
    @article.scheduled_publish = Time.zone.now + 1.day
    assert @article.invalid?
    assert_includes @article.errors_to_sentence, t("article.scheduled.invalid_publish")

    @article.status = "Draft"
    @article.scheduled_publish = Time.zone.now + 1.day
    assert @article.valid?
  end

  def test_article_should_be_valid_with_scheduled_unpublish_if_article_is_published
    @article.scheduled_unpublish = Time.zone.now + 1.day
    assert @article.invalid?
    assert_includes @article.errors_to_sentence, t("article.scheduled.invalid_unpublish")

    @article.status = "Published"
    @article.scheduled_unpublish = Time.zone.now + 1.day
    assert @article.valid?
  end
end
