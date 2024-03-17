import mongoose, { Document, Model, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  title: string;
  price: number;
  id: string;
}
export interface ticketDoc extends Document {
  title: string;
  price: number;
  isReserved(): Promise<Boolean>;
  version: number;
}

interface ticketModel extends Model<ticketDoc> {
  build: (attrs: TicketAttrs) => ticketDoc;
  findByEvent: (event: { id: string; version: number }) => Promise<ticketDoc | null>;
}

const ticketSchema = new Schema<ticketDoc, ticketModel>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  const { id, version } = event;
  return Ticket.findOne({ _id: id, version: version - 1 });
};
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.AwaitingPayment, OrderStatus.Complete, OrderStatus.Created],
    },
  });
  return !!existingOrder;
};

const Ticket = model<ticketDoc, ticketModel>("Ticket", ticketSchema);
export { Ticket };
