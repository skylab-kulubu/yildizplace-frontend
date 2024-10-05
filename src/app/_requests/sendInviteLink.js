import { DOMAIN } from "../_utils/constants";

export const sendInviteLink = function (email) {
  return fetch(`${DOMAIN}/api/users/register?schoolMail=${email}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.error("Parsing error: ", error));
};
