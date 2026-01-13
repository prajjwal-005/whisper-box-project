import { auth} from "@/app/api/auth/[...nextauth]/options";
import {dbConnect} from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

import  {acceptMessageSchema as AcceptMessageSchema}  from '../../../schemas/acceptMessageSchema'; 

export async function POST(request:Request) {
    await dbConnect()

    const session= await auth();
     const user = session?.user

     if(!session || !session.user){     
       return Response.json(
       {
        success: false,
        message: 'Not Authenticated',
       },
       { status: 401 }
        );
     }

      const userId = user?._id;

      const requestBody = await request.json()
      

      try {

         const validatedData = AcceptMessageSchema.parse(requestBody); 
         const {acceptMessages} = validatedData

        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            {isAcceptingMessages: acceptMessages},
            {new: true}
        )
        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept messages"
                },
                {status: 404}
            )
        }
         return Response.json(
                {
                    success: true,
                    message: "Message acceptance status updated successfully",
                    updatedUser,
                },
                {status: 200}
            )
      } catch (error) {
        console.log("failed to update user status to accept messages",error)
        if(error instanceof Error ){
          return Response.json(
            {
              success: false,
              message: 'failed to update user status to accept messages',
             
            },
            { status: 500 }
          );
        }
      }

}

export async function GET(request:Request) {
    await dbConnect()

    const session= await auth();
     const user = session?.user

     if(!session || !session.user){     
       return Response.json(
       {
        success: false,
        message: 'Not Authenticated',
       },
       { status: 401 }
        );
     }

      const userId = user?._id;

      try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
              return Response.json(
                  {
                      success: false,
                      message: "user not found"
                  },
                  {status: 404}
              )
          }
  
          return Response.json(
                  {
                      success: true, 
                      isAcceptingMessages: foundUser.isAcceptingMessages, 
                  },
                  {status: 200}
              )
      } catch (error) {
        console.log("Error retrieving message acceptance status: ",error)
        return Response.json(
       {
        success: false,
        message: 'Error getting message acceptance status',
       },
       { status: 500 }
        );
      }
    }