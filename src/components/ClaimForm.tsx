
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClaimData } from './ClaimExtractor';

interface ClaimFormProps {
  claimData: ClaimData;
  setClaimData: (data: ClaimData) => void;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ claimData, setClaimData }) => {
  const handleInputChange = (field: keyof ClaimData, value: string) => {
    setClaimData({
      ...claimData,
      [field]: value
    });
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(claimData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'claim-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const saveToLocalStorage = () => {
    const savedClaims = JSON.parse(localStorage.getItem('claimData') || '[]');
    const newClaim = {
      ...claimData,
      id: Date.now(),
      extractedAt: new Date().toISOString()
    };
    savedClaims.push(newClaim);
    localStorage.setItem('claimData', JSON.stringify(savedClaims));
    alert('Claim data saved to local storage!');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Extracted Claim Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="providerName">Provider Name</Label>
          <Input
            id="providerName"
            value={claimData.providerName}
            onChange={(e) => handleInputChange('providerName', e.target.value)}
            placeholder="Enter provider name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            value={claimData.invoiceNumber}
            onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
            placeholder="Enter invoice number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={claimData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            placeholder="Enter country"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={claimData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Enter city"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="serviceDate">Service Date</Label>
          <Input
            id="serviceDate"
            type="date"
            value={claimData.serviceDate}
            onChange={(e) => handleInputChange('serviceDate', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numberOfTreatments">Number of Treatments</Label>
          <Input
            id="numberOfTreatments"
            type="number"
            value={claimData.numberOfTreatments}
            onChange={(e) => handleInputChange('numberOfTreatments', e.target.value)}
            placeholder="Enter number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={claimData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            placeholder="USD, EUR, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            value={claimData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="Enter amount"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={claimData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter service description"
          rows={3}
        />
      </div>
      
      <div className="flex space-x-3">
        <Button onClick={saveToLocalStorage} variant="outline">
          Save to Local Storage
        </Button>
        <Button onClick={exportAsJSON}>
          Export as JSON
        </Button>
      </div>
    </div>
  );
};

export default ClaimForm;
