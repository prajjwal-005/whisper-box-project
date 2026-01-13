import mongoose , {Schema, Document} from "mongoose"

export interface Message extends Document{
    content: string;
    _id: string;
    isBlurred?: boolean;
    isHidden?: boolean;
    isWarned?: boolean;
    moderationLabel?: string;
    createdAt: Date,

}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    isBlurred: {
        type: Boolean,
        default: false,
    },
    isHidden: {
        type: Boolean,
        default: false,
    },
    isWarned: {
         type: Boolean, 
         default: false },
})

export interface User extends Document{// use ; not , 
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessages: boolean;
    isverified: boolean;
    messages:  Message[];

}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true , "Username is required"],
        trim: true,
        unique: true,
    },
    email:{
        type: String,
        required: [true , "Email is required"],
        unique: true,
        match: [ /.+\@.+\..+/, 'Please use a valid email address']
    },
    password:{
        type: String,
        required: [true , "Password is required"],
       
    },
    verifyCode:{
        type: String,
        required: [true , "Verify code is required"],
       
    },
    verifyCodeExpiry: {
        type: Date,
        required:  [true , "Verify code expiry is required"],
        default: Date.now
    },
    isverified: {
        type: Boolean,
        default: false,
    },
     isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;