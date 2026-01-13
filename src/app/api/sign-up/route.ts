import {dbConnect} from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/helpers/sendEmailVerification";


export async function POST(request: Request) {
    await dbConnect();

    try {
    const {username, email, password} =  await request.json(); 
     const existingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isverified: true,
    })

    if(existingUserVerifiedByUsername){
        return Response.json({
            success: false,
            message : "Username already exist"
        }, {status:400})
    }

    const existingUserByEmail = await UserModel.findOne({email})
    const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
    if(existingUserByEmail)
    {
        if(existingUserByEmail.isverified)
        {
             return Response.json({
            success: false,
            message : "User already exist with this email"
        }, {status:400})
        }
        else{
            const hasedPassword = await bcrypt.hash(password,10)
            existingUserByEmail.password = hasedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserByEmail.save()
                const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode,
    );


if (!emailResponse.success) {
  return Response.json(
    { success: false, message: emailResponse.message },
    { status: 400 } // This is what triggers your frontend error
  );
}

    return Response.json({
        success: true,
        message: "Verification email re-sent. Please verify your email.",
    }, { status: 200 }); 

        }
    }
    else
    {
        const hasedPassword = await bcrypt.hash(password,10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                isverified: false,
                messages:  []
        })
        await newUser.save()
        console.log(newUser);

        //send verification mail
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        )
       
        console.log("📨 Email response:", emailResponse);
        if(!emailResponse.success)
        {
            return Response.json({
            success: false,
            message : emailResponse.message,
        }, {status:400})
        }
    
         return Response.json({
            success: true,
            message : "User regsitered succesfully. Please verify your email",
        }, {status:201})
    }
    } catch (error) {
        console.error('Error registering user', error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}