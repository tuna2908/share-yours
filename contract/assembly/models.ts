import { context, u128, PersistentVector } from "near-sdk-as";

/**
 * Exporting a new class PostedMessage so it can be used outside of this file.
 */

@nearBindgen
export class MessageInfo {
  from: string;
  to: string;
  rating: string;
  imgUrl: string;
  donation: string;
}

@nearBindgen
export class RatingMessage {
  donation: string;
  sender: string;
  receiver: string;
  rating: string;
  image: string; //img url - only visible in production
  constructor(messageInfo: MessageInfo) {
    this.donation = messageInfo.donation;
    this.sender = messageInfo.from;
    this.receiver = messageInfo.to;
    this.rating = messageInfo.rating || "";
    this.image = messageInfo.imgUrl || "";
  }
}
/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
export const messages = new PersistentVector<RatingMessage>("r");
