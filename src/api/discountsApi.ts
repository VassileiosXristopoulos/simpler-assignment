import { Discount } from "types";
import { get } from "./apiCallerHelper.core";

export async function getDiscounts() {
  const response = await get(`/discounts`);
  if ('data' in response && response.data) {
    const responseData = response.data as Discount[];
    return responseData;
  }
  
  throw new Error("Error while retrieving discounts");
}
