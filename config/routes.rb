Rails.application.routes.draw do

  resources :home

  get '/about' => 'home#about', as: :about

  get '/least_squares' => 'home#least_squares', as: :least_squares

  get '/div_curl' => 'home#div_curl', as: :div_curl

  get '/integral' => 'home#integral', as: :integral

  get '/coordinates' => 'home#coordinates', as: :coordinates

  root to: 'home#show'

  post '/least_squares' => 'home#least_squares'
  
  post '/div_curl' => 'home#div_curl'

  post '/integral' => 'home#integral'

  post '/coordinates' => 'home#coordinates'

  

  
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
