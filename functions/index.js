const { https, firestore, pubsub } = require('firebase-functions'); // pubsub
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const transporter = nodemailer.createTransport({ 
  service: 'gmail',
    auth: {
    user: "inspirated.darioisea@gmail.com",
      pass: "inspira-ted."
  }
  // host: "smtp.hostinger.com",
  // port: 587,
  // secure: true, // use TLS
  // auth: {
  //   user: "info@darioisea.com",
  //   pass: "123456789"
  // }
});

exports.sendMail = https.onRequest((req, res) => {
  cors(req, res, () => {
    sendMailNode(templates('new', req.body), (err, data) => {
      if (err) res.send(err);
      else res.send(data);
    });
  });
});

exports.onChangeStatusIns = firestore
  .document('registered/{status}')
  .onUpdate(change => {
    const afterValue = change.after.data();
    const beforeValue = change.before.data();

    console.log("Processing data in onChangeStatusIns");

    if (beforeValue.status === 'waiting' && ['approved', 'rejected'].includes(afterValue.status)) {
      const confirmCode = randomString(12);

      change.after.ref.update({ code: confirmCode });

      const dest = afterValue.email;

      const dataEmail = {
        dest: dest || '',
        code: confirmCode,
        name: `${afterValue.firstName} ${afterValue.lastName}`,
        comment: afterValue.comment || 'Sin comentarios',
      };

      sendMailNode(templates(afterValue.status, dataEmail), (err) => {
        if (err) {
          console.log(`No se pudo enviar el email a ${dest}: `, err);
        } else {
          console.log(`Email enviado a ${dest} correctamente`);
        }
      });
      return `Sending email - status: ${afterValue.status}`;
    }

    return 'No se encontro ninguna accion';
  });

function sendMailNode(template, callback = () => { }) {
  const mailOptions = {
    from: template.from,
    to: template.to,
    subject: template.subject,
    html: template.html,
  };

  // returning result
  transporter.sendMail(mailOptions, (erro, info) => {
    if (erro) {
      return callback(erro.toString(), null);
    } else {
      return callback(null, 'Sended')
    }
  });
}

