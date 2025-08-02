# frozen_string_literal: true

require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
  end

  def test_name_should_be_of_valid_length
    @category.name = "a" * (Category::MAX_NAME_LENGTH + 1)
    assert_not @category.valid?
  end

  def test_name_should_be_unique
    duplicate_category = @category.dup
    assert_not duplicate_category.valid?
  end

  def test_category_should_not_be_valid_and_saved_without_name
    @category.name = ""
    assert_not @category.valid?
  end

  def test_should_set_position_before_create_category
    test_category = create(:category, user: @user)
    assert_equal Category.maximum(:position), test_category.position
  end

  def test_categories_should_be_deleted_if_user_is_deleted
    previous_categories_count = @user.categories.count

    first_category = create(:category, user: @user)
    second_category = create(:category, user: @user)

    current_categories_count = @user.categories.count

    assert_equal previous_categories_count + 2, current_categories_count
    @user.destroy!
    assert_equal 0, @user.categories.count
  end

  def test_category_name_should_contain_at_least_one_alphabet
    @category.name = "/--1"
    assert_not @category.valid?
    assert_includes @category.errors_to_sentence, "Name must contain at least one letter."

    @category.name = "C"
    assert @category.valid?
  end
end
