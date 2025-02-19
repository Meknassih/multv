"use client";

import H1 from "@/components/ui/h1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "./actions";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const onLogin = async () => {
    try {
      const authData = await login(email, password);
      if (authData.record) {
        localStorage.setItem("user", JSON.stringify(authData.record));
      }
      if (authData.token) {
        localStorage.setItem("token", authData.token);
      }
      toast({
        title: "Login successful",
        description: "You are now logged in",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <H1>Login</H1>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button onClick={onLogin}>Login</Button>
    </>
  );
}