function templates(status, { to, from, subject, html, ...other }) {

  const header = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//ES" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns:v="urn:schemas-microsoft-com:vml"><head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;"/> <meta name="viewport" content="width=600,initial-scale=2.3,user-scalable=no"> <link href='https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700' rel="stylesheet"> <link href='https://fonts.googleapis.com/css?family=Quicksand:300,400,700' rel="stylesheet"> <style type="text/css"> body{width: 100%; background-color: #ffffff; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; mso-margin-top-alt: 0px; mso-margin-bottom-alt: 0px; mso-padding-alt: 0px 0px 0px 0px;}p, h1, h2, h3, h4{margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0;}span.preheader{display: none; font-size: 1px;}html{width: 100%;}table{font-size: 14px; border: 0;}/* ----------- responsivity ----------- */ @media only screen and (max-width: 640px){/*------ top header ------ */ .main-header{font-size: 20px !important;}.main-section-header{font-size: 28px !important;}.show{display: block !important;}.hide{display: none !important;}.align-center{text-align: center !important;}.no-bg{background: none !important;}/*----- main image -------*/ .main-image img{width: 440px !important; height: auto !important;}/*======divider======*/ .divider img{width: 440px !important;}/*-------- container --------*/ .container590{width: 440px !important;}.container580{width: 400px !important;}.main-button{width: 220px !important;}/*-------- secions ----------*/ .section-img img{width: 320px !important; height: auto !important;}.team-img img{width: 100% !important; height: auto !important;}}@media only screen and (max-width: 479px){/*------ top header ------ */ .main-header{font-size: 18px !important;}.main-section-header{font-size: 26px !important;}/*======divider======*/ .divider img{width: 280px !important;}/*-------- container --------*/ .container590{width: 280px !important;}.container590{width: 280px !important;}.container580{width: 260px !important;}/*-------- secions ----------*/ .section-img img{width: 280px !important; height: auto !important;}}</style> </head><body class="respond" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr><tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="center" height="70" style="height:70px;border-top: 1px solid #e0e0e0;"> <a href="" style="display: block; border-style: none !important; border: 0 !important;"><img width="100" border="0" style="display: block; width: 100px;" src="https://firebasestorage.googleapis.com/v0/b/inspirated-c43a7.appspot.com/o/mailImages%2Finspirated-logo.png?alt=media&token=3bb70f96-92b7-4229-a1d0-6edc2863074c" alt=""/></a> </td></tr></table> </td></tr></table> </td></tr></table> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
  `;

  const footer = `
    </table> </td></tr></table> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr><tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590" style="height:100px;border-top: 1px solid #e0e0e0;"> <tr> <td align="right"> <a href="https://www.instagram.com/dario.isea/" style="display: block; border-style: none !important; border: 0 !important;"><img width="30" border="0" style="display: block;" src="https://firebasestorage.googleapis.com/v0/b/convenciong12.appspot.com/o/mailImages%2Finstagram.png?alt=media&token=467d4e2d-cba6-4dac-ab11-95eefc2978e6" alt=""></a> </td><td>&nbsp;</td><td> <a href="https://www.darioisea.com" style="display: block; border-style: none !important; border: 0 !important;"><img width="28" border="0" style="display: block;" src="https://firebasestorage.googleapis.com/v0/b/convenciong12.appspot.com/o/mailImages%2Fwww.png?alt=media&token=969a1ce1-4086-4cdb-8225-451247d2df53" alt=""></a> </td></tr></table> </td></tr></table> </td></tr></table></body></html>
  `;

  if (status === 'approved') {
    return ({
      to: other.dest,
      from: 'INSPIRATED <info@darioisea.com',
      subject: `Tu inscripción a INSPIRATED ha sido APROBADA.`,
      html: `
        ${header}
          <tr>
            <td align="center" style="color: #343434; font-size: 24px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
              <div style="line-height: 35px">
                Tu inscripción ha sido
                <br>
                <span style="color: #23b0d1;">APROBADA</span>
              </div>
            </td>
          </tr>
          
          <tr> <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td></tr><tr> <td align="center"> <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee"> <tr> <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td></tr></table> </td></tr><tr> <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td></tr>

          <tr>
            <td align="center">
              <table>
                <tr>
                  <td align="Justify" style="color: #888888; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
                    <div style="line-height: 24px">
                      <b>${other.name}</b>, tus datos y tu pago han sido validado con éxito, por eso te damos una cordial bienvenida a la familia INSPIRATED.
                    </div>
                  </td>
                </tr>

                <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

                <tr>
                  <td align="Justify" style="color: #000; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
                    <div style="line-height: 24px">
                      Nos vemos el 23 de noviembre en el <b>HOTEL RENAISSANCE</b> de <b>CARACAS</b> para que puedas disfrutar de <b>INSPIRATED ¡Vide la experiencia!</b>
                    </div>
                  </td>
                </tr>

                <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

                <tr>
                  <td align="Justify" style="color: #000; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
                    <div style="line-height: 24px">
                      Podrá retirar su manilla el día del evento.
                    </div>
                  </td>
                </tr>
                
                <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

                <tr>
                  <td align="center" style="color: #424040; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
                    <div style="line-height: 24px">
                      Código para el retiro:
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center">
              <table border="0" align="center" width="160" cellpadding="0" cellspacing="0" bgcolor="#23b0d1" style="">
                <tr><td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td></tr>
                <tr>
                  <td align="center" style="color: #ffffff; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 26px;">
                    ${other.code}
                  </td>
                </tr>

                <tr><td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr><td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td></tr>
          <tr><td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td></tr>
          <tr>
            <td align="Justify" style="color: #888888; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
              <em>NOTA: Es importante que guardes éste código y lo presente al momento de retirr su entrada,
                de lo contrario no se hará la entrega de las mismas.</td>
          </tr>
        ${footer}
      `
    });
  } else if (status === 'rejected') {
    return ({
      to: other.dest,
      from: 'INSPIRATED <info@darioisea.com',
      subject: `Tu inscripción a INSPIRATED ha sido RECHAZADA.`,
      html: `
        ${header}

          <tr>
            <td align="center" style="color: #343434; font-size: 24px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
              <div style="line-height: 35px">
                Tu inscripción fue
                <br>
                <span style="color: #23b0d1;">RECHAZADA</span>
              </div>
            </td>
          </tr>
          
          <tr> <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td></tr><tr> <td align="center"> <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee"> <tr> <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td></tr></table> </td></tr><tr> <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td></tr>

          <tr>
            <td align="Justify" style="color: #505050; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
              <b>Motivo:</b> ${other.comment}
          </tr>

          <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

          <tr>
            <td align="Justify" style="color: #505050; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
              <b>${other.name}:</b> Para cualquier reclamo o información, puede comunicarse a traves de mensaje directo por nuestro instagram y podremos ayudarle.</td>
          </tr>

          <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

        ${footer}
      `
    });
  } else if (status === 'new') {
    return ({ to, from, subject, html, });
  }

  return {};
}

function randomString(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
