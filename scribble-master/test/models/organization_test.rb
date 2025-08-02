# frozen_string_literal: true

require "test_helper"

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @organization = build(:organization)
  end

  def test_name_should_be_of_valid_length
    @organization.name = "a" * (Organization::MAX_NAME_LENGTH + 1)
    assert_not @organization.valid?
    assert_includes @organization.errors_to_sentence, "Name is too long (maximum is 50 characters)"
  end

  def test_name_shouldnt_be_valid_with_blank
    @organization.name = ""
    assert @organization.invalid?
    assert_includes @organization.errors_to_sentence, "Name can't be blank"
  end

  def test_name_shouldnt_be_valid_with_nil
    @organization.name = nil
    assert @organization.invalid?
    assert_includes @organization.errors_to_sentence, "Name can't be blank"
  end

  def test_password_shouldnt_be_valid_with_less_than_6_characters
    @organization.password = "Hi1"
    assert @organization.invalid?
    assert_includes @organization.errors_to_sentence, "Password is too short (minimum is 6 characters)"
  end

  def test_password_should_be_valid_with_more_than_5_characters
    @organization.password = "hello1"
    assert @organization.valid?
  end

  def test_password_shouldnt_be_valid_wihout_number
    @organization.password = "welcome"
    assert @organization.invalid?
    assert_includes @organization.errors_to_sentence, "Password requires 1 letter and 1 number"
  end

  def test_password_shouldnt_be_valid_without_letter
    @organization.password = "123"
    assert @organization.invalid?
    assert_includes @organization.errors_to_sentence, "Password requires 1 letter and 1 number"
  end

  def test_organization_name_should_contain_at_least_one_alphabet
    @organization.name = "/--1"
    assert_not @organization.valid?
    assert_includes @organization.errors_to_sentence, "Name must contain at least one letter."

    @organization.name = "O"
    assert @organization.valid?
  end
end
