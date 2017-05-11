Rails.application.routes.draw do

  resources :home

  get '/about' => 'home#about', as: :about

  root to: 'home#show'


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
