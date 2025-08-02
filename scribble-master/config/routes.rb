# frozen_string_literal: true

Rails.application.routes.draw do
  defaults format: :json do
    namespace :api do
      namespace :admin do
        resources :articles, except: %i[new edit] do
          collection do
            get "count"
            get "published_list"
            put "move"
            resource :report, only: %i[create], module: :articles do
              get :download, on: :collection
            end
          end
          member do
            get "versions"
            put "position_update"
          end
        end
        resources :categories, except: %i[new edit] do
          put "position_update", on: :member
        end
        resource :user, only: :show
        resource :organization, only: %i[show update create]
        resources :redirections, except: %i[new edit show]
      end

      namespace :public do
        resources :articles, only: %i[index show], param: :slug
        resources :categories, only: :index
      end
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
