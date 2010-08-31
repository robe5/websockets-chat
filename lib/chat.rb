require 'json'

class Chat
  def initialize(users)
    # user names
    @users = users
  end
  
  def request(sid, object)      
    object = JSON.parse(object)
    type = object[0]
    data = object[1]
    case type
    when 'user_connected' then
      @users[sid] = data['name']
      data["message"] = "connected"
      data["users"] = @users.values
      return [type, data].to_json
    when 'user_message' then
      data['name'] = @users[sid]
      return [type, data].to_json
    else
      puts "message not expected"
    end
  end
  
  def exit(sid)
    @users.delete(sid)
    data = {
      'name' => @users[sid],
      'message' => "disconnected",
      'users' => @users.values
    }
    return ["user_disconnected", data].to_json
  end
end
