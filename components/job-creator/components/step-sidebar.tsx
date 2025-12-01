"use client"

import { CheckCircle2, Lock, Circle } from "lucide-react"

export interface StepItem {
  id: string
  label: string
  number: number
  completed: boolean
  disabled: boolean
}

interface StepSidebarProps {
  steps: StepItem[]
  activeStep: string
  onStepClick: (stepId: string) => void
}

export function StepSidebar({ steps, activeStep, onStepClick }: StepSidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-full p-6 overflow-y-auto">
      <div className="space-y-1">
        {steps.map((step, index) => (
          <div key={step.id}>
            <button
              onClick={() => !step.disabled && onStepClick(step.id)}
              disabled={step.disabled}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-left ${
                activeStep === step.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
              } ${step.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {/* Step indicator circle */}
              <div className="relative flex-shrink-0">
                {step.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : step.disabled ? (
                  <div className="relative">
                    <Circle className="w-6 h-6 text-muted-foreground" />
                    <Lock className="w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                    {step.number}
                  </div>
                )}
              </div>

              {/* Step label */}
              <span className="text-sm font-medium flex-1">{step.label}</span>
            </button>

            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className="h-2 ml-8 bg-gradient-to-b from-sidebar-border to-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
