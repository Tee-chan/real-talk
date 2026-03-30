'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { useLogin } from '@/hooks/useAuth'

export default function LoginPage() {
  const login = useLogin()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate(form)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
        <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
        <p className="mb-6 text-sm text-gray-500">Sign in to RealTalk</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
          />
          {login.error && (
            <p className="text-sm text-red-500">Invalid email or password</p>
          )}
          <Button type="submit" size="lg" loading={login.isPending} className="mt-2 w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          No account?{' '}
          <Link href="/register" className="text-brand-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
