'use client';

import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { trackWhatsAppClick } from '@/lib/analytics';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true);
  const phoneNumber = '919646727676';
  const message = 'Hi, I want to know more about ETI Educom courses.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    trackWhatsAppClick({ location: 'whatsapp_floating_button' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {/* Tooltip */}
      {showTooltip && (
        <div className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-[200px] animate-fade-in">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Need help?</span> Chat with us on WhatsApp!
          </p>
        </div>
      )}
      
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
        data-testid="whatsapp-button"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        
        {/* Ping Animation */}
        <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-30"></span>
      </a>
    </div>
  );
}
