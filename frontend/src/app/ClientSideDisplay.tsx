"use client";

import { useState } from "react";

type Props = {
  initialMessage: string;
};

export default function ClientSideDisplay({ initialMessage }: Props) {
  const [message, setMessage] = useState(initialMessage);

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={() => setMessage("Updated in browser!")}>
        Change Message
      </button>
    </div>
  );
}
