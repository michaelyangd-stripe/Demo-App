import React from "react";
import { AddressElement } from "@stripe/react-stripe-js";

const AddressForm = () => {
  return <AddressElement options={{ mode: "shipping" }} />;
};

export default AddressForm;
