Rails.application.routes.draw do

  resources :home

  get '/about' => 'home#about', as: :about

  get '/least_squares' => 'home#least_squares', as: :least_squares

  root to: 'home#show'

  post '/least_squares' => 'home#least_squares'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
