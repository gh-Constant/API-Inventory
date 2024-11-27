"use client";

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";

interface Item {
  id: string;
  name: string;
  type: string;
  rarity: string;
  stats: Record<string, any>;
  createdAt: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items', {
          headers: {
            'x-api-key': localStorage.getItem('apiKey') || '',
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch items');
        }
        setItems(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div className="text-center p-8">Loading items...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Package className="w-8 h-8 mr-3 text-blue-500" />
          <h1 className="text-3xl font-bold">Game Items</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="p-6 bg-gray-800 border-gray-700">
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <div className="space-y-2 text-gray-400">
                <p>ID: {item.id}</p>
                <p>Type: {item.type}</p>
                <p>Rarity: <span className={`text-${item.rarity === 'legendary' ? 'yellow' : item.rarity === 'rare' ? 'blue' : 'gray'}-400`}>{item.rarity}</span></p>
                <div>
                  <p className="mb-1">Stats:</p>
                  <pre className="bg-gray-900 p-2 rounded text-sm">
                    {JSON.stringify(item.stats, null, 2)}
                  </pre>
                </div>
                <p className="text-sm">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 