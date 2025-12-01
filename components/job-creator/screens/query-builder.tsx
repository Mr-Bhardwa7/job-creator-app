"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import type { FormData } from "../app"
import { Plus, Trash2, ChevronLeft, Lock } from "lucide-react"
import { toast } from "react-toastify"

interface QueryBuilderProps {
  database: string
  formData: FormData
  onFormUpdate: (updates: Partial<FormData>) => void
  onGenerateQuery: (payload: any) => void
  onBack: () => void
  isGenerating?: boolean
}

const AGGREGATION_FUNCTIONS = ["SUM", "AVG", "COUNT", "MIN", "MAX", "COUNT_DISTINCT"]
const WINDOW_FUNCTIONS = ["RANK", "ROW_NUMBER", "DENSE_RANK", "LAG", "LEAD"]
const FRAME_OPTIONS = ["UNBOUNDED PRECEDING", "UNBOUNDED FOLLOWING", "CURRENT"]

export function QueryBuilder({
  database,
  formData,
  onFormUpdate,
  onGenerateQuery,
  onBack,
  isGenerating = false,
}: QueryBuilderProps) {
  const [activeTab, setActiveTab] = useState<string>("fields")

  const handleAddField = () => {
    onFormUpdate({
      fields: [...formData.fields, { column: "", alias: "" }],
    })
  }

  const handleUpdateField = (index: number, updates: Partial<(typeof formData.fields)[0]>) => {
    const newFields = [...formData.fields]
    newFields[index] = { ...newFields[index], ...updates }
    onFormUpdate({ fields: newFields })
  }

  const handleRemoveField = (index: number) => {
    onFormUpdate({
      fields: formData.fields.filter((_, i) => i !== index),
    })
  }

  const handleAddAggregation = () => {
    onFormUpdate({
      aggregation: [...formData.aggregation, { function: "SUM", column: "", alias: "" }],
    })
  }

  const handleUpdateAggregation = (index: number, updates: any) => {
    const newAgg = [...formData.aggregation]
    newAgg[index] = { ...newAgg[index], ...updates }
    onFormUpdate({ aggregation: newAgg })
  }

  const handleRemoveAggregation = (index: number) => {
    onFormUpdate({
      aggregation: formData.aggregation.filter((_, i) => i !== index),
    })
  }

  const handleAddCumulative = () => {
    onFormUpdate({
      cumulative: [
        ...formData.cumulative,
        {
          windowFunction: "ROW_NUMBER",
          partitionBy: "",
          orderBy: { alias: "", direction: "ASC" },
          databaseColumn: "",
          alias: "",
          frame: "UNBOUNDED PRECEDING",
        },
      ],
    })
  }

  const handleUpdateCumulative = (index: number, updates: any) => {
    const newCum = [...formData.cumulative]
    newCum[index] = { ...newCum[index], ...updates }
    onFormUpdate({ cumulative: newCum })
  }

  const handleRemoveCumulative = (index: number) => {
    onFormUpdate({
      cumulative: formData.cumulative.filter((_, i) => i !== index),
    })
  }

  const handleGenerateQuery = async () => {
    if (!formData.tableName.trim()) {
      toast.error("Please enter a table name")
      return
    }

    if (formData.fields.length === 0) {
      toast.error("Please add at least one field")
      return
    }

    const payload = {
      tableName: formData.tableName,
      fields: formData.fields,
      aggregation: formData.aggregation.length > 0 ? formData.aggregation : undefined,
      cumulative: formData.cumulative.length > 0 ? formData.cumulative : undefined,
      customSql: formData.customSql || undefined,
    }

    try {
      await onGenerateQuery(payload)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate query"
      console.error("[v0] Error generating query:", error)
      toast.error(errorMessage)
    }
  }

  const isFormValid = formData.tableName.trim() !== "" && formData.fields.length > 0
  const disabledTabs = ["complex-data", "date-time"]

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Job Creator</h1>
            <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded mt-2">Beta</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-slate-300 text-slate-900 hover:bg-slate-100 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleGenerateQuery}
              disabled={!isFormValid || isGenerating}
              className="bg-green-600 text-white hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Query"
              )}
            </Button>
          </div>
        </div>

        {isGenerating && (
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-green-600 h-full rounded-full animate-pulse"
              style={{
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                width: "100%",
              }}
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Vertical Tab Sidebar */}
        <div className="w-48 bg-white border-r border-slate-200 pt-6">
          <nav className="space-y-1 px-4">
            {[
              { id: "fields", label: "Fields", disabled: false },
              { id: "aggregation", label: "Aggregation", disabled: false },
              { id: "cumulative", label: "Cumulative", disabled: false },
              { id: "complex-data", label: "Complex Data", disabled: true },
              { id: "date-time", label: "Date/Time", disabled: true },
              { id: "custom-sql", label: "Custom SQL", disabled: false },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 group ${
                  activeTab === tab.id
                    ? "bg-green-50 text-green-700 border-l-4 border-green-600 pl-3"
                    : tab.disabled
                      ? "text-slate-400 cursor-not-allowed opacity-60"
                      : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.disabled && <Lock className="w-3.5 h-3.5 shrink-0" />}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            {/* Fields Tab */}
            <TabsContent value="fields" className="space-y-6 m-0 p-8 h-full">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Select Fields</h2>
                <p className="text-slate-600 text-sm mb-6">
                  Specify the physical column name (Key) and an optional display alias (Value).
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Table Name</label>
                    <Input
                      placeholder="e.g., PUBLIC.CUSTOMERS"
                      value={formData.tableName}
                      onChange={(e) => onFormUpdate({ tableName: e.target.value })}
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-semibold text-slate-900">Database Column (Key)</label>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-900">Alias (Value)</label>
                      </div>
                    </div>

                    {formData.fields.map((field, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 mb-3 items-end">
                        <Input
                          placeholder="Physical Name"
                          value={field.column}
                          onChange={(e) => handleUpdateField(index, { column: e.target.value })}
                          className="bg-white border-slate-300 text-slate-900"
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="Alias (Optional)"
                            value={field.alias}
                            onChange={(e) => handleUpdateField(index, { alias: e.target.value })}
                            className="flex-1 bg-white border-slate-300 text-slate-900"
                          />
                          <Button
                            onClick={() => handleRemoveField(index)}
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      onClick={handleAddField}
                      variant="outline"
                      size="sm"
                      className="mt-4 gap-2 bg-white border-slate-300 text-slate-900 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Plus className="w-4 h-4" />
                      Add Field
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aggregation Tab */}
            <TabsContent value="aggregation" className="space-y-6 m-0 p-8 h-full">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Aggregation</h2>
                <p className="text-slate-600 text-sm mb-6">Add aggregation functions to your query (optional).</p>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Function</label>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Database Column</label>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-900">Alias</label>
                    </div>
                  </div>

                  {formData.aggregation.map((row, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 items-end">
                      <Select
                        value={row.function}
                        onValueChange={(value) => handleUpdateAggregation(index, { function: value })}
                      >
                        <SelectTrigger className="bg-white border-slate-300 h-10 text-slate-900 w-full">
                          <SelectValue className="text-slate-900" />
                        </SelectTrigger>
                        <SelectContent>
                          {AGGREGATION_FUNCTIONS.map((fn) => (
                            <SelectItem key={fn} value={fn}>
                              {fn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Database Column"
                        value={row.column}
                        onChange={(e) => handleUpdateAggregation(index, { column: e.target.value })}
                        className="bg-white border-slate-300 text-slate-900"
                      />

                      <div className="flex gap-2">
                        <Input
                          placeholder="Alias"
                          value={row.alias}
                          onChange={(e) => handleUpdateAggregation(index, { alias: e.target.value })}
                          className="flex-1 bg-white border-slate-300 text-slate-900"
                        />
                        <Button
                          onClick={() => handleRemoveAggregation(index)}
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={handleAddAggregation}
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2 bg-white border-slate-300 text-slate-900 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Plus className="w-4 h-4" />
                    Add Aggregation
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Cumulative Tab */}
            <TabsContent value="cumulative" className="space-y-6 m-0 p-8 h-full">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Cumulative Window Functions</h2>
                <p className="text-slate-600 text-sm mb-6">Add window functions to your query (optional).</p>

                <div className="space-y-6">
                  {formData.cumulative.map((row, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-slate-900">Row {index + 1}</h3>
                        <Button
                          onClick={() => handleRemoveCumulative(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-900 mb-2 block">Window Function</label>
                          <Select
                            value={row.windowFunction}
                            onValueChange={(value) => handleUpdateCumulative(index, { windowFunction: value })}
                          >
                            <SelectTrigger className="bg-white border-slate-300 h-10 text-slate-900 w-full">
                              <SelectValue className="text-slate-900" />
                            </SelectTrigger>
                            <SelectContent>
                              {WINDOW_FUNCTIONS.map((fn) => (
                                <SelectItem key={fn} value={fn}>
                                  {fn}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-900 mb-2 block">Partition By (Alias)</label>
                          <Input
                            placeholder="Alias name"
                            value={row.partitionBy}
                            onChange={(e) => handleUpdateCumulative(index, { partitionBy: e.target.value })}
                            className="bg-white border-slate-300 text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-900 mb-2 block">Order By (Alias)</label>
                          <Input
                            placeholder="Alias name"
                            value={row.orderBy.alias}
                            onChange={(e) =>
                              handleUpdateCumulative(index, {
                                orderBy: { ...row.orderBy, alias: e.target.value },
                              })
                            }
                            className="bg-white border-slate-300 text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-900 mb-2 block">Direction</label>
                          <Select
                            value={row.orderBy.direction}
                            onValueChange={(value) =>
                              handleUpdateCumulative(index, {
                                orderBy: { ...row.orderBy, direction: value },
                              })
                            }
                          >
                            <SelectTrigger className="bg-white border-slate-300 h-10 text-slate-900 w-full">
                              <SelectValue className="text-slate-900" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ASC">ASC</SelectItem>
                              <SelectItem value="DESC">DESC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-900 mb-2 block">Database Column</label>
                          <Input
                            placeholder="Physical column name"
                            value={row.databaseColumn}
                            onChange={(e) => handleUpdateCumulative(index, { databaseColumn: e.target.value })}
                            className="bg-white border-slate-300 text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-900 mb-2 block">Alias</label>
                          <Input
                            placeholder="Alias"
                            value={row.alias}
                            onChange={(e) => handleUpdateCumulative(index, { alias: e.target.value })}
                            className="bg-white border-slate-300 text-slate-900"
                          />
                        </div>
                      </div>

                      {WINDOW_FUNCTIONS.includes(row.windowFunction) && (
                        <div>
                          <label className="text-sm font-medium text-slate-900 mb-2 block">Frame</label>
                          <Select
                            value={row.frame || "UNBOUNDED PRECEDING"}
                            onValueChange={(value) => handleUpdateCumulative(index, { frame: value })}
                          >
                            <SelectTrigger className="bg-white border-slate-300 h-10 text-slate-900 w-1/2">
                              <SelectValue className="text-slate-900" />
                            </SelectTrigger>
                            <SelectContent>
                              {FRAME_OPTIONS.map((frame) => (
                                <SelectItem key={frame} value={frame}>
                                  {frame}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  ))}

                  <Button
                    onClick={handleAddCumulative}
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2 bg-white border-slate-300 text-slate-900 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Plus className="w-4 h-4" />
                    Add Window Function
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Complex Data Tab - Disabled */}
            <TabsContent value="complex-data" className="space-y-6 m-0 p-8">
              <div className="text-center py-12">
                <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">This feature is coming soon</p>
              </div>
            </TabsContent>

            {/* Date/Time Tab - Disabled */}
            <TabsContent value="date-time" className="space-y-6 m-0 p-8">
              <div className="text-center py-12">
                <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">This feature is coming soon</p>
              </div>
            </TabsContent>

            {/* Custom SQL Tab */}
            <TabsContent value="custom-sql" className="space-y-6 m-0 p-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Custom SQL</h2>
                <p className="text-slate-600 text-sm mb-6">Write your custom SQL query directly.</p>

                <textarea
                  placeholder="SELECT * FROM table_name WHERE ..."
                  value={formData.customSql}
                  onChange={(e) => onFormUpdate({ customSql: e.target.value })}
                  className="w-full h-64 p-4 border border-slate-300 rounded-md bg-white text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
