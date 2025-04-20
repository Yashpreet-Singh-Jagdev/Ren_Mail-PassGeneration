import { createCanvas, registerFont } from "canvas";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import e from "express";
// import { json } from "stream/consumers";
const require = createRequire(import.meta.url);
const express = require("express");
const app = express();
const multer = require("multer")
const upload = multer({ dest: "upload/" })


app.use(express.urlencoded({ extended: true }));


app.post("/sendMail",upload.single("file"), (req, res) => {
  const data = req.file;
  console.log(data)
  res.send("Hit the endpoint");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});



const xlsx = require("xlsx");
const nodemailer = require("nodemailer");
const fileLocation = "./excelFile/data.xlsx";


// // // Create __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load and register the custom font
const fontPath = path.join(__dirname, "./fonts/Armageda.otf");
if (fs.existsSync(fontPath)) {
  registerFont(fontPath, { family: "Armageda Wide" });
}



async function generatePass(student) {
  const templatePath = path.join(__dirname, "../offline data registration/images/ren ticket-template 2-02.png");
  const outputPath = path.join(__dirname, `../offline data registration/passes/pass-${student.name}-${student.eventName}.png`);

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
  const outputPath = path.join(__dirname, `../offline data registration/passes/pass-${student.name}-${student.eventName}.png`);
  console.log(outputPath)
  const auth = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 587,
    auth: {
      user: "yashpreet3.14@gmail.com",
      pass: 'lrmd imfr pqwq lmxr'
    }
  });

  const reciever = {
    from: 'yashpreet3.14@gmail.com',
    to: `${student.emailId}`,
    subject: 'Sending Email using Node.js',
    text: `mail sent to ${student.name} with email id ${student.emailId}`,
    attachments: [
      {
        filename: `pass-${student.name}-${student.eventName}.png`, // Change this to the actual filename
        path: outputPath // Full path
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
  // sendMail(student);
  // console.log(`Mail sent to ${student.name}`);
});
