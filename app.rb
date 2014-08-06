require 'sinatra'

set :views, './views'
set :public_dir, './public'

get '/' do
  erb :crimewave
end