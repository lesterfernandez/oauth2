import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { login } = useAuth();

  console.log("hello world");
  return (
    <div>
      welcome!
      <br></br>
      <button onClick={login}>login with google</button>
    </div>
  );
}
