Make a voting system (vote reception).<br>
On the backend:<br>
- the / variants service returns possible answer variants (response code, response text);<br>
- the / stat service returns statistics of responses (response code, number of votes received);<br>
- the / vote service accepts a response (response code).<br>
On the frontend:<br>
- get response statistics and response options from the backend;<br>
- display current statistics in any form;<br>
- display answer options as buttons;<br>
when you click on the button, send a response, request and display updated statistics.<br>
The server side must be running on your sample server.<br>
The frontend must be configured to work with your sample server (not a locally running server).<br>
