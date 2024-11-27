"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, BookOpen, Shield } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-gray-400">
            Complete guide to using the Game Items API
          </p>
        </div>

        <Tabs defaultValue="endpoints" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="endpoints">
              <Code2 className="w-4 h-4 mr-2" />
              Endpoints
            </TabsTrigger>
            <TabsTrigger value="authentication">
              <Shield className="w-4 h-4 mr-2" />
              Authentication
            </TabsTrigger>
            <TabsTrigger value="examples">
              <BookOpen className="w-4 h-4 mr-2" />
              Examples
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints">
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h2 className="text-2xl font-semibold mb-6">Available Endpoints</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Items</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-green-400 mb-2">GET /api/items</h4>
                      <p className="text-gray-400">List all items with pagination and filtering</p>
                      <pre className="bg-gray-900 p-3 rounded-lg mt-2 text-sm">
                        Query Parameters:
                        - page (optional): Page number
                        - limit (optional): Items per page
                        - type (optional): Filter by item type
                        - rarity (optional): Filter by rarity
                      </pre>
                    </div>

                    <div>
                      <h4 className="text-blue-400 mb-2">POST /api/items</h4>
                      <p className="text-gray-400">Create a new item</p>
                      <pre className="bg-gray-900 p-3 rounded-lg mt-2 text-sm">
                        {`Body: {
  "name": "string",
  "type": "string",
  "rarity": "string",
  "stats": { [key: string]: number | string }
}`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="text-yellow-400 mb-2">GET /api/items/:id</h4>
                      <p className="text-gray-400">Get a specific item by ID</p>
                    </div>

                    <div>
                      <h4 className="text-purple-400 mb-2">PUT /api/items/:id</h4>
                      <p className="text-gray-400">Update an existing item</p>
                      <pre className="bg-gray-900 p-3 rounded-lg mt-2 text-sm">
                        {`Body: {
  "name": "string",
  "type": "string",
  "rarity": "string",
  "stats": { [key: string]: number | string }
}`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="text-red-400 mb-2">DELETE /api/items/:id</h4>
                      <p className="text-gray-400">Delete an item</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="authentication">
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h2 className="text-2xl font-semibold mb-6">Authentication</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">API Key Authentication</h3>
                  <p className="text-gray-400 mb-4">
                    All API requests require an API key to be included in the headers.
                  </p>
                  <pre className="bg-gray-900 p-3 rounded-lg text-sm">
                    {`headers: {
  'x-api-key': 'your-api-key'
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Rate Limiting</h3>
                  <p className="text-gray-400">
                    Requests are limited to 60 per minute per API key.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="examples">
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h2 className="text-2xl font-semibold mb-6">Example Usage</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Fetch Items</h3>
                  <pre className="bg-gray-900 p-3 rounded-lg text-sm">
                    {`const response = await fetch('/api/items?page=1&limit=10', {
  headers: {
    'x-api-key': 'your-api-key'
  }
});

const data = await response.json();`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Create Item</h3>
                  <pre className="bg-gray-900 p-3 rounded-lg text-sm">
                    {`const response = await fetch('/api/items', {
  method: 'POST',
  headers: {
    'x-api-key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Legendary Sword',
    type: 'weapon',
    rarity: 'legendary',
    stats: {
      damage: 100,
      durability: 1000
    }
  })
});

const data = await response.json();`}
                  </pre>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}