import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { Patient, Visit } from '../../types';
import { Card, CardHeader, CardBody } from '../common/Card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PatientAIChatProps {
  patient: Patient;
  visits: Visit[];
  currentUserId: string;
  currentUserRole: 'DOCTOR' | 'NURSE';
  onClose: () => void;
}

export function PatientAIChat({ patient, visits, currentUserId, currentUserRole, onClose }: PatientAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI medical assistant. I can help you with information about ${patient.first_name} ${patient.last_name} (MRN: ${patient.mrn}). You can ask me about their medical history, current medications, recent vitals, lab results, or any other aspect of their care.`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI response generator based on patient data
  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Medical history queries
    if (lowerMessage.includes('history') || lowerMessage.includes('past') || lowerMessage.includes('background')) {
      return `Based on the medical records:

**Medical History:**
${patient.medical_history || 'No significant medical history recorded.'}

${patient.allergies ? `**⚠️ Allergies:** ${patient.allergies}` : ''}

**Current Medications:**
${patient.current_medications || 'No current medications recorded.'}

The patient has had ${visits.length} visit(s) in total.`;
    }

    // Allergy queries
    if (lowerMessage.includes('allerg')) {
      if (patient.allergies) {
        return `⚠️ **IMPORTANT ALLERGIES:**

${patient.allergies}

Please ensure all prescriptions and treatments avoid these allergens.`;
      }
      return `No allergies are currently recorded for ${patient.first_name} ${patient.last_name}.`;
    }

    // Medication queries
    if (lowerMessage.includes('medic') || lowerMessage.includes('drug') || lowerMessage.includes('prescription')) {
      return `**Current Medications:**

${patient.current_medications || 'No current medications recorded.'}

${patient.allergies ? `\n⚠️ **Known Allergies:** ${patient.allergies}\n\nPlease check for interactions before prescribing new medications.` : ''}`;
    }

    // Visit/admission queries
    if (lowerMessage.includes('visit') || lowerMessage.includes('admission') || lowerMessage.includes('recent')) {
      const activeVisits = visits.filter(v => v.status === 'ACTIVE');
      const recentVisits = visits.slice(0, 3);

      if (activeVisits.length > 0) {
        return `**Active Visits:**

${activeVisits.map(v => `- ${v.visit_type} Visit (${v.visit_number})
  Chief Complaint: ${v.chief_complaint}
  Admitted: ${new Date(v.admission_datetime).toLocaleDateString()}
  Status: ${v.status}`).join('\n\n')}`;
      }

      if (recentVisits.length > 0) {
        return `**Recent Visits:**

${recentVisits.map(v => `- ${v.visit_type} Visit (${v.visit_number})
  Date: ${new Date(v.admission_datetime).toLocaleDateString()}
  Chief Complaint: ${v.chief_complaint}
  Status: ${v.status}`).join('\n\n')}`;
      }

      return `No visits recorded for ${patient.first_name} ${patient.last_name}.`;
    }

    // Vital signs queries
    if (lowerMessage.includes('vital') || lowerMessage.includes('bp') || lowerMessage.includes('temperature')) {
      const latestVisit = visits.find(v => v.vital_signs && v.vital_signs.length > 0);
      if (latestVisit && latestVisit.vital_signs) {
        const latestVitals = latestVisit.vital_signs[latestVisit.vital_signs.length - 1];
        return `**Latest Vital Signs:**
Recorded: ${new Date(latestVitals.recorded_at).toLocaleString()}

${latestVitals.temperature_celsius ? `🌡️ Temperature: ${latestVitals.temperature_celsius}°C` : ''}
${latestVitals.systolic_bp && latestVitals.diastolic_bp ? `💓 Blood Pressure: ${latestVitals.systolic_bp}/${latestVitals.diastolic_bp} mmHg` : ''}
${latestVitals.heart_rate ? `❤️ Heart Rate: ${latestVitals.heart_rate} bpm` : ''}
${latestVitals.respiratory_rate ? `🫁 Respiratory Rate: ${latestVitals.respiratory_rate} breaths/min` : ''}
${latestVitals.oxygen_saturation ? `🩺 SpO2: ${latestVitals.oxygen_saturation}%` : ''}
${latestVitals.weight_kg ? `⚖️ Weight: ${latestVitals.weight_kg} kg` : ''}

${latestVitals.notes ? `Notes: ${latestVitals.notes}` : ''}`;
      }
      return 'No vital signs recorded yet.';
    }

    // Lab results queries
    if (lowerMessage.includes('lab') || lowerMessage.includes('test') || lowerMessage.includes('result')) {
      const visitsWithLabs = visits.filter(v => v.lab_orders && v.lab_orders.length > 0);
      if (visitsWithLabs.length > 0) {
        const latestVisit = visitsWithLabs[0];
        const labs = latestVisit.lab_orders || [];
        return `**Lab Orders:**

${labs.map(lab => `- ${lab.test_name} (${lab.order_number})
  Category: ${lab.test_category}
  Status: ${lab.status}
  Priority: ${lab.priority}
  ${lab.results && lab.results.length > 0 ? `Results: ${lab.results.length} parameter(s)` : ''}`).join('\n\n')}`;
      }
      return 'No lab orders found.';
    }

    // Demographics queries
    if (lowerMessage.includes('age') || lowerMessage.includes('contact') || lowerMessage.includes('info')) {
      return `**Patient Information:**

Name: ${patient.first_name} ${patient.last_name}
MRN: ${patient.mrn}
Age: ${patient.age} years
Gender: ${patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}
${patient.blood_group ? `Blood Group: ${patient.blood_group}` : ''}

**Contact:**
Phone: ${patient.phone}
${patient.email ? `Email: ${patient.email}` : ''}
Address: ${patient.address}

${patient.insurance_provider ? `**Insurance:**\nProvider: ${patient.insurance_provider}\nPolicy: ${patient.insurance_number}` : ''}`;
    }

    // Default response with suggestions
    return `I can help you with information about ${patient.first_name} ${patient.last_name}. Here are some things you can ask me:

- "What is the patient's medical history?"
- "Show me recent vital signs"
- "Does the patient have any allergies?"
- "What medications is the patient taking?"
- "Show me recent visits"
- "What are the latest lab results?"
- "Give me patient demographics"

What would you like to know?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);

      /* 
      ============================================
      PRODUCTION INTEGRATION WITH REAL AI API
      ============================================
      
      To integrate with a real AI service like OpenAI, Anthropic, or Google Gemini:
      
      1. Replace the setTimeout above with an actual API call:
      
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            patient_id: patient.id,
            message: inputValue,
            conversation_history: messages,
          }),
        });
        
        const data = await response.json();
        
        const aiResponse: Message = {
          id: data.id,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(data.timestamp),
        };
        
        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('AI chat error:', error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
      
      2. Backend API endpoint (/api/ai/chat) should:
         - Authenticate the user and verify they're assigned to the patient
         - Fetch relevant patient data based on the query
         - Build a context-aware prompt with patient data
         - Call OpenAI/Anthropic API with the prompt
         - Return the AI response
         
      3. Example OpenAI integration (backend):
      
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are a medical AI assistant helping healthcare providers with patient ${patient.mrn}. 
                      Use the following patient data to answer questions:
                      ${JSON.stringify(patientData)}`
          },
          ...conversationHistory,
          { role: "user", content: userMessage }
        ],
      });
      
      4. HIPAA/GDPR Compliance:
         - Ensure PHI/PII is encrypted in transit and at rest
         - Log all AI interactions for audit trails
         - Use Business Associate Agreements (BAA) with AI providers
         - Implement data retention policies
         - Ensure AI provider is HIPAA compliant (OpenAI offers BAA)
      */
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">AI Medical Assistant</h3>
              <p className="text-sm text-gray-600">
                {patient.first_name} {patient.last_name} • {patient.mrn}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'assistant' 
                  ? 'bg-gradient-to-br from-purple-500 to-blue-600' 
                  : 'bg-blue-600'
              }`}>
                {message.role === 'assistant' ? (
                  <Bot size={16} className="text-white" />
                ) : (
                  <User size={16} className="text-white" />
                )}
              </div>
              <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === 'assistant'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-blue-600 text-white'
                }`}>
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.role === 'assistant' ? 'text-gray-500' : 'text-blue-100'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-gray-600" />
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about patient history, vitals, medications, labs..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
