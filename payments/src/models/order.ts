import { OrderStatus } from "@ticketing-nir/common";
import mongoose, { Document, Model, Schema, model } from "mongoose";

import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

interface OrderAttrs {
  id: string;
  userId: string;
  version: number;
  price: number;
  status: OrderStatus;
}
interface orderDoc extends Document {
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}

interface orderModel extends Model<orderDoc> {
  build: (attrs: OrderAttrs) => orderDoc;
  findByEvent: (event: { id: string; version: number }) => Promise<orderDoc | null>;
}

const orderSchema = new Schema<orderDoc, orderModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.AwaitingPayment,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
orderSchema.statics.build = (attrs: OrderAttrs) => {
  const { id, price, status, userId, version } = attrs;
  return new Order({ _id: id, price, status, userId, version });
};

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  const { id, version } = event;
  return Order.findOne({ _id: id, version: version - 1 });
};
const Order = model<orderDoc, orderModel>("Order", orderSchema);
export { Order };
