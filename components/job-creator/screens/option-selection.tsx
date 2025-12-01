"use client"
import { Card } from "@/components/ui/card"

interface OptionSelectionProps {
  onSelectOption: (option: string) => void
}

export function OptionSelection({ onSelectOption }: OptionSelectionProps) {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">What's next?</h1>
        <p className="text-gray-600">Select a scanning method to create a DQ job</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Horizontal Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Create Model */}
          <div className="relative">
            {/* Top Connection Line */}
            <div className="absolute -top-8 left-0 right-0 h-1 bg-linear-to-r from-green-500 to-green-500"></div>
            {/* Step Circle */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
              1
            </div>

            <Card className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
              {/* Graphic: Grid Pattern */}
              <div className="flex justify-center mb-6 h-24">
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded ${
                        i % 2 === 0 ? "bg-green-600" : i % 3 === 0 ? "bg-green-500" : "bg-teal-600"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Model</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create a new model from scratch and configure it according to your requirements.
                </p>
              </div>

              <button
                onClick={() => onSelectOption("new")}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded transition-colors"
              >
                Select
              </button>
            </Card>
          </div>

          {/* Card 2: Use Existing Model (Beta 2) - DISABLED */}
          <div className="relative opacity-50 pointer-events-none">
            {/* Top Connection Line */}
            <div className="absolute -top-8 left-0 right-0 h-1 bg-linear-to-r from-gray-300 to-gray-300"></div>
            {/* Step Circle - Disabled */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
              2
            </div>

            <Card className="p-6 bg-gray-50 border border-gray-300 h-full flex flex-col cursor-not-allowed">
              {/* Graphic: Network Dots */}
              <div className="flex justify-center mb-6 h-24 relative w-full">
                <svg width="80" height="80" viewBox="0 0 80 80" className="text-gray-400">
                  <circle cx="40" cy="15" r="6" fill="currentColor" />
                  <circle cx="20" cy="30" r="6" fill="currentColor" />
                  <circle cx="60" cy="30" r="6" fill="currentColor" />
                  <circle cx="10" cy="50" r="6" fill="currentColor" />
                  <circle cx="40" cy="50" r="8" fill="currentColor" opacity="0.8" />
                  <circle cx="70" cy="50" r="6" fill="currentColor" />
                  <circle cx="30" cy="70" r="6" fill="currentColor" />
                  <circle cx="50" cy="70" r="6" fill="currentColor" />
                  {/* Connection lines */}
                  <line x1="40" y1="15" x2="20" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  <line x1="40" y1="15" x2="60" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  <line x1="40" y1="50" x2="20" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  <line x1="40" y1="50" x2="60" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-500 mb-2">Use Existing Model (Beta 2)</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Use a previously created model. This feature is coming soon.
                </p>
              </div>

              <button
                disabled
                className="w-full py-2 px-4 bg-gray-300 text-gray-500 font-medium rounded cursor-not-allowed"
              >
                Coming Soon
              </button>
            </Card>
          </div>

          {/* Card 3: User Guideline */}
          <div className="relative">
            {/* Top Connection Line */}
            <div className="absolute -top-8 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-blue-500"></div>
            {/* Step Circle */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
              3
            </div>

            <Card className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
              {/* Graphic: Code Brackets */}
              <div className="flex justify-center mb-6 h-24">
                <div className="text-4xl text-blue-500 font-light">{"</>"}</div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User Guideline</h3>
                <p className="text-sm text-gray-600 mb-4">
                  View helpful guidelines and documentation on how to use the job creator effectively.
                </p>
              </div>

              <button
                onClick={() => onSelectOption("guidance")}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded transition-colors"
              >
                Select
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
