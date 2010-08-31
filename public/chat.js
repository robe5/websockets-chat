// User Connected
$(document).bind('message:user_connected', function(evt, data){
	Message.render(data, 'enter_message');
	Message.populateParticipants(data.users);
});

// User Message
$(document).bind('message:user_message', function(evt, data){
	Message.render(data, 'text_message');
});

// User Disconnected
$(document).bind('message:user_disconnected', function(evt, data){
	Message.render(data, 'exit_message');
	Message.populateParticipants(data.users);
});

// User tries to left the page
$(window).bind('beforeunload', function(){ 
	if (Chat && Chat.connected) return "Are you sure that you want to left the chat room?";
});


// Message renderer
var Message = {
	render: function(data, kind){
		var msg = $('<tr>', {'class': kind + ' message'});
		$('<td>', {'class': 'person'}).text(data.name).appendTo(msg);
		$('<td>', {'class': 'body'}).html("<div>"+data.message.replace(/\n/g,"<br />")+"</div>").appendTo(msg);
		msg.appendTo('#chat')
	},
	populateParticipants: function(users){
		$('.participant-list').empty();
		$(users).each(function(){
			$('<li>', {'class':'user'}).append(
				$('<span>', {'class':'name'}).text(""+this)	
			).appendTo('.participant-list')
		});
	}
}

/*
	Chat client
*/
var Chat = {
  server: "ws://localhost:8080/",
  connect: function(){
    this.ws = new WebSocket(this.server);
		// when a connection is stablished
    this.ws.onopen = function(){
			Chat.connected = true;
			msg = ["user_connected", {
				name: $('#login').val()
			}];
			// sends user info to the server
      this.send(JSON.stringify(msg));
			
			// Activates the chat UI
			$('#connect-form').slideUp()
			$('.onEnter').fadeIn();
			$('#input').focus();
    };
		// when a message is received from the server
    this.ws.onmessage = function(evt){
			var data = JSON.parse(evt.data);
			$(document).trigger('message:' + data[0], [data[1]]);
    };
		// When the connection is closed
		this.ws.onclose = function(evt){
			Chat.connected = false;
			var data = JSON.parse(evt.data);
			$(document).trigger('message:' + data[0], data[1]);
		}
  },
	// Send a message to the server
  send: function(msg){
    this.ws.send(msg);
  }
};

$(document).ready(function(){	

  // Connect button
  $('#connect-form').submit(function(evt){
    evt.preventDefault();
    Chat.connect();
  });
  
  // Input text behavior
	// 	Enter key submits the form
	//  Shift + enter key insert a new line
	var isShift = false;
	
	$('#input').keyup(function(evt){
		if(evt.keyCode == 16) isShift = false;
	}).keydown(function(evt){
		if(evt.keyCode == 16) isShift = true;
		if(evt.keyCode == 13 && isShift == false){
			if ($(this).val().trim() == ""){
				return false;
			}else{
				$('#chat_form').trigger('submit');
				return false;
			}					
		}
	});
	
	// Submitting the form creates the msg for the server
  $('#chat_form').submit(function(evt){
    evt.preventDefault();
		var msg = ["user_message", {
			name: "theName",
			message: $('#input').val()
		}];
    Chat.send(JSON.stringify(msg));
    $('#input').attr('value', '');
  });
});