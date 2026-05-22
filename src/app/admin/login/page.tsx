"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/actions/admin-auth"
import { Loader2 } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      router.push("/admin")
    } else {
      setError(result.error || "Login failed")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0b] p-4">
      <div className="w-full max-w-md rounded-lg border border-[#e8e2d6]/10 bg-[#11110f] p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#c9a35c]">Admin Login</h1>
          <p className="mt-1 text-sm text-[#e8e2d6]/50">Sign in to manage your site</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-[#e8e2d6]/10 bg-[#0d0d0b] px-4 py-2.5 text-sm text-[#e8e2d6] placeholder-[#e8e2d6]/30 outline-none transition-colors focus:border-[#c9a35c] focus:ring-1 focus:ring-[#c9a35c]"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#e8e2d6]/80">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-[#e8e2d6]/10 bg-[#0d0d0b] px-4 py-2.5 text-sm text-[#e8e2d6] placeholder-[#e8e2d6]/30 outline-none transition-colors focus:border-[#c9a35c] focus:ring-1 focus:ring-[#c9a35c]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#c9a35c] px-4 py-2.5 text-sm font-semibold text-[#0d0d0b] transition-colors hover:bg-[#b8922f] disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}
