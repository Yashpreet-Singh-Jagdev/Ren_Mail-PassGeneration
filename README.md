# Ren_Mail-PassGeneration

This is a standalone script used to send confirmation emails to registered users. The email acts as a confirmation message and also contains various attachments such 
as event pass, JECRC campus Map for navigation, and the event itinerary for the three days. 

### Prerequisites to run this project:

- Node.js

### Steps to run the project:
  
1. Clone the codebase using the following command: git clone https://github.com/Yashpreet-Singh-Jagdev/Ren_Mail-PassGeneration.git.

2. Open the folder in your terminal and install the required packages using: `npm install`.

3. Create a `.env` file in the root directory of the codebase and add the following keys: : 

```
EMAIL_ID=
APP_PASSWORD=
```

- In `EMAIL_ID`, enter the email address from which you want to send emails.

- To get the `APP_PASSWORD`, go to [GMAIL](https://mail.google.com/mail/u/0/#inbox), click on your profile picture, then select **Manage Your Google Account**.
   Navigate to the **Security** section on the left-hand side, then scroll down to the **App passwords** section under the Password section then generate your App password
   and place it in the `APP_PASSWORD` variable of the .env file.

4. Replace the data in the `excelFile/data` file with the correct data as this data will be used to send the mail.

5. Start the server by running: `node app.js`.

   **Note**: Do not change the field names in the Excel file.  
  
That’s it — the project should now be running! 😃
