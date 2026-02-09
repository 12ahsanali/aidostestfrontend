"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
  const [username, setUsername] = useState(null);

  return (
    <>
      <Header username={username} setUsername={setUsername} />
      {children}
      <Toaster />
    </>
  );
}
