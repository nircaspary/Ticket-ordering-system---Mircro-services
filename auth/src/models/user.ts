import { Password } from "./../services/password";
import { Document, Model, Schema, model } from "mongoose";

interface UserAttrs {
  email: string;
  password: string;
}
interface userDoc extends Document {
  email: string;
  password: string;
}

interface userModel extends Model<userDoc> {
  build: (attrs: UserAttrs) => userDoc;
}

const userSchema = new Schema<userDoc, userModel>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await Password.toHash(this.get("password"));
    this.set("password", hashedPassword);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = model<userDoc, userModel>("User", userSchema);
export { User };
