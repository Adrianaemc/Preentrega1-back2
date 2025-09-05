import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (to, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Soporte WorkPortal" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Restablecer contraseña',
    html: `
      <p>Solicitaste restablecer tu contraseña.</p>
      <p>Hacé clic en el siguiente enlace para continuar:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Si no fuiste vos, ignorá este mensaje.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};