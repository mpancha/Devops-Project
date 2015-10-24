require 'rails_helper'
require 'faker'
require 'forgery'

RSpec.describe JobController, :type => :controller do
   $i  = 0
   $max =10
   while  $i < $max do
      before(:each) do
        pass = Forgery(:basic).password + Forgery(:basic).password
        ph = Faker::Number.number(10)
        user = User.create!(:name => Forgery::Name.full_name , :email => Forgery(:internet).email_address, :phone => ph.to_s(), :password => pass, :password_confirmation => pass)
        sign_in user
        allow(controller).to receive(:current_user).and_return(user)
      end
      describe "Job Controller" do
         it "is reachable" do
            get :index
            expect(response.status).to eq(200)
         end
         it "Can List my_jobs" do
            get :my_jobs
            expect(response.status).to eq(200)
         end
      end
      $i += 1
    end
end
