import { DEFAULT_SENDER_EMAIL, transporter } from "@/config";
import prisma from "@/prisma";
import { Email } from "@/types";

const sendEmail = async ({
  sender,
  recipient,
  body,
  subject,
  source,
}: Email) => {
  // create mail options
  const mailOptions = {
    from: sender || DEFAULT_SENDER_EMAIL,
    to: recipient,
    subject,
    text: body,
  };

  // send mail
  const mail = await transporter.sendMail(mailOptions);

  if (!mail) {
    return { status: 500, msg: "mail not sent" };
  }

  // record mail
  await prisma.email.create({
    data: {
      sender: sender || DEFAULT_SENDER_EMAIL,
      recipient,
      subject,
      body,
      source,
    },
  });

  return { status: 200, msg: "email sent successfully" };
};

export default sendEmail;
