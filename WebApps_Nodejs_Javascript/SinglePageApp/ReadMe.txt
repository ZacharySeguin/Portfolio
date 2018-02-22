Zachary Seguin

This assignment was developed in the Windows 10 Operating System.
All the code was tested in the google chrome browser.

Instructions:
1) To launch the server, use the compilation command (must be in the same directory as this ReadMe.txt): node stat.js 
2) To launch the app from the browser, use this url: http://127.0.0.1:3000/Assignment1.html
3) Type the name of the song into the textbar and click the "submit request" button, the lyrics and chords to the song will display onto the Canvas. (In the correct format)
4) The app allows you to drag the words around using the mouse leftclick to any position.
5) The sorting algorithm has not been implemeted correctly so clicking the "update" button will create a new file (originalfilename_updated.txt) instead of overwriting the old one. To
make the writeFile call overwrite the original file, simply remove the + "_updated" string from the first parameter of the function call. 