/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import { Context, logging, storage } from "near-sdk-as";
import { RatingMessage, messages, MessageInfo } from "./models";

const DEFAULT_MESSAGE = "Hello";
const MESSAGE_LIMIT = 10;

export function getGreeting(accountId: string): string | null {
  // https://docs.near.org/docs/concepts/data-storage#assemblyscript-collection-types
  return storage.get<string>(accountId, DEFAULT_MESSAGE);
}

export function setGreeting(message: string): void {
  const accountId = Context.sender;
  logging.log(`Saving greeting "${message}" for account "${accountId}"`);
  storage.set(accountId, message);
}

export function addRateMessage(message: MessageInfo): void {
  // logging.log(message);
  // console.log(JSON.stringify(messageInfo));
  const _message = new RatingMessage(message);
  messages.push(_message);
}

export function getRateMessages(): RatingMessage[] {
  const numMessages = min(MESSAGE_LIMIT, messages.length);
  const startIndex = messages.length - numMessages;
  const result = new Array<RatingMessage>(numMessages);
  for (let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
  }
  return result;
}
