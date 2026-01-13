import { auth } from "@/app/api/auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import mongoose from "mongoose"; 

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> } 
) {
  
  const resolvedParams = await params;
  const messageId = resolvedParams.messageid;

  await dbConnect();

  const session = await auth();

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not Authenticated' },
      { status: 401 }
    );
  }

  const user = session.user;

  try {
    
    console.log(`Attempting to delete message: ${messageId} for user: ${user._id}`);

    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } } // 3. Cast to ObjectId
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: 'Message not found or already deleted' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: 'Message deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error while deleting message:", error);
    return Response.json(
      { success: false, message: 'Error deleting message' },
      { status: 500 }
    );
  }
}