"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, ArrowLeft, KeyRound, Eye, EyeOff } from "lucide-react";

type View = "login" | "forgot" | "reset";

export default function AdminLoginPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("admin_authenticated", "true");
        toast.success("Logged in!");
        router.push("/admin/dashboard");
      } else {
        toast.error(data.error || "Invalid credentials");
        setLoading(false);
      }
    } catch {
      toast.error("Failed to login");
      setLoading(false);
    }
  };

  const handleRequestReset = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password/request", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Reset code sent to admin email");
        setView("reset");
      } else {
        toast.error(data.error || "Failed to send reset code");
      }
    } catch {
      toast.error("Failed to request reset");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: resetCode, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Password updated successfully!");
        setView("login");
        setResetCode("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setView("login");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4" suppressHydrationWarning>
      <Card className="bg-[#111] border-white/10 p-8 rounded-2xl w-full max-w-md">
        <div className="space-y-6">
          {view === "login" && (
            <>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold">Admin Login</h1>
                <p className="text-white/60 text-sm">Enter your credentials to access the dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm text-white/80">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter username"
                    required
                    className="bg-[#1a1a1a] border-white/10 h-12 rounded-lg text-white placeholder:text-white/30"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-white/80">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      required
                      className="bg-[#1a1a1a] border-white/10 h-12 rounded-lg text-white placeholder:text-white/30 pr-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-white hover:bg-gray-100 text-black h-12 rounded-xl font-bold"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
                </Button>
              </form>

              <button
                onClick={() => setView("forgot")}
                className="w-full text-center text-white/50 hover:text-white text-sm transition-colors"
              >
                Forgot / Change Password?
              </button>
            </>
          )}

          {view === "forgot" && (
            <>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-white/60 text-sm">
                  A verification code will be sent to the admin email address
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleRequestReset}
                  className="w-full bg-white hover:bg-gray-100 text-black h-12 rounded-xl font-bold"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
                </Button>

                <button
                  onClick={goBack}
                  className="w-full flex items-center justify-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            </>
          )}

          {view === "reset" && (
            <>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold">Enter New Password</h1>
                <p className="text-white/60 text-sm">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm text-white/80">Reset Code</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="Enter 6-digit code"
                    required
                    maxLength={6}
                    className="bg-[#1a1a1a] border-white/10 h-12 rounded-lg text-white placeholder:text-white/30 text-center text-xl tracking-widest"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm text-white/80">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      required
                      minLength={8}
                      className="bg-[#1a1a1a] border-white/10 h-12 rounded-lg text-white placeholder:text-white/30 pr-12"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm text-white/80">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    required
                    className="bg-[#1a1a1a] border-white/10 h-12 rounded-lg text-white placeholder:text-white/30"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-white hover:bg-gray-100 text-black h-12 rounded-xl font-bold"
                  disabled={loading || resetCode.length !== 6}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                </Button>
              </form>

              <button
                onClick={goBack}
                className="w-full flex items-center justify-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </>
          )}
        </div>
      </Card>
    </main>
  );
}
