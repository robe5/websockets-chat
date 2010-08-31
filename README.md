This is a simple real time application powered by Sinatra + EventMachine + Websockets. Websockets is an HTML5 feature so
this will only work in a modern browser like Google Chrome.

# Installing the application

    git clone git@github.com:robe5/Websockets-Chat.git
    gem install bundler
    bundle install

# Running the server

    rackup config.ru

This app has been tested with Ruby 1.9.2.

# Protocol

**User connected**
  
*Client:*

    ['user_connected',
      { name: "Jose" }
    ]
  
*Server:*

    ['user_connected',
      { name, "Jose",
        users: ['Jose', 'Juan']
      }
    ]

**User message**
  
*Client:*

    ['user_message',
      { message: 'the text' }
    ]
  
*Server:*

    ['user_message',
      { name: 'Jose',
        message: 'the text'
      }
    ]

**User disconnected**
  
*Server*

    ['user_disconnected',
      { name:null
        message: 'disconnected',
        'users': ['Jose']
       }
    ]