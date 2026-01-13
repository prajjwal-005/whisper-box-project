import { NextResponse } from 'next/server';
import UserModel, { Message } from '@/model/User.model';
import { dbConnect } from '@/lib/dbConnect';
import { moderateContent } from '@/lib/moderation';
import { messageSchema } from '@/schemas/messageSchema';
import { headers } from 'next/headers';
import RateLimitModel from '@/model/RateLimit';
import mongoose from 'mongoose';
export const dynamic = 'force-dynamic';
interface IViolation {
  ip: string;
  count: number;
  updatedAt: Date;
}

const ViolationSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 }, 
  updatedAt: { type: Date, default: Date.now, expires: 86400 } 
});

const ViolationModel = (mongoose.models.Violation as mongoose.Model<IViolation>) ||
                        mongoose.model<IViolation>('Violation', ViolationSchema);

const GENERIC_ERROR_RESPONSE = {
  json: { message: 'Message could not be delivered.', success: false },
  status: 403 
};

export async function POST(request: Request) {
  await dbConnect();

  const headersList = await headers();
  const forwardedFor = headersList.get("x-vercel-forwarded-for");
  const realIp = forwardedFor ? forwardedFor.split(',')[0].trim() : headersList.get("x-real-ip");
  const ip = realIp || "127.0.0.1";

 
  const jitter = Math.floor(Math.random() * 3); 
  const currentLimitThreshold = 4 + jitter; 

  const limitResult = await RateLimitModel.findOneAndUpdate(
    { ip: ip },
    { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

 
  if (limitResult && limitResult.count > currentLimitThreshold) {
    return NextResponse.json(GENERIC_ERROR_RESPONSE.json, { status: GENERIC_ERROR_RESPONSE.status });
  }

  const { username, content } = await request.json();

  try {
    // Basic validation
    if (!username || typeof username !== 'string') {
        return NextResponse.json({ message: 'Invalid request', success: false }, { status: 400 });
    }

    const result = messageSchema.safeParse({ content });
    if (!result.success) {
       return NextResponse.json({ message: 'Invalid request', success: false }, { status: 400 });
    }

    const user = await UserModel.findOne({ username }).exec();

    if (!user || !user.isAcceptingMessages) {
        return NextResponse.json(GENERIC_ERROR_RESPONSE.json, { status: GENERIC_ERROR_RESPONSE.status });
    }

    const violationRecord = await ViolationModel.findOne({ ip });
    const currentViolationCount = violationRecord ? violationRecord.count : 0;

    if (currentViolationCount >= 3) {
      return NextResponse.json(GENERIC_ERROR_RESPONSE.json, { status: GENERIC_ERROR_RESPONSE.status });
    }

    const modResult = await moderateContent(content, currentViolationCount);
   
   
    console.log(`🛡️ Action: ${modResult.action} | IP: ${ip} | Len: ${content.length}`);

   
    if (modResult.action === 'BLOCK') {
       await ViolationModel.findOneAndUpdate(
         { ip: ip },
         { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
         { upsert: true, new: true, setDefaultsOnInsert: true }
       );
       
       return NextResponse.json(GENERIC_ERROR_RESPONSE.json, { status: GENERIC_ERROR_RESPONSE.status });
    }

const newMessage = {
    content,
    createdAt: new Date(),
    moderationAction: modResult.action, 
    isBlurred: modResult.action === 'BLUR',
    isHidden: modResult.action === 'HIDE',
    isWarned: modResult.action === 'WARN'
};

user.messages.push(newMessage as unknown as Message); 

await user.save();

    return NextResponse.json(
      { message: 'Message sent.', success: true },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      { message: 'Message could not be delivered.', success: false },
      { status: 500 }
    );
  }
}