"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-[#512f3e] data-[state=unchecked]:bg-[#e0dede] inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#512f3e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:pr-[4px] data-[state=unchecked]:pl-[4px]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white pointer-events-none block size-[14px] rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[20px] data-[state=unchecked]:translate-x-[4px] shadow-sm"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
