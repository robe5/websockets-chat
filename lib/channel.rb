require 'em-websocket'
class Channel
  @@channels = Hash.new
  
  def initialize
    @channel = EM::Channel.new
    @users = {}
    @chat = Chat.new(@users)

    @token = Digest::SHA1.hexdigest(Time.now.to_s)
    @@channels[@token] = self
  end
  
  def self.find(token)
    @@channels[token]
  end
  
  def token
    @token
  end

  def channel
    @channel
  end

  def request(sid, message)
    @chat.request(sid, message)
  end
  
  def exit(sid)
    @chat.exit(sid)
  end
  
  def subscribe
    @channel.subscribe{|m| yield m }
  end
  
  def push(message)
    @channel.push(message)
  end
  
  def unsubscribe(sid)
    @channel.unsubscribe(sid)
  end
end