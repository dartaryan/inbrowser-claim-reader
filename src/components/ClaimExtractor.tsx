
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import OCRProcessor from './OCRProcessor';
import ClaimForm from './ClaimForm';
import { Card } from '@/components/ui/card';

export interface ClaimData {
  providerName: string;
  country: string;
  city: string;
  serviceDate: string;
  currency: string;
  amount: string;
  description: string;
  numberOfTreatments: string;
  invoiceNumber: string;
}

const ClaimExtractor = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [claimData, setClaimData] = useState<ClaimData>({
    providerName: '',
    country: '',
    city: '',
    serviceDate: '',
    currency: '',
    amount: '',
    description: '',
    numberOfTreatments: '',
    invoiceNumber: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setExtractedText('');
    setClaimData({
      providerName: '',
      country: '',
      city: '',
      serviceDate: '',
      currency: '',
      amount: '',
      description: '',
      numberOfTreatments: '',
      invoiceNumber: ''
    });
  };

  const handleOCRComplete = (text: string, parsedData: ClaimData) => {
    setExtractedText(text);
    setClaimData(parsedData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="p-6">
        <FileUpload onFileUpload={handleFileUpload} />
      </Card>

      {uploadedFile && (
        <Card className="p-6">
          <OCRProcessor
            file={uploadedFile}
            onOCRComplete={handleOCRComplete}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </Card>
      )}

      {(extractedText || Object.values(claimData).some(value => value)) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Raw OCR Text</h3>
            <textarea
              className="w-full h-64 p-3 border rounded-md bg-gray-50 text-sm font-mono"
              value={extractedText}
              readOnly
              placeholder="Extracted text will appear here..."
            />
          </Card>

          <Card className="p-6">
            <ClaimForm claimData={claimData} setClaimData={setClaimData} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClaimExtractor;
