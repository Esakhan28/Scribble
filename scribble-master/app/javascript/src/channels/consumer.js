import { createConsumer } from "@rails/actioncable";

const buildWebsocketURL = () => {
  const userId = localStorage.getItem("authUserId");

  return encodeURI(`/cable?user_id=${userId}`);
};

export default () => createConsumer(buildWebsocketURL());
