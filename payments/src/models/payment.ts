import { OrderStatus } from "@ticketing-nir/common";
import mongoose, { Document, Model, Schema, model } from "mongoose";

import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttrs {
  orderId: string;
  chargeId: string;
}
interface paymentDoc extends Document {
  orderId: string;
  chargeId: string;
}

interface paymentModel extends Model<paymentDoc> {
  build: (attrs: PaymentAttrs) => paymentDoc;
  findByEvent: (event: { id: string; version: number }) => Promise<paymentDoc | null>;
}

const paymentSchema = new Schema<paymentDoc, paymentModel>(
  {
    orderId: {
      required: true,
      type: String,
    },
    chargeId: {
      required: true,
      type: String,
    },
  },
  {
    versionKey: "version",
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);
mongoose.plugin(updateIfCurrentPlugin);
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = model<paymentDoc, paymentModel>("Payment", paymentSchema);
export { Payment };
