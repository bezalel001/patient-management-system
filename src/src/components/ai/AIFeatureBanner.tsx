import { Sparkles, MessageSquare, X } from 'lucide-react';
import { useState } from 'react';

export function AIFeatureBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10">
        <Sparkles size={200} />
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X size={18} />
      </button>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-white mb-1">AI-Powered Patient Insights</h3>
            <p className="text-white/90 text-sm">
              New intelligent features to enhance patient care
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                <MessageSquare size={16} />
              </div>
              <div>
                <h4 className="text-white mb-1">AI Chat Assistant</h4>
                <p className="text-white/80 text-sm">
                  Ask questions about patient history, medications, lab results, and more. 
                  Get instant, context-aware answers from the patient's medical record.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles size={16} />
              </div>
              <div>
                <h4 className="text-white mb-1">Smart Summaries</h4>
                <p className="text-white/80 text-sm">
                  Generate comprehensive patient overviews instantly. 
                  Get quick insights on current status, medications, vitals, and pending investigations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <p>Available on Patient Detail and Visit Detail pages</p>
        </div>
      </div>
    </div>
  );
}
