Here is the email and password which is used to generate all the api key and secret key

email_id=pteastacc@gmail.com - proteastacc@gmail.com
password=pass1234!

STEPS TO GENETATE ACCESS TOKEN AND REFRESS TOKEN FOR SENDING GMAIL

step-1 -> Create new google cloud project from cloud.google.com
step-2 -> Choose APIs & Services from the left menu and click on Enable APIs and Services to enable the Gmail API. The Gmail API lets you view and manage Gmail mailbox data like threads, messages, and labels
step-3 -> Under the APIs and Services section, click on OAuth Consent Screen and set the user type as Internal. This will allow the application to access the Gmail API without having to go through the extensive OAuth verification process that can take several weeks. Click on Save and Continue.

step-4 -> On the next screen, you need to provide one or more OAuth 2.0 Scopes for Google APIs. Click the Add Or Remove Scopes button and add https://www.googleapis.com/auth/gmail.send to the list of scopes since we only want to send emails from Gmail and not read any user data. Click Save and Continue.

step-5 -> In the APIs & Services section, click on Credentials and click on Create credentials > OAuth Client Id to create a new client ID that will be used to identify your application to Google’s OAuth servers.

step-6 -> Set the application type to web application, give your OAuth Client a recognizable name and then click Create to generate the credentials. The name of your OAuth 2.0 client is only used to identify the client in the Google Cloud console and will not be shown to application users.

step-7 -> add redirect uris

step-8 -> Download json file

step-9 -> place or replace that json file in this project with src-utils-credentials.json

step-10 -> now run the command "node src/utils/auth.js"

step-11 -> The browser generates an authorization code that you can paste into token.js to generate an access token and a refresh token. The access token will be valid for 1 hour and the application will use the refresh token to obtain a new access token when it expires

step-12 -> now run the command "node src/utils/token.js"

Now you can test the api that it is delevering gmail properly or not.

You can alse refer to this website - https://www.labnol.org/google-api-service-account-220405

---

For mobile otp sending we have used the trial twilio account .

We have limitations of trial account that it will send the sms to only verified number.

You can verify your number from the given link -> https://console.twilio.com/us1/develop/phone-numbers/manage/verified

or you can purchase the number and add that number in .env file in FROM_NUMBER_SEND_SMS variable, so you can send the sms to any number.
