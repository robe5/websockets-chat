require 'rubygems'
require 'bundler/setup'

require 'em-websocket'
require 'sinatra/base'
require 'thin'

$:.unshift File.dirname(__FILE__) + '/lib'
require 'chat'
require 'channel'

EventMachine.run do 
  
  class Websockets < Sinatra::Base
    set :public, 'public'
    set :views, 'views'
    enable :reload

    get '/' do
      erb :index
    end

    get '/room/new' do
      @room_id = Channel.new.token
      redirect "/room/#{@room_id}"
    end

    get '/room/:token' do
      channel = Channel.find(params[:token])
      if channel.nil?
        redirect "/"
      else
        @room_id = channel.token
        erb :show
      end
    end
    
  end

  EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 8080, :debug => true) do |ws|
      ws.onopen {
        channel = Channel.find(ws.request['Path'][1..-1])
        sid = channel.subscribe{|msg| ws.send msg}
        
        ws.onmessage {|msg|
          channel = Channel.find(ws.request['Path'][1..-1])
          response = channel.request(sid, msg)
          channel.channel.push response
        }
        
        ws.onclose{|msg|
          channel = Channel.find(ws.request['Path'][1..-1])
          channel.unsubscribe(sid)
          response = channel.exit(sid)
          channel.push response
        }
      }
  end

  Websockets.run!()
end
