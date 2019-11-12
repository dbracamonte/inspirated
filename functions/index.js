const { https, firestore, pubsub } = require('firebase-functions'); // pubsub
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey("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");

admin.initializeApp();

/*
  * Here we're using Gmail to send 
*/

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bracamontedar@gmail.com',
    pass: 'debo0786'
  }
});

exports.sendMail = https.onRequest((req, res) => {
  cors(req, res, () => {
    sendMailNode(templates('new', req.body), (err, data) => {
      if (err) res.send(err);
      else res.send(data);
    });
  });
});

// exports.CashPayInTimeVericator = pubsub.schedule('every day 08:00')
//   .timeZone('America/Caracas')
//   .onRun((context) => {
//     console.log('Function to verify 08:00!');

//     const db = admin.firestore();

//     const currentDate = new Date();
//     let comparativeDate = new Date();
//     comparativeDate.setDate(comparativeDate.getDate() - 3);

//     const formatCompativeDate = `${comparativeDate.getFullYear()}-${('0' + (comparativeDate.getMonth() + 1)).slice(-2)}-${comparativeDate.getDate()}`;
//     const formatCurrentDate = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${currentDate.getDate()}`;

//     console.log("Executing in Date: ", formatCurrentDate, " --- To Compative with date: ", formatCompativeDate);

//     return db.collection('registered')
//       .where("paymentMethod.date", "==", formatCompativeDate)
//       .where("paymentMethod.type", "==", "cash")
//       .where("status", "==", "waiting")
//       .get()
//       .then(data => {
//         const records = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         console.log("Num records found in Cron To mark like rejected: ", records.length);

//         let goods = 0;
//         let wrongs = 0;

//         records.forEach(async (record) => {
//           const updateOperation = await db.collection("registered")
//             .doc(record.id)
//             .update({ status: 'rejected', comment: 'Debido a que no se pagó el efectivo ($) en los siguientes 2 días de haberla realizado.' })
//             .then(() => { goods++; return true; })
//             .catch(() => { wrongs++; return false; });
//         });

//         return `The trigger was execute successfully (Goods ${goods}) (Wrongs ${wrongs})`;
//       }).catch(err => {
//         return `El Cron no se pudo ejecutar, ocurrio un error, ${err}`;
//       })
//   });

// exports.sendMailGrid = https.onRequest((req, res) => {
//   cors(req, res, () => {

//     const { dest, tickets, code, type, amount } = req.body;

//     const msg = {
//       to: dest,
//       from: 'convenciong12.vzla@gmail.com',
//       subject: `¡Inscripción por ${tickets} entradas, fue Aprobada!`,
//       text: 'From MailGrid',
//       html: `
//         <h1>Aprobada!</h1>
//         <p style="font-size:22px;font-weight:400;">Tu inscripción por ${type === 'transfer' ? 'BsS.' : '$'} ${amount} fue aprovada</p>
//         <p style="font-size:22px;font-weight:bold;">Ya puedes pasar por nuestro stand de inscripción en la MCI de turmero a retirar ${tickets} entradas.</p>
//         <h3>Código: <b>${code}</b></h3>
//         <p style="font-size:18px;font-weight:400;">Es importante que guardes este código, y lo muestre solo a la persona de inscripción para que te entregue tus manillas, ya que es único, y una vez reclamada las manillas ya no lo podrás usar.</p>
//     `,
//     };

//     return sgMail.send(msg, false, (err, data) => {
//       return ({ err: err || 'Sin error', data: data || 'Sin data' });
//     });
//   });
// });

// exports.scheduledFunction = pubsub.schedule('every 5 minutes').onRun((context) => {
//   console.log('This will be run every 5 minutes!', context);
// });

