import { OrderStatus } from "@ticketing-nir/common";
import mongoose, { Document, Model, Schema, model } from "mongoose";
import { ticketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ticketDoc;
}
interface orderDoc extends Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ticketDoc;
  version: number;
}

interface orderModel extends Model<orderDoc> {
  build: (attrs: OrderAttrs) => orderDoc;
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
      default: OrderStatus.Created,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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
  return new Order(attrs);
};

const Order = model<orderDoc, orderModel>("Order", orderSchema);
export { Order };
