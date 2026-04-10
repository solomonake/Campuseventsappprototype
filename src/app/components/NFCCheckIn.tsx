import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Nfc, CheckCircle2, XCircle, QrCode, Hash, Loader2, Camera } from "lucide-react";
import { Event } from "../types/models";

interface NFCCheckInProps {
  event: Event;
  onCheckIn: (eventId: string) => void;
  isCheckedIn: boolean;
}

// Simple QR Code component using canvas
function SimpleQRCode({ value, size = 200 }: { value: string; size?: number }) {
  return (
    <div 
      className="border-4 border-black p-4 bg-white inline-block"
      style={{ width: size, height: size }}
    >
      <div className="grid grid-cols-8 gap-0 h-full">
        {Array.from({ length: 64 }).map((_, i) => {
          // Create a pseudo-random pattern based on the value
          const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const isBlack = (hash * (i + 1)) % 3 !== 0;
          return (
            <div 
              key={i} 
              className={isBlack ? 'bg-black' : 'bg-white'}
            />
          );
        })}
      </div>
      <div className="text-center mt-2 text-xs font-mono break-all">
        {value.slice(-8)}
      </div>
    </div>
  );
}

export function NFCCheckIn({ event, onCheckIn, isCheckedIn }: NFCCheckInProps) {
  const [nfcStatus, setNfcStatus] = useState<'idle' | 'scanning' | 'success' | 'error' | 'not-supported'>('idle');
  const [statusMessage, setStatusMessage] = useState("");
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [pinError, setPinError] = useState("");
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [isQrScanning, setIsQrScanning] = useState(false);

  // Generate a unique PIN code for this event (in production, this would come from the backend)
  const eventPinCode = `${event.id.slice(-6).toUpperCase()}`;

  const handleNFCCheckIn = async () => {
    // Check if Web NFC API is supported
    if (!('NDEFReader' in window)) {
      setNfcStatus('not-supported');
      setStatusMessage("NFC is not supported on this device. Use manual check-in instead.");
      return;
    }

    try {
      setNfcStatus('scanning');
      setStatusMessage("Hold your NFC card or device near the reader...");

      // Simulate NFC scanning (in production, this would use the Web NFC API)
      // @ts-ignore - NDEFReader may not be in TypeScript definitions
      const ndef = new NDEFReader();
      
      await ndef.scan();
      
      // Simulate successful scan after a delay
      setTimeout(() => {
        setNfcStatus('success');
        setStatusMessage("Successfully checked in via NFC!");
        onCheckIn(event.id);
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setNfcStatus('idle');
          setStatusMessage("");
        }, 3000);
      }, 2000);

    } catch (error: any) {
      console.error("NFC Error:", error);
      setNfcStatus('error');
      
      if (error.name === 'NotAllowedError') {
        setStatusMessage("NFC permission denied. Please enable NFC and try again.");
      } else if (error.name === 'NotSupportedError') {
        setStatusMessage("NFC is not supported on this device.");
      } else {
        setStatusMessage("Failed to scan NFC. Please try again or use manual check-in.");
      }
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setNfcStatus('idle');
        setStatusMessage("");
      }, 3000);
    }
  };

  const handlePinCheckIn = () => {
    setPinError("");
    
    if (pinCode.trim() === "") {
      setPinError("Please enter the PIN code.");
      return;
    }

    if (pinCode.toUpperCase() !== eventPinCode) {
      setPinError("Invalid PIN code. Please try again.");
      return;
    }

    // Successful check-in
    onCheckIn(event.id);
    setStatusMessage("Successfully checked in with PIN code!");
    setIsManualDialogOpen(false);
    setPinCode("");
    
    setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  };

  const handleQRScan = () => {
    setIsQrScanning(true);
    
    // Simulate QR code scanning (in production, this would use camera API)
    setTimeout(() => {
      setIsQrScanning(false);
      setQrScannerOpen(false);
      onCheckIn(event.id);
      setStatusMessage("Successfully checked in via QR code!");
      
      setTimeout(() => {
        setStatusMessage("");
      }, 3000);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Nfc className="w-5 h-5 text-blue-600" />
            <CardTitle>Event Check-In</CardTitle>
          </div>
          {isCheckedIn && (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Checked In
            </Badge>
          )}
        </div>
        <CardDescription>
          Check in to earn cultural credits for attending this event
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCheckedIn ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              <Button 
                onClick={handleNFCCheckIn} 
                disabled={nfcStatus === 'scanning'}
                className="w-full"
              >
                {nfcStatus === 'scanning' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Nfc className="w-4 h-4 mr-2" />
                    NFC
                  </>
                )}
              </Button>
              
              <Dialog open={qrScannerOpen} onOpenChange={setQrScannerOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>QR Code Check-In</DialogTitle>
                    <DialogDescription>
                      Scan the QR code displayed at the event venue
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="scan" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
                      <TabsTrigger value="show">Show My QR</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="scan" className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        {!isQrScanning ? (
                          <>
                            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-sm text-gray-600 mb-4">
                              Position the QR code within the frame
                            </p>
                            <Button onClick={handleQRScan} className="w-full">
                              <Camera className="w-4 h-4 mr-2" />
                              Start Camera
                            </Button>
                          </>
                        ) : (
                          <>
                            <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
                            <p className="text-sm text-gray-600">
                              Scanning QR code...
                            </p>
                          </>
                        )}
                      </div>
                      <Alert>
                        <AlertDescription className="text-xs">
                          <strong>Note:</strong> The QR code must match the event venue's check-in code. 
                          Staff will display the QR code at the registration desk.
                        </AlertDescription>
                      </Alert>
                    </TabsContent>
                    
                    <TabsContent value="show" className="space-y-4">
                      <div className="flex justify-center p-6 bg-white rounded-lg border">
                        <SimpleQRCode 
                          value={`CECS-EVENT-${event.id}`} 
                          size={200}
                        />
                      </div>
                      <Alert>
                        <AlertDescription className="text-xs text-center">
                          Show this QR code to event staff for check-in
                        </AlertDescription>
                      </Alert>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isManualDialogOpen} onOpenChange={setIsManualDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Hash className="w-4 h-4 mr-2" />
                    PIN
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>PIN Code Check-In</DialogTitle>
                    <DialogDescription>
                      Enter the PIN code displayed at the event venue
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pin">Event PIN Code</Label>
                      <Input
                        id="pin"
                        placeholder="Enter PIN code"
                        value={pinCode}
                        onChange={(e) => {
                          setPinCode(e.target.value.toUpperCase());
                          setPinError("");
                        }}
                        maxLength={6}
                        className="text-center text-lg tracking-widest font-mono"
                      />
                      {pinError && (
                        <p className="text-sm text-red-600">{pinError}</p>
                      )}
                    </div>
                    
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription className="text-xs">
                        <strong>Where to find the PIN:</strong> Event staff will announce or display 
                        the 6-character PIN code at the venue. This ensures you are physically present.
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-gray-50 rounded-lg border text-center">
                      <p className="text-xs text-gray-600 mb-2">Demo PIN for this event:</p>
                      <p className="text-2xl font-mono font-bold text-gray-900 tracking-widest">
                        {eventPinCode}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        (In production, staff would display this at the venue)
                      </p>
                    </div>
                    
                    <Button onClick={handlePinCheckIn} className="w-full">
                      Verify & Check In
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {statusMessage && (
              <Alert 
                variant={nfcStatus === 'success' ? 'default' : nfcStatus === 'error' || nfcStatus === 'not-supported' ? 'destructive' : 'default'}
                className={nfcStatus === 'success' ? 'bg-green-50 border-green-200' : ''}
              >
                {nfcStatus === 'success' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                {(nfcStatus === 'error' || nfcStatus === 'not-supported') && <XCircle className="h-4 w-4" />}
                {nfcStatus === 'scanning' && <Loader2 className="h-4 w-4 animate-spin" />}
                <AlertDescription className={nfcStatus === 'success' ? 'text-green-800' : ''}>
                  {statusMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-700">
                <strong>Check-In Methods:</strong><br />
                • <strong>NFC:</strong> Tap your student ID card or NFC-enabled device<br />
                • <strong>QR Code:</strong> Scan venue QR code or show your code to staff<br />
                • <strong>PIN:</strong> Enter the 6-digit code displayed at the venue
              </p>
            </div>
          </>
        ) : (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              You're all set! Your attendance has been recorded and cultural credits will be awarded.
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Cultural Credits:</span>
            <span className="font-semibold text-blue-600">{event.culturalCredit || 1} credits</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}