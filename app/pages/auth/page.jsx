"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function AuthPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token_id");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleSignup = async () => {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token_id", data.token_id);
      setIsAuthenticated(true);
      router.push("/");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token_id", data.token_id);
        setIsAuthenticated(true);
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token_id");
    setIsAuthenticated(false);
    router.push("/pages/auth");
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
        {!isAuthenticated ? (
          <>
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-white">
                {isLogin ? "LOGIN" : "SIGNUP"}
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                {isLogin ? "Log in to your account" : "Sign up to get started"}
              </p>
            </div>
            {isLogin ? (
              <form className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="sr-only">
                      Email address
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        required
                        className="pl-10 bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Email address"
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                      <MailIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type="password"
                        required
                        className="pl-10 bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Password"
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                      <LockIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={handleLogin}
                  >
                    Log In
                  </Button>
                </div>
              </form>
            ) : (
              <form className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="sr-only">
                      Full name
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        required
                        className="pl-10 bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Full name"
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                      <UserIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="sr-only">
                      Email address
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        required
                        className="pl-10 bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Email address"
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                      <MailIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type="password"
                        required
                        className="pl-10 bg-gray-700 text-white placeholder-gray-500 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Password"
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                      <LockIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </Button>
                </div>
              </form>
            )}
            <p className="mt-2 text-center text-sm text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={handleToggle}
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </>
        ) : (
          <div className="text-center">
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
