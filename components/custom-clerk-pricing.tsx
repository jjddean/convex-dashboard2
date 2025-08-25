'use client'
// import { PricingTable } from "@clerk/nextjs"; // PricingTable not available in @clerk/nextjs
import { dark } from '@clerk/themes'
import { useTheme } from "next-themes"

export default function CustomClerkPricing() {
    const { theme } = useTheme()
    return (
        <>
            {/* PricingTable component not available in @clerk/nextjs */}
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Pricing Plans</h2>
                <p className="text-muted-foreground">Pricing information will be displayed here</p>
            </div>
        </>
    )
}