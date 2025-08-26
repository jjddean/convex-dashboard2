"use client"

import { useMemo, useState } from "react"

interface TestSpec {
  name: string
  endpoint: string
  method: "GET" | "POST"
  body?: any
}

interface TestResult {
  endpoint: string
  name: string
  status: "success" | "error"
  responseTime: number
  data?: any
  error?: string
}

const defaultTests: TestSpec[] = [
  {
    name: "Quote API",
    endpoint: "/api/quotes",
    method: "POST",
    body: {
      origin: "London, UK",
      destination: "Hamburg, DE",
      serviceType: "ocean",
      cargoType: "general",
      weight: "1000",
      dimensions: { length: "100", width: "100", height: "100" },
      value: "10000",
      incoterms: "FOB",
      urgency: "standard",
      additionalServices: ["insurance"],
      contactInfo: {
        name: "Admin Test",
        email: "admin@test.com",
        phone: "+44123456789",
        company: "Test Company",
      },
    },
  },
  {
    name: "Rates API",
    endpoint: "/api/rates",
    method: "POST",
    body: {
      origin: {
        street1: "123 Test St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "US",
      },
      destination: {
        street1: "456 Test Ave",
        city: "Los Angeles",
        state: "CA",
        zip: "90001",
        country: "US",
      },
      parcel: {
        length: 10,
        width: 8,
        height: 6,
        distance_unit: "in",
        weight: 5,
        mass_unit: "lb",
      },
    },
  },
  {
    name: "Tracking API",
    endpoint: "/api/shipments/SH-2024-001/tracking",
    method: "GET",
  },
]

export default function ApiTestingPage() {
  const initialBase = typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_VERCEL_APP_URL || window.location.origin)
    : (process.env.NEXT_PUBLIC_VERCEL_APP_URL || "")
  const [baseUrl, setBaseUrl] = useState<string>(initialBase)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const canRun = useMemo(() => !!baseUrl, [baseUrl])

  const runTests = async () => {
    if (!baseUrl) return
    setIsLoading(true)
    setResults([])

    const out: TestResult[] = []
    for (const test of defaultTests) {
      const start = Date.now()
      try {
        const res = await fetch(`${baseUrl}${test.endpoint}`, {
          method: test.method,
          headers: { "Content-Type": "application/json" },
          body: test.body ? JSON.stringify(test.body) : undefined,
        })
        const responseTime = Date.now() - start
        let data: any = undefined
        try {
          data = await res.json()
        } catch (e) {
          // ignore non-JSON
        }
        out.push({
          endpoint: test.endpoint,
          name: test.name,
          status: res.ok ? "success" : "error",
          responseTime,
          data: res.ok ? data : undefined,
          error: res.ok ? undefined : `HTTP ${res.status}`,
        })
      } catch (err: any) {
        out.push({
          endpoint: test.endpoint,
          name: test.name,
          status: "error",
          responseTime: Date.now() - start,
          error: err?.message || "Unknown error",
        })
      }
    }
    setResults(out)
    setIsLoading(false)
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Testing</h1>
        <p className="text-gray-600">
          Run end-to-end tests against a deployed user-side app (Vercel).
        </p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-sm font-medium text-gray-700 min-w-40">Base URL</label>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-vercel-app-url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={runTests}
            disabled={!canRun || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Testing..." : "Run Tests"}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Configure via NEXT_PUBLIC_VERCEL_APP_URL to prefill this field.
        </p>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, idx) => (
            <div
              key={idx}
              className={`p-4 border rounded-md ${
                r.status === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm text-gray-900">
                  {r.name} <span className="text-gray-500">({r.endpoint})</span>
                </div>
                <div className="text-xs text-gray-500">{r.responseTime}ms</div>
              </div>
              {r.error && (
                <div className="mt-2 text-sm text-red-700">{r.error}</div>
              )}
              {r.data && (
                <pre className="mt-2 text-xs bg-white/50 p-3 rounded border overflow-x-auto">
                  {JSON.stringify(r.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}