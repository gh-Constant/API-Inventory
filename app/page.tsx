"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KeyRound, BookOpen, Code } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.apiKey) {
        setApiKey(data.apiKey);
        localStorage.setItem('apiKey', data.apiKey);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Game Items API</h1>
            <p className="text-xl text-gray-400">
              Access your game items data through our secure API
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-6 bg-gray-800 border-gray-700">
              <div className="flex items-center mb-4">
                <KeyRound className="w-6 h-6 mr-2 text-blue-500" />
                <h2 className="text-xl font-semibold">Authentication</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Secure access to your game items data with API key authentication
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
                <Button type="submit" className="w-full">
                  Get API Key
                </Button>
              </form>
              {apiKey && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-300">Your API Key:</p>
                  <code className="block mt-2 text-green-400">{apiKey}</code>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-gray-800 border-gray-700">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 mr-2 text-purple-500" />
                <h2 className="text-xl font-semibold">Documentation</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Available Endpoints</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>GET /api/items - List all items</li>
                    <li>GET /api/items/:id - Get item by ID</li>
                    <li>GET /api/items?type=:type - Filter by type</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Example Request</h3>
                  <pre className="bg-gray-700 p-3 rounded-lg text-sm overflow-x-auto">
                    {`fetch('/api/items', {
  headers: {
    'x-api-key': 'your-api-key'
  }
})`}
                  </pre>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Code className="w-6 h-6 mr-2 text-yellow-500" />
              <h2 className="text-xl font-semibold">Try it out</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Ready to integrate? Get your API key and start making requests!
            </p>
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}