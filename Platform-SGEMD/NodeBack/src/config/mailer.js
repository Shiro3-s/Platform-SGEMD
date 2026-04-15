// Configuración del servicio de correo utilizando nodemailer y Gmail
const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("🔧 Inicializando configuración de correo...");
console.log("   EMAIL_USER:", process.env.EMAIL_USER);
console.log("   EMAIL_PASS configurada:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarCorreoLogin(destinatario, asunto, contenidoHTML) {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("📧 ENVIANDO CORREO DE LOGIN");
    console.log("=".repeat(60));
    console.log(`Para: ${destinatario}`);
    console.log(`Asunto: ${asunto}`);
    console.log("-".repeat(60));

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: contenidoHTML,
    });
    
    console.log("✅ CORREO DE LOGIN ENVIADO EXITOSAMENTE");
    console.log(`   ID: ${info.messageId}`);
    console.log("=".repeat(60) + "\n");
    
    return true;
  } catch (error) {
    console.error("\n❌ ERROR ENVIANDO CORREO DE LOGIN");
    console.error("=".repeat(60));
    console.error(`Error: ${error.message}`);
    console.error(`Destinatario: ${destinatario}`);
    console.error("=".repeat(60) + "\n");
    
    return false;
  }
}

async function enviarCorreoVerificacion(destinatario, nombre, codigo) {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("📧 ENVIANDO CORREO DE VERIFICACIÓN");
    console.log("=".repeat(60));
    console.log(`Para: ${destinatario}`);
    console.log(`Nombre: ${nombre}`);
    console.log(`Código: ${codigo}`);
    console.log(`Desde: ${process.env.EMAIL_USER}`);
    console.log("-".repeat(60));

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; }
            .header { background: linear-gradient(135deg, #0057a4 0%, #004080 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 32px; }
            .header p { margin: 5px 0 0 0; opacity: 0.9; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
            .welcome { color: #333; font-size: 18px; margin: 0 0 20px 0; }
            .code-box { 
              background: linear-gradient(135deg, #0057a4 0%, #004080 100%);
              padding: 40px;
              text-align: center;
              border-radius: 8px;
              margin: 30px 0;
            }
            .code-label { color: #ddd; font-size: 12px; margin: 0 0 15px 0; }
            .code-number { 
              color: white;
              font-size: 48px;
              font-weight: bold;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
              margin: 0;
            }
            .warning { 
              background: #fff3cd;
              border-left: 4px solid #ff9800;
              padding: 15px;
              border-radius: 4px;
              margin: 20px 0;
              color: #856404;
            }
            .footer { color: #999; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SGEMD</h1>
              <p>Sistema de Gestión de Emprendimientos Minuto de Dios</p>
            </div>
            <div class="content">
              <h2 class="welcome">¡Bienvenido, ${nombre}!</h2>
              <p style="color: #666; line-height: 1.6;">
                Gracias por registrarte en nuestra plataforma. Para activar tu cuenta, 
                por favor ingresa el siguiente código de verificación en la aplicación:
              </p>
              
              <div class="code-box">
                <p class="code-label">TU CÓDIGO DE VERIFICACIÓN</p>
                <p class="code-number">${codigo}</p>
              </div>
              
              <div class="warning">
                <strong>Importante:</strong><br>
                • Este código es válido por 24 horas<br>
                • No compartas este código con nadie<br>
                • Nadie del equipo te pedirá este código por otros medios
              </div>
              
              <p style="color: #666; margin-top: 20px; line-height: 1.6;">
                Si no solicitaste este registro, por favor ignora este correo.
              </p>
              
              <div class="footer">
                <p>Este es un correo automático. Por favor no respondas a este mensaje.<br>
                Para soporte, contacta con nuestro equipo de administración.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: `Código de Verificación SGEMD: ${codigo}`,
      html: htmlContent,
      text: `Tu código de verificación es: ${codigo}`
    };

    console.log("Enviando con opciones:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    
    console.log("CORREO ENVIADO EXITOSAMENTE");
    console.log(`   ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    console.log("=".repeat(60) + "\n");
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("\nERROR ENVIANDO CORREO DE VERIFICACIÓN");
    console.error("=".repeat(60));
    console.error(`Error: ${error.message}`);
    console.error(`Código: ${error.code}`);
    console.error(`Destinatario: ${destinatario}`);
    console.error(`Usuario Gmail: ${process.env.EMAIL_USER}`);
    console.error("Stack:", error.stack);
    console.error("=".repeat(60) + "\n");
    
    // Log adicional para debugging
    if (error.code === 'EAUTH') {
      console.error("PROBLEMA: Error de autenticación con Gmail");
      console.error("   Verifica:");
      console.error("   1. EMAIL_USER y EMAIL_PASS en .env");
      console.error("   2. Contraseña de aplicación (no la contraseña normal)");
      console.error("   3. Acceso de aplicaciones menos seguras habilitado");
    }
    
    return { success: false, error: error.message };
  }
}

module.exports = { enviarCorreoLogin, enviarCorreoVerificacion };

