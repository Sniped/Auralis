'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, changePassword } from "@/lib/auth";
import { CognitoUser } from "amazon-cognito-identity-js";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (!result.success) {
        setError(result.error || "Sign in failed");
        setLoading(false);
        return;
      }

      if (result.requiresPasswordChange && result.cognitoUser) {
        // User needs to change password
        setRequiresPasswordChange(true);
        setCognitoUser(result.cognitoUser);
        setLoading(false);
        return;
      }

      // Successful login - redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!cognitoUser) {
      setError("Session expired. Please sign in again.");
      setRequiresPasswordChange(false);
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword(cognitoUser, newPassword);

      if (!result.success) {
        setError(result.error || "Password change failed");
        setLoading(false);
        return;
      }

      // Successful password change - redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <main className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-black overflow-hidden overscroll-none min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/50 border-b border-white/10">
        <div className="w-full px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            Auralis
          </Link>
          
          {/* Back to Home */}
          <Link href="/">
            <Button 
              size="sm"
              className="px-6 py-2 text-sm bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-full font-semibold shadow-lg shadow-gray-500/30 hover:shadow-gray-500/50 transition-all duration-300 hover:scale-105 border border-gray-600"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>

      {/* Grid overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      {/* Sign In Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        <Card className="w-full max-w-md bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm shadow-2xl shadow-blue-500/20">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-center text-gray-400 text-sm">
              Sign in to your Auralis account
            </p>
          </CardHeader>
          <CardContent>
            {!requiresPasswordChange ? (
              // Initial Sign In Form
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-blue-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-blue-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>

                {/* Sign In Button */}
                <Button 
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full px-10 py-6 text-base bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            ) : (
              // Password Change Form
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm">
                  You must change your password before continuing.
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {/* New Password Input */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium text-gray-300">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-blue-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-400">Must be at least 8 characters</p>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-blue-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>

                {/* Change Password Button */}
                <Button 
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full px-10 py-6 text-base bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Changing password..." : "Change Password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
