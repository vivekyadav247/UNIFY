const Otp = require("../model/otp");

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function saveOtp(email) {
  const existingOtp = await Otp.findOne({ email });

  // RATE LIMIT CHECK → Only 1 OTP per 60 seconds
  if (existingOtp) {
    const secondsPassed = (Date.now() - existingOtp.lastSentAt) / 1000;

    if (secondsPassed < 60) {
      const wait = Math.ceil(60 - secondsPassed);
      throw new Error(
        `Please wait ${wait} seconds before requesting another OTP.`
      );
    }
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 60 * 1000);

  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt, lastSentAt: Date.now() },
    { upsert: true, new: true }
  );

  return otp;
}

async function resendOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const otp = await saveOtp(email); // rate limit inside
    await sendEmailOtp(email, otp);

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { saveOtp, resendOtp };
