require("dotenv").config()
const { createCanvas, registerFont } = require("canvas");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const nodemailer = require("nodemailer");
const fileLocation = "./excelFile/data.xlsx";



// Load and register the custom font
const fontPath = path.join(__dirname, "./fonts/Armageda");
if (fs.existsSync(fontPath)) {
  registerFont(fontPath, { family: "Armageda.ttf" });
}


async function generatePass(student) {
  const templatePath = path.join(__dirname, "../Ren_Mail-PassGeneration/images/ren ticket-template 2-02.png");
  const outputPath = path.join(__dirname, `../Ren_Mail-PassGeneration/upload/pass-${student.name}-${student.eventName}.png`);

  // Create a canvas for text overlay
  const canvas = createCanvas(1411, 530);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.font = 'bold 30px "Armageda Wide"';
  ctx.fillText(`Name: ${student.name}`, 600, 220);
  ctx.fillText(`Event: ${student.eventName}`, 600, 270);

  ctx.fillText(`Date: ${student.date}`, 600, 320);
  ctx.fillText(`Time: ${student.time}`, 1050, 320);  // Positioned to the right of Date
  ctx.fillText(`Venue: ${student.venue}`, 600, 370);

  const textBuffer = canvas.toBuffer();

  // Combine the template and text
  await sharp(templatePath)
    .composite([{ input: textBuffer, top: 0, left: 0 }])
    .toFile(outputPath);

  return outputPath;  // Return the path of the generated pass
}

const workbook = xlsx.readFile(fileLocation);
const sheetName = workbook.SheetNames[0]; // Get the first sheet
const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);


// // //

const sendMail = async (student) => {
  const outputPath = path.join(__dirname, `../Ren_Mail-PassGeneration/upload/pass-${student.name}-${student.eventName}.png`);
  const auth = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 587,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.APP_PASSWORD
    }
  });

  const reciever = {
    from: process.env.EMAIL_ID,
    to: `${student.emailId}`,
    subject: 'Event Registration Successful - Renaissance 2025',

    html: `
    <h1 style="color: #4E99CA">Your Registration for Renaissance 2025 is Confirmed!</h1>
        
    <p style="font-size:16px">Hi ${student.name},
     
     <br><br>
     
     We're excited to confirm your registration for <b>Renaissance</b> 2025! Get ready to be part of an extraordinary celebration of innovation, creativity and technology. This year's theme, Human X AI, will spark new ideas, foster meaningful connections, and create unforgettable memoried, over three action-packed days.
     
     <br><br>
     
     To help you navigate this incredible experience, we've attached:
     - The detailed event itinerary so you don't miss any of the exciting sessions and activities.
     - The JECRC campus map to guide you through the venue with ease.
    
     <br><br>
     
     Stay updated with the latest announcements and insights by following our official channels:
     
     <br><br>

     <b>Renaissance:</b> https://www.instagram.com/jecrcrenaissance?igsh=MW9sc2xiYm9jM3h1MQ==
     <b>JECRC Foundation:</b> https://www.instagram.com/jecrcfoundationofficial?igsh=MWUweTlwd25oN3M3eA==
     <b>JECRC Student Council:</b> https://www.instagram.com/jecrc.studentcouncil?igsh=MW9uNGVrdDN5Zm5pbw==

     <br><br>

     For Any Queries, Contact: Dhruv Sharma: +918959332180
     We can't wait to welcome you to <b>Renaissance</b> 2025-- see you soon!

     <br><br>

     Warm regards,
     Team <b>Renaissance</b> 2025
     </p>
     `,

    attachments: [
      {
        filename: `pass-${student.name}-${student.eventName}.png`, // Change this to the actual filename
        path: outputPath // Full path
      },
      {
        filename: "JECRC Campus Map.jpg", // Change this to the actual filename
        path: "./images/JECRC Campus Map.jpg" // Full path
      },
      {
        filename: "Event Itinerary.jpg", // Change this to the actual filename
        path: "./images/Event Itinerary.jpg" // Full path
      }
    ]
  };


  auth.sendMail(reciever, function (error, emailResponse) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent successfully');
    }
  });
};

jsonData.forEach((student) => {
  generatePass(student);
  console.log(`Pass generated for ${student.name}`);
  sendMail(student);
  console.log(`Mail sent to ${student.name}`);
});
