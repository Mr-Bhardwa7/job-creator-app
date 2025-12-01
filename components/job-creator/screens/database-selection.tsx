"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { ChevronLeft } from "lucide-react"

interface DatabaseSelectionProps {
  onSelectDatabase: (database: string) => void
  onBack: () => void
}

const AVAILABLE_DATABASES = [
  { value: "bigquery", label: "BigQuery" },
  { value: "snowflake", label: "Snowflake" },
]

export function DatabaseSelection({ onSelectDatabase, onBack }: DatabaseSelectionProps) {
  const [selectedDatabase, setSelectedDatabase] = useState<string>("")

  const handleNext = () => {
    if (selectedDatabase) {
      onSelectDatabase(selectedDatabase)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white flex flex-col">
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Job Creator{" "}
            <span className="inline-block bg-red-500 text-white px-3 py-1 rounded text-sm ml-2 font-semibold">
              Beta
            </span>
          </h1>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8 bg-white border-slate-200 shadow-lg">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Create New Model</h2>
              <p className="text-slate-600">Select the target database for which you want the model to be generated.</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 block">Target Database</label>
              <Select value={selectedDatabase} onValueChange={setSelectedDatabase}>
                <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                  <SelectValue placeholder="-- Select Database --" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-300">
                  {AVAILABLE_DATABASES.map((db) => (
                    <SelectItem key={db.value} value={db.value} className="text-slate-900">
                      {db.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 border-slate-300 bg-white hover:bg-slate-100 text-slate-900"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedDatabase}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Start Building
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
