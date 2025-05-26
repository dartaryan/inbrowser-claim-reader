
import React from 'react';
import ClaimExtractor from '../components/ClaimExtractor';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Claim Document Processor
          </h1>
          <p className="text-lg text-gray-600">
            Extract claim details from PDFs and images using OCR
          </p>
        </div>
        <ClaimExtractor />
      </div>
    </div>
  );
};

export default Index;
