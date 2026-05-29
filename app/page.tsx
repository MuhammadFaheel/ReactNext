"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      router.replace("/Dashboard");
    } else {
      router.replace("/Login");
    }
  }, [router]);

  return (
    <main>
      <h1>Redirecting...</h1>
      <p>{checking ? "Checking authentication..." : ""}</p>
    </main>
  );
}
