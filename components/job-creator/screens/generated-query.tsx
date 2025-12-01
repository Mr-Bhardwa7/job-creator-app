"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Download, Home, X } from "lucide-react"
import { useState } from "react"
import html2canvas from 'html2canvas-pro';

interface GeneratedQueryProps {
  database: string
  sqlQuery: string
  onBackToHome: () => void
}

export function GeneratedQuery({ database, sqlQuery, onBackToHome }: GeneratedQueryProps) {
  const [copiedSection, setCopiedSection] = useState<string>("")
  const [updatedSqlQuery, setUpdatedSqlQuery] = useState<string>(sqlQuery)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showExecuteModal, setShowExecuteModal] = useState(false)
  const [snowflakeCredentials, setSnowflakeCredentials] = useState({
    accountName: "",
    databaseName: "",
    warehouseName: "",
    userName: "",
    userPassword: "",
  })
  const [bigqueryCredentials, setBigqueryCredentials] = useState({
    projectId: "",
    dataset: "",
    locationRegion: "",
    clientId: "",
    clientSecret: "",
  })

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(""), 2000)
  }

   const handleExport = async (format: string) => {
    const content = `Query Export\n\nDatabase: ${database.toUpperCase()}\n\nSQL Query:\n${updatedSqlQuery}`

    if (format === "sql") {
      const element = document.createElement("a")
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(updatedSqlQuery)
      )
      element.setAttribute("download", `query-${Date.now()}.sql`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
    
    else if (format === "text") {
      const element = document.createElement("a")
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
      element.setAttribute("download", `query-${Date.now()}.txt`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } 
    
    else if (format === "pdf") {
      try {
        // Import jsPDF and use html2canvas-pro directly
        const { jsPDF } = await import("jspdf");

        // Helper function to escape HTML
        const escapeHtml = (text: string): string => {
          return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        };

        // Create PDF content container
        const element = document.createElement("div");
        element.style.cssText = `
          background: #fff;
          color: #000;
          padding: 30px;
          font-family: Arial, sans-serif;
          width: 700px;
          line-height: 1.6;
          position: fixed;
          top: -10000px;
          left: -10000px;
        `;

        element.innerHTML = `
          <h1 style="font-size:28px;font-weight:bold;margin-bottom:20px;color:#1e293b;">Query Export</h1>
          <div style="margin-bottom:20px;">
            <p style="margin:0 0 5px 0;font-size:14px;"><strong>Database:</strong> ${database.toUpperCase()}</p>
            <p style="margin:0;font-size:14px;color:#64748b;">Generated: ${new Date().toLocaleString()}</p>
          </div>
          <h2 style="font-size:18px;margin-bottom:10px;color:#334155;">SQL Query:</h2>
          <pre style="
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            background: #f8fafc;
            padding: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            line-height: 1.5;
            overflow-wrap: break-word;
          ">${escapeHtml(updatedSqlQuery)}</pre>
        `;

        document.body.appendChild(element);

        // Use html2canvas-pro to render the element
        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false
        });

        // Convert canvas to image
        const imgData = canvas.toDataURL("image/png");
        
        // Create PDF with jsPDF
        const pdf = new jsPDF({
          unit: "mm",
          format: "a4",
          orientation: "portrait"
        });

        // Calculate dimensions
        const imgWidth = 210 - 30; // A4 width minus margins (15mm each side)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add image to PDF with margins
        pdf.addImage(imgData, "PNG", 15, 15, imgWidth, imgHeight);
        
        // Save PDF
        pdf.save(`query-${Date.now()}.pdf`);

        // Cleanup
        document.body.removeChild(element);
      } catch (error) {
        console.error("PDF export failed:", error);
        alert("Failed to export PDF. Please try again.");
      } finally {
        setShowExportModal(false);
      }
    }
    
    else if (format === "word") {
      const element = document.createElement("a")
      const doc = `
        <html>
          <head><meta charset="UTF-8"></head>
          <body>
            <h1>Query Export</h1>
            <p><strong>Database:</strong> ${database.toUpperCase()}</p>
            <h2>SQL Query:</h2>
            <pre>${updatedSqlQuery}</pre>
          </body>
        </html>
      `
      element.setAttribute("href", "data:application/msword;charset=utf-8," + encodeURIComponent(doc))
      element.setAttribute("download", `query-${Date.now()}.doc`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }

    // Only close modal for non-PDF exports
    if (format !== "pdf") {
      setShowExportModal(false);
    }
  }

  const handleExecute = () => {
    if (database === "snowflake") {
      if (!snowflakeCredentials.accountName || !snowflakeCredentials.userName || !snowflakeCredentials.userPassword) {
        alert("Please fill in all required Snowflake credentials")
        return
      }
      console.log("[v0] Executing Snowflake query with credentials:", snowflakeCredentials)
      alert("Query executed on Snowflake!")
    } else if (database === "bigquery") {
      if (!bigqueryCredentials.projectId || !bigqueryCredentials.clientId || !bigqueryCredentials.clientSecret) {
        alert("Please fill in all required BigQuery credentials")
        return
      }
      console.log("[v0] Executing BigQuery query with credentials:", bigqueryCredentials)
      alert("Query executed on BigQuery!")
    } else {
      alert("Query executed: " + sqlQuery)
    }
    setShowExecuteModal(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            Job Creator{" "}
            <span className="inline-block bg-red-500 text-white px-3 py-1 rounded text-sm ml-2 font-semibold">
              Beta
            </span>
          </h1>
          <div className="flex gap-3">
            <Button
              onClick={onBackToHome}
              variant="outline"
              className="border-slate-300 bg-white hover:bg-slate-100 text-slate-900 gap-2"
            >
              <Home className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={() => setShowExportModal(true)}
              variant="outline"
              className="border-slate-300 bg-white hover:bg-slate-100 text-slate-900 gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
              onClick={() => setShowExecuteModal(true)}
            >
              Execute
            </Button>
          </div>
        </div>
      </div>

      {/* Main content with split screen */}
      <div className="flex-1 overflow-hidden">
        <div className="px-8 py-8 space-y-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Generated Query</h2>
            <p className="text-slate-600 mt-2">
              Model generated for <span className="font-semibold text-green-600">{database.toUpperCase()}</span>.
            </p>
          </div>

          {/* Split container */}
          <div className={`flex gap-6 h-[calc(100vh-300px)]`}>
            {/* Right side - SQL Query */}
            <div className={`flex flex-col w-full`}>
              <Card className="flex-1 flex flex-col bg-white border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-semibold text-slate-900">SQL Code</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCopy(updatedSqlQuery, "sql")}
                      variant="outline"
                      size="sm"
                      className="gap-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-900"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedSection === "sql" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-white">
                  <textarea
                    value={updatedSqlQuery}
                    onChange={(e) => setUpdatedSqlQuery(e.target.value)}
                    className="w-full h-full bg-white text-slate-900 font-mono text-xs resize-none focus:outline-none border-0 p-0"
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white border-slate-200 p-6 w-96 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Export Options</h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-500 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-600 mb-6">Select the desired format for your query results:</p>
            <div className="flex gap-3">
              <Button
                onClick={() => handleExport("pdf")}
                variant="outline"
                className="flex-1 border-slate-300 hover:bg-slate-100"
              >
                PDF
              </Button>
              <Button
                onClick={() => handleExport("word")}
                variant="outline"
                className="flex-1 border-slate-300 hover:bg-slate-100"
              >
                Word
              </Button>
              <Button
                onClick={() => handleExport("text")}
                variant="outline"
                className="flex-1 border-slate-300 hover:bg-slate-100"
              >
                Text
              </Button>
              <Button
                onClick={() => handleExport("sql")}
                variant="outline"
                className="flex-1 border-slate-300 hover:bg-slate-100"
              >
                Sql
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showExecuteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white border-slate-200 p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Execute Query</h3>
              <button onClick={() => setShowExecuteModal(false)} className="text-slate-500 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {database === "snowflake" && (
              <div className="space-y-4">
                <p className="text-slate-900 font-semibold">Enter credentials for Snowflake:</p>
                <input
                  type="text"
                  placeholder="Account Name"
                  value={snowflakeCredentials.accountName}
                  onChange={(e) => setSnowflakeCredentials({ ...snowflakeCredentials, accountName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Database Name"
                  value={snowflakeCredentials.databaseName}
                  onChange={(e) => setSnowflakeCredentials({ ...snowflakeCredentials, databaseName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Warehouse Name"
                  value={snowflakeCredentials.warehouseName}
                  onChange={(e) => setSnowflakeCredentials({ ...snowflakeCredentials, warehouseName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="User Name"
                  value={snowflakeCredentials.userName}
                  onChange={(e) => setSnowflakeCredentials({ ...snowflakeCredentials, userName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  placeholder="User Password"
                  value={snowflakeCredentials.userPassword}
                  onChange={(e) => setSnowflakeCredentials({ ...snowflakeCredentials, userPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}

            {database === "bigquery" && (
              <div className="space-y-4">
                <p className="text-slate-900 font-semibold">Enter credentials for BigQuery:</p>
                <input
                  type="text"
                  placeholder="Project ID"
                  value={bigqueryCredentials.projectId}
                  onChange={(e) => setBigqueryCredentials({ ...bigqueryCredentials, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Dataset"
                  value={bigqueryCredentials.dataset}
                  onChange={(e) => setBigqueryCredentials({ ...bigqueryCredentials, dataset: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Location / Region"
                  value={bigqueryCredentials.locationRegion}
                  onChange={(e) => setBigqueryCredentials({ ...bigqueryCredentials, locationRegion: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Client ID"
                  value={bigqueryCredentials.clientId}
                  onChange={(e) => setBigqueryCredentials({ ...bigqueryCredentials, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="password"
                  placeholder="Client Secret"
                  value={bigqueryCredentials.clientSecret}
                  onChange={(e) => setBigqueryCredentials({ ...bigqueryCredentials, clientSecret: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}

            {!["snowflake", "bigquery"].includes(database) && (
              <p className="text-slate-600">Execute query on {database.toUpperCase()}?</p>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowExecuteModal(false)}
                variant="outline"
                className="flex-1 border-slate-300 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button onClick={handleExecute} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                Connect & Execute
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
