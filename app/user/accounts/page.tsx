'use client'

import { useState } from 'react'
import { useUser } from "@clerk/nextjs"

export default function UserAccountsPage() {
  const { user } = useUser()
  const [isCreatingKey, setIsCreatingKey] = useState(false)
  const [keys, setKeys] = useState([
    { id: 1, name: 'Production API', created: '2025-01-15', lastUsed: '2025-01-15' },
    { id: 2, name: 'Development', created: '2024-12-28', lastUsed: '2025-01-10' }
  ])

  const handleCreateKey = () => {
    setIsCreatingKey(true)
    // Simulate API call
    setTimeout(() => {
      const newKey = { 
        id: Date.now(), 
        name: 'New API Key', 
        created: new Date().toLocaleDateString(), 
        lastUsed: 'Never' 
      }
      setKeys([...keys, newKey])
      setIsCreatingKey(false)
    }, 1000)
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Account & Team</h1>
        <p className="text-muted-foreground">Manage company profile, team members, and API keys.</p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <h2 className="text-lg font-semibold mb-4">Company Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input 
              defaultValue={user?.organizationMemberships?.[0]?.organization?.name || "Your Company"} 
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Primary Contact</label>
            <input 
              defaultValue={user?.fullName || "Your Name"} 
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Update Company
        </button>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">API Keys</h2>
          <button 
            onClick={handleCreateKey}
            disabled={isCreatingKey}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isCreatingKey ? 'Creating...' : 'Create Key'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Used</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} className="hover:bg-muted/30">
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{key.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{key.created}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{key.lastUsed}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <h2 className="text-lg font-semibold mb-4">Team Members</h2>
        <p className="text-muted-foreground text-sm">Invite team members and manage permissions</p>
        <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
          Invite Member
        </button>
      </div>
    </div>
  )
}