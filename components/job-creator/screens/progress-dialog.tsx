"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ProgressDialogProps {
  isOpen: boolean
  progress: number
  message: string
}

export function ProgressDialog({ isOpen, progress, message }: ProgressDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-white border border-slate-200">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <DialogTitle className="text-xl font-bold text-slate-900 mb-2">
              Generating Query
            </DialogTitle>
            <p className="text-slate-600 text-sm">{message}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-right text-sm font-medium text-slate-700">{Math.min(Math.round(progress), 100)}%</p>
          </div>

          {/* Spinner */}
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