exports.onChangeStatusIns = firestore
  .document('registered/{status}')
  .onUpdate(change => {
    const afterValue = change.after.data();
    const beforeValue = change.before.data();

    console.log("afterValue", afterValue);
    console.log("beforeValue", beforeValue);
    console.log("Processing data in onChangeStatusIns");

    if (beforeValue.status === 'waiting' && ['approved', 'rejected'].includes(afterValue.status)) {
      const confirmCode = randomString(12);

      // change.after.ref.set({ code: confirmCode }, { merge: true });
      change.after.ref.update({ code: confirmCode });

      const dest = afterValue.email;

      const dataEmail = {
        dest: dest || '',
        code: confirmCode,
        name: `${afterValue.firstName} ${afterValue.lastName}`,
        // type: afterValue.paymentMethod.type,
        // amount: afterValue.paymentMethod.amount,
        // comment: afterValue.comment || 'Sin comentarios',
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
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//ES" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns:v="urn:schemas-microsoft-com:vml"><head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;"/> <meta name="viewport" content="width=600,initial-scale=2.3,user-scalable=no"> <link href='https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700' rel="stylesheet"> <link href='https://fonts.googleapis.com/css?family=Quicksand:300,400,700' rel="stylesheet"> <style type="text/css"> body{width: 100%; background-color: #ffffff; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; mso-margin-top-alt: 0px; mso-margin-bottom-alt: 0px; mso-padding-alt: 0px 0px 0px 0px;}p, h1, h2, h3, h4{margin-top: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0;}span.preheader{display: none; font-size: 1px;}html{width: 100%;}table{font-size: 14px; border: 0;}/* ----------- responsivity ----------- */ @media only screen and (max-width: 640px){/*------ top header ------ */ .main-header{font-size: 20px !important;}.main-section-header{font-size: 28px !important;}.show{display: block !important;}.hide{display: none !important;}.align-center{text-align: center !important;}.no-bg{background: none !important;}/*----- main image -------*/ .main-image img{width: 440px !important; height: auto !important;}/*======divider======*/ .divider img{width: 440px !important;}/*-------- container --------*/ .container590{width: 440px !important;}.container580{width: 400px !important;}.main-button{width: 220px !important;}/*-------- secions ----------*/ .section-img img{width: 320px !important; height: auto !important;}.team-img img{width: 100% !important; height: auto !important;}}@media only screen and (max-width: 479px){/*------ top header ------ */ .main-header{font-size: 18px !important;}.main-section-header{font-size: 26px !important;}/*======divider======*/ .divider img{width: 280px !important;}/*-------- container --------*/ .container590{width: 280px !important;}.container590{width: 280px !important;}.container580{width: 260px !important;}/*-------- secions ----------*/ .section-img img{width: 280px !important; height: auto !important;}}</style><!-- [if gte mso 9]><style type=”text/css”> body{font-family: arial, sans-serif!important;}</style><![endif]--></head><body class="respond" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr><tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="center" height="70" style="height:70px;border-top: 1px solid #e0e0e0;"> <a href="" style="display: block; border-style: none !important; border: 0 !important;"><img width="100" border="0" style="display: block; width: 100px;" src="https://firebasestorage.googleapis.com/v0/b/convenciong12.appspot.com/o/mailImages%2F2.png?alt=media&token=b26816b0-04ee-46b8-974c-b7f2f2b2781e" alt=""/></a> </td></tr></table> </td></tr></table> </td></tr></table> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color"> <tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590"> <tr> <td align="center" class="section-img"> <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://firebasestorage.googleapis.com/v0/b/convenciong12.appspot.com/o/mailImages%2F1.jpg?alt=media&token=f2e2a144-b594-4cb9-b586-d341c71a086f" style="display: block; width: 590px;" width="590" border="0" alt=""/></a> </td></tr><tr> <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td></tr>
  `;

  const footer = `
    </table> </td></tr></table> <table border="0" width="100%" width="590" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color"> <tr class="hide"> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr><tr> <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td></tr><tr> <td height="60" style="border-top: 1px solid #e0e0e0; font-size: 60px; line-height: 60px;">&nbsp;</td></tr><tr> <td align="center"> <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590 bg_color"> <tr> <td> <table border="0" width="300" align="left" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="container590"> <tr> <td align="left"> <a href="" style="display: block; border-style: none !important; border: 0 !important;"><img width="80" border="0" style="display: block; width: 80px;" src="https://firebasestorage.googleapis.com/v0/b/convenciong12.appspot.com/o/mailImages%2F2.png?alt=media&token=b26816b0-04ee-46b8-974c-b7f2f2b2781e" alt=""/></a> </td></tr><tr> <td align="left" style="color: #888888; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 23px;" class="text_color"> <div style="color: #333333; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; font-weight: 600; mso-line-height-rule: exactly; line-height: 23px;"> Soporte Técnico: <br/> <a href="mailto:" style="color: #888888; font-size: 14px; font-family: 'Hind Siliguri', Calibri, Sans-serif; font-weight: 400;">convenciong12.vzla@gmail.com</a><br/> <a href="tel:+582446630041" style="color: #888888; font-size: 14px; font-family: 'Hind Siliguri', Calibri, Sans-serif; font-weight: 400;">0244-663.00.41</a> </div></td></tr></table> <table border="0" width="2" align="left" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="container590"> <tr> <td width="2" height="10" style="font-size: 10px; line-height: 10px;"></td></tr></table> <table border="0" width="200" align="right" cellpadding="0" cellspacing="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;" class="container590"> <tr> <td class="hide" height="45" style="font-size: 45px; line-height: 45px;">&nbsp;</td></tr><tr> <td height="15" style="font-size: 15px; line-height: 15px;">&nbsp;</td></tr><tr> <td> <table border="0" align="right" cellpadding="0" cellspacing="0"> <tr> <td> <a href="https://www.instagram.com/mciturmero/" style="display: block; border-style: none !important; border: 0 !important;"><img width="30" border="0" style="display: block;" src="https://firebasestorage.googleapis.com/v0/b/convenciong12.appspot.com/o/mailImages%2Finstagram.png?alt=media&token=467d4e2d-cba6-4dac-ab11-95eefc2978e6" alt=""></a> </td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td><td> <a href="https://www.mciturmero.com.ve" style="display: block; border-style: none !important; border: 0 !important;"><img width="28" border="0" style="display: block;" src="https://firebasestorage.googleapis.com/v0/b/convenciong12.appspot.com/o/mailImages%2Fwww.png?alt=media&token=969a1ce1-4086-4cdb-8225-451247d2df53" alt=""></a> </td><td>&nbsp;&nbsp;&nbsp;&nbsp;</td></tr><tr> </tr></table> </td></tr></table> </td></tr></table> </td></tr><tr> <td height="60" style="font-size: 60px; line-height: 60px;">&nbsp;</td></tr></table> <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="f4f4f4"> <tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr><tr> <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr></table> </body></html>
  `;

  if (status === 'approved') {
    return ({
      to: other.dest,
      from: 'INSPIRATED - <bracamontedar@gmail.com>',
      subject: `Tu inscripción a INSPIRATED ha sido APROBADA.`,
      html: `
        ${header}
          <tr>
            <td align="center" style="color: #343434; font-size: 24px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
              <div style="line-height: 35px">
                Tu inscripción fue
                <br>
                <span style="color: #D3B75E;">APROBADA</span>
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
                      <b>${other.name}</b> Por favor dirígete como responsable de esta inscripción al stand de la MCI
                      TURMERO para el retiro de las manillas.
                    </div>
                  </td>
                </tr>

                <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

                <tr>
                  <td align="Justify" style="color: #000; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
                    <div style="line-height: 24px">
                      <b>Nota:</b> Horarios de atención para el retiro de manillas y recepción de pago en efectivo ($).
                    </div>
                  </td>
                </tr>

                <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

                <tr>
                  <td align="Justify" style="color: #000; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
                    <div style="line-height: 24px">
                      <b>Lunes, Jueves y Viernes.</b> 08:00 A.M a 12:00 P.M
                      <br />
                      <i>Dirigirse a: Ps. Jorge Romo o Hna. Elsa
                        Orellana</i>
                    </div>
                  </td>
                </tr>

                <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

                <tr>
                  <td align="Justify" style="color: #000; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
                    <div style="line-height: 24px">
                      <b>Martes y Miércoles.</b> 01:00 P.M a 05:00 P.M
                      <br />
                      <i>Dirigirse a: Ps. Jorge Romo o Hna. Elsa
                        Orellana</i>
                    </div>
                  </td>
                </tr>

                <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

                <tr>
                  <td align="Justify" style="color: #000; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
                    <div style="line-height: 24px">
                      <b>Domingos.</b> 12:00 P.M a 03:00 P.M
                      <br />
                      <i>Dirigirse únicamente a: Hna. Elsa Orellana</i>
                    </div>
                  </td>
                </tr>
                
                <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

                <tr>
                  <td align="center" style="color: #424040; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
                    <div style="line-height: 24px">
                      Tu inscripción corresponde a CINCO manillas.
                      <br>
                      Código para el retiro:
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

          <tr>
            <td align="center">
              <table border="0" align="center" width="160" cellpadding="0" cellspacing="0" bgcolor="#C3A956" style="">
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
              <em>NOTA: Es importante que guardes éste código y lo presentes al autorizado de inscripción,
                de lo contrario, no se hará la entrega de las mismas.</td>
          </tr>
        ${footer}
      `,
      //   html: `
      //     <p style="font-size:22px;font-weight:400;">Por favor dirígete como responsable de esta inscripción al stand de la <b>MCI TURMERO</b> para el retiro de las manillas.</p>
      //     <p style="font-size:22px;font-weight:bold;">Tu inscripción corresponde a ${other.tickets} manillas.</p>
      //     <h3>Código para el retiro: <b>${other.code}</b></h3>
      //     <p style="font-size:18px;font-weight:400;">Es importante que guardes éste código y lo presentes al <b>autorizado de inscripción</b>, de lo contrario, no se hará la entrega de las mismas.</p>
      // `,
    });
  } else if (status === 'rejected') {
    return ({
      to: other.dest,
      from: 'INSPIRATED - <bracamontedar@gmail.com>',
      subject: `Tu inscripción a la convención Regional G12 - Forum de Valencia ha sido RECHAZADA.`,
      html: `
        ${header}

          <tr>
            <td align="center" style="color: #343434; font-size: 24px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
              <div style="line-height: 35px">
                Tu inscripción fue
                <br>
                <span style="color: #D3B75E;">RECHAZADA</span>
              </div>
            </td>
          </tr>
          
          <tr> <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td></tr><tr> <td align="center"> <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee"> <tr> <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td></tr></table> </td></tr><tr> <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td></tr>

          <tr>
            <td align="center">
              <table>
                <tr>
                  <td align="Justify" style="color: #727272; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
                    <div style="line-height: 24px">
                      <b>Motivo:</b> ${other.comment}
                    </div>
                  </td>
                </tr>
                <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

          <tr>
            <td align="Justify" style="color: #505050; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
              <b>${other.name}:</b> Para cualquier reclamo o información, dirígete al stand de inscripción en la MCI TURMERO en los siguiente horario.</td>
          </tr>

          <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

          <tr>
            <td align="Justify" style="color: #000; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
              <div style="line-height: 24px">
                <b>Lunes, Jueves y Viernes.</b> 08:00 A.M a 12:00 P.M
                <br />
                <i>Dirigirse a: Ps. Jorge Romo o Hna. Elsa
                  Orellana</i>
              </div>
            </td>
          </tr>

          <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

          <tr>
            <td align="Justify" style="color: #000; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
              <div style="line-height: 24px">
                <b>Martes y Miércoles.</b> 01:00 P.M a 05:00 P.M
                <br />
                <i>Dirigirse a: Ps. Jorge Romo o Hna. Elsa
                  Orellana</i>
              </div>
            </td>
          </tr>

          <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

          <tr>
            <td align="Justify" style="color: #000; font-size: 16px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 24px;">
              <div style="line-height: 24px">
                <b>Domingos.</b> 12:00 P.M a 03:00 P.M
                <br />
                <i>Dirigirse únicamente a: Hna. Elsa Orellana</i>
              </div>
            </td>
          </tr>

          <tr><td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td></tr>

        ${footer}
      `,
      //   html: `
      //     <p style="font-size:22px;font-weight:400;">Motivo: </p>
      //     <p style="font-size:18px;">${other.comment}</p>
      //     <p style="font-size:12px;">Para cualquier reclamo o información, dirígete al stand de inscripción en la MCI TURMERO (Sólo los días domingos en todos nuestros horarios) y consulta a alguno de los responsables.</p>
      // `,
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
