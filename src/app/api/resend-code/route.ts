import {dbConnect} from '@/lib/dbConnect';
import UserModel from '@/model/User.model';
import { sendVerificationEmail } from '@/helpers/sendEmailVerification';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  
  console.log("1. Resend Code API started");
  
  await dbConnect();
  console.log("2. DB Connected");

  try {
    const { username } = await request.json();
    console.log("3. Received Username:", username);

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      console.log("❌ User not found");
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (user.isverified) {
      console.log("❌ User already verified");
      return Response.json({ success: false, message: "User is already verified" }, { status: 400 });
    }

    // Generate Code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    console.log("4. User updated with new code:", verifyCode);

   
    const apiKey = process.env.RESEND_API_KEY;
    console.log("5. API Key exists?", !!apiKey); 

    // Send Email
    console.log("6. Attempting to send email to:", user.email);
    const emailResponse = await sendVerificationEmail(
      user.email,
      user.username,
      verifyCode
    );
    console.log("7. Email Response:", emailResponse);

    if (!emailResponse.success) {
      return Response.json({ success: false, message: emailResponse.message }, { status: 500 });
    }

    return Response.json({ success: true, message: "Verification code sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("❌ CRITICAL ERROR in Resend API:", error);
    return Response.json({ success: false, message: "Error resending code" }, { status: 500 });
  }
}