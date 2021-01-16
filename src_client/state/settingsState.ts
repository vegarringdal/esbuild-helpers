import { ObjectState } from "@simple-html/core";

type formDetails = { loggedin: boolean; username: string };

export const formState = new ObjectState<formDetails>(
  "FORM_STATE",
  {} as formDetails
);
