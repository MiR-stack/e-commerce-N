import { MONEY_SIGN } from "@/constants";
import modifyAmount from "@/libs/modifyAmount";
import sliceText from "@/libs/sliceText";
import React from "react";

const CheckoutProduct = ({ product }) => {
  const { title, quantity, total } = product ? product : {};

  return (
    <tr>
      <td>
        {sliceText(title, 20)} <strong>× {quantity}</strong>
      </td>
      <td>
        {MONEY_SIGN}
        {modifyAmount(total)}
      </td>
    </tr>
  );
};

export default CheckoutProduct;
