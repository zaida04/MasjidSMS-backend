define({ "api": [
  {
    "type": "post",
    "url": "/api/sms/smslist/:name/add",
    "title": "",
    "version": "1.0.0",
    "name": "Add_a_user_to_the_SMSList",
    "group": "SMSlist",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>The SMSlist name to add</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "id",
            "description": "<p>Used to search up the person</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "json",
            "optional": false,
            "field": "user",
            "description": "<p>The user that is created</p>"
          }
        ]
      }
    },
    "filename": "src/Routers/api/SMS/smslist.js",
    "groupTitle": "SMSlist"
  },
  {
    "type": "post",
    "url": "/api/sms/smslist/create",
    "title": "",
    "version": "1.0.0",
    "name": "Create_a_SMSList",
    "group": "SMSlist",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "tablename",
            "description": "<p>The name for the smslist to be created</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Used to authenticate the user sending has perms to do this</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "json",
            "optional": false,
            "field": "response",
            "description": "<p>A response</p>"
          }
        ]
      }
    },
    "filename": "src/Routers/api/SMS/smslist.js",
    "groupTitle": "SMSlist"
  },
  {
    "type": "post",
    "url": "/api/sms/smslist/:name/sendText",
    "title": "",
    "version": "1.0.0",
    "name": "Send_a_text_to_a_SMSList",
    "group": "SMSlist",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the SMSList to send the message to</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>The body of the text to send</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Used to authenticate the user sending has perms to do this</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "json",
            "optional": false,
            "field": "response",
            "description": "<p>The response from the server</p>"
          }
        ]
      }
    },
    "filename": "src/Routers/api/SMS/smslist.js",
    "groupTitle": "SMSlist"
  },
  {
    "type": "post",
    "url": "/api/sms/smslist/:name/delete",
    "title": "",
    "version": "1.0.0",
    "name": "delete_a_SMSList",
    "group": "SMSlist",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>The name for the smslist to be deleted</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Used to authenticate the user sending has perms to do this</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "json",
            "optional": false,
            "field": "response",
            "description": "<p>A response</p>"
          }
        ]
      }
    },
    "filename": "src/Routers/api/SMS/smslist.js",
    "groupTitle": "SMSlist"
  },
  {
    "type": "post",
    "url": "/api/users/createAdmin",
    "title": "",
    "version": "1.0.0",
    "name": "Create_Admin",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>The users email</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstname",
            "description": "<p>The users firstname</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastname",
            "description": "<p>The users lastname</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "pnumber",
            "description": "<p>The users phone number</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>The token of the executor of the request</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "json",
            "optional": false,
            "field": "user",
            "description": "<p>The user that is created</p>"
          }
        ]
      }
    },
    "filename": "src/Routers/api/UserSys/sys.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/users/createMod",
    "title": "",
    "version": "1.0.0",
    "name": "Create_Mod",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>The users email</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstname",
            "description": "<p>The users firstname</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastname",
            "description": "<p>The users lastname</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "pnumber",
            "description": "<p>The users phone number</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>The token of the executor of the request</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "json",
            "optional": false,
            "field": "user",
            "description": "<p>The user that is created</p>"
          }
        ]
      }
    },
    "filename": "src/Routers/api/UserSys/sys.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/users/signup",
    "title": "",
    "version": "1.0.0",
    "name": "Create_User",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>The users email</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstname",
            "description": "<p>The users firstname</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastname",
            "description": "<p>The users lastname</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "pnumber",
            "description": "<p>The users phone number</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "json",
            "optional": false,
            "field": "user",
            "description": "<p>The user that is created</p>"
          }
        ]
      }
    },
    "filename": "src/Routers/api/UserSys/sys.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/users/:id",
    "title": "",
    "version": "1.0.0",
    "name": "Retrieve_User",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "id",
            "description": "<p>The users ID to retrieve</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>The token of the executor of the request</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "User",
            "optional": false,
            "field": "user",
            "description": "<p>The user that is retrieved</p>"
          }
        ]
      }
    },
    "filename": "src/Routers/api/UserSys/sys.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/api/users/:id/update",
    "title": "",
    "version": "1.0.0",
    "name": "Update_User",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>The users email</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstname",
            "description": "<p>The users firstname</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "id",
            "description": "<p>The users ID</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastname",
            "description": "<p>The users lastname</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "pnumber",
            "description": "<p>The users phone number</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>The token of the executor of the request</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "json",
            "optional": false,
            "field": "user",
            "description": "<p>The user that is updated with the new Data</p>"
          }
        ]
      }
    },
    "filename": "src/Routers/api/UserSys/sys.js",
    "groupTitle": "User"
  }
] });