import React from "react";
import IsMe from "./IsMe";
import Other from "./Other";

const ChatItem = ({ isMe, text, date, photo, type, fullName }) => {
  if (isMe) {
    return <IsMe text={text} date={date} type={type} />;
  }
  return (
    <Other
      fullName={fullName}
      text={text}
      date={date}
      type={type}
      photo={photo}
    />
  );
};

export default ChatItem;
