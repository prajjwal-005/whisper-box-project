import { auth } from "../auth/[...nextauth]/options"; 
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import mongoose from "mongoose";


export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  await dbConnect();

  const session = await auth();


  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not Authenticated' },
      { status: 401 }
    );
  }

  try {
   
    const user = await UserModel.findOne({ _id: session.user._id })
        .select('messages') // Only fetch the messages field
        .lean(); // Convert to plain JS object

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const sortedMessages = (user.messages || []).sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return Response.json(
      { success: true, messages: sortedMessages },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}