import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendResetEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: `"Coder Ecommerce" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Recuperación de contraseña",
    html: `
      <p>Hiciste una solicitud de restablecimiento de contraseña.</p>
      <p><a href="${resetLink}">Haz clic aquí para restablecer tu contraseña</a></p>
      <p>Este enlace expirará en 1 hora.</p>
    `
  });
};