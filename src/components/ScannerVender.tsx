import React, { useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../firebase';

interface ScannerVenderProps {
  onCodeScanned: (code: string) => void;
}

const ScannerVender: React.FC<ScannerVenderProps> = ({ onCodeScanned }) => {
  const db = getDatabase(app);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await BarcodeScanner.requestPermissions();
      } catch (error) {
        console.error('Permission request failed', error);
      }
    };

    requestPermissions();
  }, []);

  const handleScanButtonClick = async () => {
    try {
      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode, BarcodeFormat.Code128, BarcodeFormat.Ean13],
      });
      if (barcodes.length > 0) {
        const scannedValue = barcodes[0].rawValue || 'No data found';
        onCodeScanned(scannedValue);
      }
    } catch (error) {
      console.error('Error scanning barcode', error);
    }
  };

  return (
    <Button
      className="ion-margin-top bg-blue-500 hover:bg-red-700 text-white px-8 py-4 text-lg"
      style={{ width: '80%', marginBottom: '10px' }}
      onClick={handleScanButtonClick}
    >
      Escanear
    </Button>
  );
};

export default ScannerVender;
