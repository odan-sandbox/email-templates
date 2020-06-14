import Email from "email-templates";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import aws from "aws-sdk";

function getTransport(env?: string): Mail {
  if (env === "production") {
    return nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: "2010-12-01",
      }),
    });
  }
  if (env === "test") {
    return nodemailer.createTransport({
      streamTransport: true,
    });
  }

  return nodemailer.createTransport({
    sendmail: true,
  });
}

async function main(): Promise<void> {
  const address = process.env.ADDRESS!;
  const transporter = getTransport(process.env.NODE_ENV);
  const email = new Email({
    message: {
      from: address,
    },
    // uncomment below to send emails in development/test env:
    // send: true,
    transport: transporter,
    views: {
      options: {
        extension: "ejs",
      },
    },
  });
  email
    .send({
      template: "mars",
      message: {
        to: address,
      },
      locals: {
        name: "odan",
      },
    })
    .then(console.log)
    .catch(console.error);
  console.log("poyo");
}

main();

process.on("unhandledRejection", (reason) => {
  console.error(reason);
  process.exit(1);
});
