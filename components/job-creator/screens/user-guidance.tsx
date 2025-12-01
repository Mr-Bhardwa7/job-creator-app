"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Database, Settings2, CheckCircle2, Zap } from "lucide-react"

interface UserGuidanceProps {
  onBack: () => void
}

export function UserGuidance({ onBack }: UserGuidanceProps) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">
              Job Creator{" "}
              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded text-sm ml-2 font-semibold">
                Beta
              </span>
            </h1>
            <Button
              onClick={onBack}
              variant="outline"
              className="border-slate-300 bg-white hover:bg-slate-100 text-slate-900"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">User Guidance</h2>
          <p className="text-slate-600">Learn how to use the Job Creator tool to build SQL queries</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Getting Started</h2>
                <p className="text-slate-600">
                  The Job Creator helps you build SQL queries and models for your database. Start by selecting "Create
                  Model" to begin. You'll be guided through a step-by-step process to configure your query parameters.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <Settings2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Steps Overview</h2>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Select your target database (BigQuery or Snowflake)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Configure fields and specify column names with optional aliases
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Add layers and filters as needed to refine your query
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    Generate and execute your query with a single click
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <Database className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Field Configuration</h2>
                <p className="text-slate-600 mb-3">When configuring fields, you'll specify:</p>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li>
                    <span className="text-slate-900 font-medium">Database Column (Key):</span> The physical column name
                    from your database
                  </li>
                  <li>
                    <span className="text-slate-900 font-medium">Alias (Value):</span> An optional display name for the
                    column in results
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Next Steps</h2>
            <p className="text-slate-600 mb-6">
              Once you understand the process, head back and select "Create Model" to start building your first query!
            </p>
            <Button onClick={onBack} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Get Started
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
