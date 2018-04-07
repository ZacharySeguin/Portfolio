COMP2601 Assignment 4
Name: Zachary Seguin
Student ID: 101000589
Submitted: April 7th 2018

Requirements:
  - Nodejs installed on your computer.
  - Cocoapods installed, if this is not installed refer to this
  link: https://guides.cocoapods.org/using/getting-started.html.

References:
  - Made use of https://github.com/tidwall/SwiftWebSocket as a module.
  - Made use of http://leaks.wanari.com/2017/03/22/websocket-ios/ by
  Tamas Keller as a guide on how to setup client socket and handle incoming
  messages.

Enhancements:
  - Added clear button on top lefthand corner of the screen to allow the user
  to clear the textview of any information.
  - Added additional restrictions to prevent user from using certain elements
  of the UI when not necessary (User cannot send a message if a connection to
  the server has not been established of user cannot connect to server if a
  connection is already made).
  - Distinguish between messages sent and received in textview (previously showed
  all messages sent as received because server would broadcast to all clients, I
  made the client ignore the message they sent when the server sends it back).

Setup:
  Client:
    - Navigate to comp2601Client directory in a terminal window.
    - Type "pod install" and hit enter
    - Necessary modules will be installed (SwiftWebSocket)
  Server:
    - Navigate to server directory in a terminal window.
    - Type "npm install" and hit enter
    - Necessary modules will be installed (websocket and ecstatic)

Testing:
  - To test this program, start the server by navigating to the server directory.
  - Type into the terminal the following command "node app.js"
  - A message should appear in the terminal stating where the server is hosted.
  - Open a browser window and put "http://localhost:3000/index.html" into the URL bar.
  - A chat interface should be displayed, and the terminal window should
  say "Client connected"
  - Now navigate to the comp2601Client directory and open the "comp2601Client.xcworkspace"
  file.
  - Once the file is opened, build and clean the project.
  - Run the project on an IPhone 8 plus (not totally necessary but ideal)
  - Once the emulator has loaded, click on the "Connect" button to connect
  to the server.
  - If a connection is successfully made, "Connected to server" will appear inside of
  the textview, and the server terminal (which should still be running) should say
  "Client connected".
  - To send a message enter a string into the text input above the buttons
  and click "Send".
  - Sent messages as well as messages received will be displayed in the textview.
  - The webpage client should also see the messages sent by the IOS emulator.

*If there are any problems running this code let me know at zackseguin@cmail.carleton.ca*
