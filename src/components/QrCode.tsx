import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

interface QRCodeModalProps {
  buttonText?: string;
  buttonClassName?: string;
  title?: string;
  description?: string;
  showIcon?: boolean;
  id?: string;
  children?: React.ReactNode;
}

export default function QRCodeModal({
  buttonText = "Download the app",
  buttonClassName = "bg-white text-black hover:bg-gray-100",
  title = "GET THE FUTEURCRED APP",
  description = "Scan the QR code to download the app",
  showIcon = true,
  id = "qr-code-modal-trigger",
  children,
}: QRCodeModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          id={id}
          size="lg"
          className={buttonClassName}
          type="button"
        >
          {showIcon && <Download className="mr-2 h-5 w-5" />}
          {children}
          {buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-black tracking-tighter">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <img 
            src="/qr-code.png" 
            alt="QR code for FuteurCred app download" 
            width={240} 
            height={240} 
            className="rounded-lg shadow-md" 
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/240x240/2563eb/FFFFFF?text=QR+Code';
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
