Clone or fork the whole project

To run locally, open first the whole project in ide. Then in terminal, go to client folder and run 
<b>npm install</b>

To run the client, type
<b>ng serve</b>

And press enter.<br><br>

If this fails, you haven’t installed the angular cli yet,<br>
To install it, run<br>
<b>npm install -g @angular/cli </b><br>
And run ng serve again.<br>

Then, open a new terminal window in your ide and go into server folder (cd ../server) and run npm install again <br><br>

In order for the backend to run properly locally you need to create a .env file in the root of your server project with environment vars for the following: <br><br>

googleClientID= <br>
googleClientSecret= <br>
twitterConsumerKey= <br>
twitterConsumerSecret= <br>
mongoURI= <br>
cookieKey= <br>
twitterCallbackUrl=http://localhost:4200/api/auth/twitter/callback <br>

[In prod you replace these env vars with environment vars on the server] <br><br>

To run the server, type <br>
<b>nodemon </b><br>
In your terminal and press enter, voila! Front and backend are running now <br><br>

The db runs directly on mongodb atlas, https://cloud.mongodb.com/
