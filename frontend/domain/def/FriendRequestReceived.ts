import { EMPTY_GUID } from "../constant/empty_guid";
import type { TNullable } from "@/domain/type/TCommon";
import type { IFriendRequestReceived } from "../meta/IFriendRequestReceived";

class FriendRequestReceived implements IFriendRequestReceived {
  senderId: string;
  senderFirstName: TNullable<string>;
  senderLastName: TNullable<string>;
  senderUserName: TNullable<string>;
  sentAt: Date;
  constructor(
    senderId = EMPTY_GUID,
    senderFirstName = null,
    senderLastName = null,
    senderUserName = null,
    sentAt = new Date(),
  ) {
    this.senderId = senderId;
    this.senderFirstName = senderFirstName;
    this.senderLastName = senderLastName;
    this.senderUserName = senderUserName;
    this.sentAt = sentAt;
  }
}
export { FriendRequestReceived };
