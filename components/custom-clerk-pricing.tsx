'use client'
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CustomClerkPricing() {
    const { theme } = useTheme()
    
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Starter Plan */}
            <Card className="relative">
                <CardHeader>
                    <CardTitle className="text-xl">Starter</CardTitle>
                    <CardDescription>Perfect for small businesses</CardDescription>
                    <div className="text-3xl font-bold">$29<span className="text-sm font-normal">/month</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                        <li>✓ Up to 100 shipments/month</li>
                        <li>✓ Basic tracking</li>
                        <li>✓ Email support</li>
                    </ul>
                    <Button className="w-full">Get Started</Button>
                </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-primary">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                </div>
                <CardHeader>
                    <CardTitle className="text-xl">Pro</CardTitle>
                    <CardDescription>For growing operations</CardDescription>
                    <div className="text-3xl font-bold">$99<span className="text-sm font-normal">/month</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                        <li>✓ Up to 1000 shipments/month</li>
                        <li>✓ Advanced tracking</li>
                        <li>✓ Priority support</li>
                        <li>✓ API access</li>
                    </ul>
                    <Button className="w-full">Get Started</Button>
                </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative">
                <CardHeader>
                    <CardTitle className="text-xl">Enterprise</CardTitle>
                    <CardDescription>Custom solutions</CardDescription>
                    <div className="text-3xl font-bold">Custom</div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                        <li>✓ Unlimited shipments</li>
                        <li>✓ Custom integrations</li>
                        <li>✓ Dedicated support</li>
                        <li>✓ SLA guarantees</li>
                    </ul>
                    <Button variant="outline" className="w-full">Contact Sales</Button>
                </CardContent>
            </Card>
        </div>
    )
}