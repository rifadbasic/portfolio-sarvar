const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Contact Route
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.RIFADBASIC_EMAIL, // your Gmail
        pass: process.env.RIFADBASIC_EMAIL_PASS, // your App Password
      },
    });


    console.log(process.env.RIFADBASIC_EMAIL, process.env.RIFADBASIC_EMAIL_PASS);

    const mailOptions = {
      from: email,
      to: process.env.RIFADBASIC_EMAIL, // you receive it here
      subject: `📩 Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family:sans-serif;line-height:1.6">
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Root test route
app.get("/", (req, res) => {
  res.send("Portfolio server is running...");
});

app.listen(port, () => console.log(`✅ Server running on port ${port}`));
