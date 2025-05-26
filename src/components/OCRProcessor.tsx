
import React, { useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ClaimData } from './ClaimExtractor';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface OCRProcessorProps {
  file: File;
  onOCRComplete: (text: string, parsedData: ClaimData) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const OCRProcessor: React.FC<OCRProcessorProps> = ({
  file,
  onOCRComplete,
  isProcessing,
  setIsProcessing
}) => {
  const [progress, setProgress] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState('');

  const parseClaimData = (text: string): ClaimData => {
    const lines = text.toLowerCase().split('\n');
    const allText = text.toLowerCase();
    
    const extractField = (patterns: string[], text: string): string => {
      for (const pattern of patterns) {
        const regex = new RegExp(pattern, 'i');
        const match = text.match(regex);
        if (match) {
          return match[1]?.trim() || match[0]?.trim() || '';
        }
      }
      return '';
    };

    // Define patterns for different fields
    const patterns = {
      providerName: [
        'provider[:\s]+([^\n]+)',
        'clinic[:\s]+([^\n]+)',
        'hospital[:\s]+([^\n]+)',
        'doctor[:\s]+([^\n]+)'
      ],
      country: [
        'country[:\s]+([^\n]+)',
        'state[:\s]+([^\n]+)'
      ],
      city: [
        'city[:\s]+([^\n]+)',
        'location[:\s]+([^\n]+)'
      ],
      serviceDate: [
        'date[:\s]+([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})',
        'service date[:\s]+([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})',
        '([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})'
      ],
      currency: [
        'currency[:\s]+([a-z]{3})',
        '([a-z]{3})\s*[0-9]+',
        '\$|usd|eur|gbp'
      ],
      amount: [
        'amount[:\s]+([0-9.,]+)',
        'total[:\s]+([0-9.,]+)',
        '\$\s*([0-9.,]+)',
        '([0-9]+\.[0-9]{2})'
      ],
      description: [
        'description[:\s]+([^\n]+)',
        'service[:\s]+([^\n]+)',
        'treatment[:\s]+([^\n]+)'
      ],
      numberOfTreatments: [
        'treatments?[:\s]+([0-9]+)',
        'sessions?[:\s]+([0-9]+)',
        'visits?[:\s]+([0-9]+)'
      ],
      invoiceNumber: [
        'invoice[:\s#]+([a-z0-9]+)',
        'receipt[:\s#]+([a-z0-9]+)',
        '#([a-z0-9]+)'
      ]
    };

    return {
      providerName: extractField(patterns.providerName, allText),
      country: extractField(patterns.country, allText),
      city: extractField(patterns.city, allText),
      serviceDate: extractField(patterns.serviceDate, allText),
      currency: extractField(patterns.currency, allText),
      amount: extractField(patterns.amount, allText),
      description: extractField(patterns.description, allText),
      numberOfTreatments: extractField(patterns.numberOfTreatments, allText),
      invoiceNumber: extractField(patterns.invoiceNumber, allText)
    };
  };

  const convertPdfToImage = async (file: File): Promise<string> => {
    setCurrentStep('Converting PDF to image...');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const page = await pdf.getPage(1);
    
    const scale = 2;
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    return canvas.toDataURL();
  };

  const processOCR = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      let imageData: string;
      
      if (file.type === 'application/pdf') {
        imageData = await convertPdfToImage(file);
        setProgress(25);
      } else {
        setCurrentStep('Preparing image...');
        imageData = URL.createObjectURL(file);
        setProgress(10);
      }
      
      setCurrentStep('Initializing OCR engine...');
      const worker = await createWorker();
      setProgress(40);
      
      setCurrentStep('Processing text recognition...');
      const { data: { text } } = await worker.recognize(imageData);
      setProgress(80);
      
      setCurrentStep('Parsing claim data...');
      const parsedData = parseClaimData(text);
      setProgress(100);
      
      await worker.terminate();
      
      onOCRComplete(text, parsedData);
      setCurrentStep('Complete!');
      
      if (file.type !== 'application/pdf') {
        URL.revokeObjectURL(imageData);
      }
    } catch (error) {
      console.error('OCR processing failed:', error);
      alert('Failed to process the document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">OCR Processing</h3>
        {!isProcessing && (
          <Button onClick={processOCR}>
            Extract Text
          </Button>
        )}
      </div>
      
      {isProcessing && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{currentStep}</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default OCRProcessor;
