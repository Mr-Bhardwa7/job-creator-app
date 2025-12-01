"use client"

import { useState, useEffect } from "react"
import { OptionSelection } from "./screens/option-selection"
import { DatabaseSelection } from "./screens/database-selection"
import { QueryBuilder } from "./screens/query-builder"
import { GeneratedQuery } from "./screens/generated-query"
import { UserGuidance } from "./screens/user-guidance"
import { ProgressDialog } from "./screens/progress-dialog"

export type Screen = "options" | "guidance" | "database" | "builder" | "generated"
const baseURl = process.env.NEXT_PUBLIC_BASE_URL || 'http:localhost:3000'

export interface Field {
  column: string
  alias: string
}

export interface AggregationRow {
  function: string
  column: string
  alias: string
}

export interface CumulativeRow {
  windowFunction: string
  partitionBy: string
  orderBy: {
    alias: string
    direction: string
  }
  databaseColumn: string
  alias: string
  frame?: string
}

export interface FormData {
  database: string
  tableName: string
  fields: Field[]
  aggregation: AggregationRow[]
  cumulative: CumulativeRow[]
  customSql: string
}

export function JobCreatorApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("options")
  const [formData, setFormData] = useState<FormData>({
    database: "",
    tableName: "",
    fields: [],
    aggregation: [],
    cumulative: [],
    customSql: "",
  })
  const [jsonPayload, setJsonPayload] = useState<any>(null)
  const [sqlQuery, setSqlQuery] = useState<string>("")
  const [token, setToken] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 15
        return Math.min(prev + increment, 95)
      })
    }, 300)

    return () => clearInterval(interval)
  }, [isGenerating])

  const handleSelectOption = (option: string) => {
    if (option === "new") {
      setCurrentScreen("database")
    } else if (option === "guidance") {
      setCurrentScreen("guidance")
    }
  }

  const handleBackFromGuidance = () => {
    setCurrentScreen("options")
  }

  const handleDatabaseSelect = async (database: string) => {
    setFormData({ ...formData, database })
    setCurrentScreen("builder");

    try {
       const response = await fetch(`${baseURl}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: process.env.NEXT_PUBLIC_AUTH_USERNAME || 'XXXX',
          authKey: process.env.NEXT_PUBLIC_AUTH_KEY || 'XXXXXX',
        }),
       })
      
      if (!response.ok) throw new Error("Failed to generate auth token")
      
      const data = await response.json();
      setToken(data.token)
    } catch (error) {
      console.error("Error generating auth token:", error)
      throw error
    }
  }

  const handleFormUpdate = (updates: Partial<FormData>) => {
    setFormData({ ...formData, ...updates })
  }

  const handleGenerateQuery = async (payload: any) => {
    setIsGenerating(true)
    setProgress(0)
    setJsonPayload(payload)

    try {
      const response = await fetch("/api/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          database: formData.database,
          ...payload,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate query")

      const data = await response.json()
      setProgress(100)
      setSqlQuery(data.sql)

      // Small delay to show 100% completion
      setTimeout(() => {
        setCurrentScreen("generated")
      }, 500)
    } catch (error) {
      console.error("Error generating query:", error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBackToOptions = () => {
    setCurrentScreen("options")
    setFormData({
      database: "",
      tableName: "",
      fields: [],
      aggregation: [],
      cumulative: [],
      customSql: "",
    })
    setJsonPayload(null)
    setSqlQuery("")
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressDialog isOpen={isGenerating} progress={progress} message="Processing your query and generating SQL..." />

      {currentScreen === "options" && <OptionSelection onSelectOption={handleSelectOption} />}
      {currentScreen === "guidance" && <UserGuidance onBack={handleBackFromGuidance} />}
      {currentScreen === "database" && (
        <DatabaseSelection onSelectDatabase={handleDatabaseSelect} onBack={() => setCurrentScreen("options")} />
      )}
      {currentScreen === "builder" && (
        <QueryBuilder
          database={formData.database}
          formData={formData}
          onFormUpdate={handleFormUpdate}
          onGenerateQuery={handleGenerateQuery}
          onBack={() => setCurrentScreen("database")}
          isGenerating={isGenerating}
        />
      )}
      {currentScreen === "generated" && (
        <GeneratedQuery
          database={formData.database}
          jsonPayload={jsonPayload}
          sqlQuery={sqlQuery}
          onBackToHome={handleBackToOptions}
        />
      )}
    </div>
  )
}
