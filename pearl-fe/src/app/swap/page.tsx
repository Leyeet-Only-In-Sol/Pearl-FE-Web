import React from 'react';
import { Card } from '@/components/ui/Card';

export default function SwapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-md mx-auto">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Swap Feature
          </h1>
          <p className="text-gray-600">
            Swap functionality will be implemented here. This would include token selection, 
            amount inputs, price impact calculations, and swap execution.
          </p>
        </Card>
      </div>
    </div>
  );
}