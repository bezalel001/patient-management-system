# MediFlow AI Features Guide

## Overview

MediFlow now includes AI-powered features to enhance clinical decision-making and improve workflow efficiency for healthcare providers. These features are available to assigned doctors and nurses for their patients.

## Features

### 1. AI Chat Assistant 💬

An intelligent chat interface that allows healthcare providers to ask questions about patient data and receive instant, context-aware answers.

#### Where to Access
- **Patient Detail Page**: Click the "Ask AI" button in the top-right corner
- **Visit Detail Page**: Click the "Ask AI" button when viewing a visit

#### What You Can Ask

The AI assistant can answer questions about:

- **Medical History**: "What is the patient's medical history?"
- **Allergies**: "Does the patient have any allergies?"
- **Current Medications**: "What medications is the patient taking?"
- **Vital Signs**: "Show me recent vital signs"
- **Lab Results**: "What are the latest lab results?"
- **Visit History**: "Show me recent visits"
- **Patient Demographics**: "Give me patient contact information"

#### Example Queries

```
"What allergies does this patient have?"
"Show me the latest vital signs"
"What medications is the patient currently taking?"
"Does the patient have a history of diabetes?"
"Show me pending lab orders"
"What was the chief complaint on the last visit?"
```

#### Features
- ✅ Real-time responses
- ✅ Context-aware answers based on patient data
- ✅ Chat history maintained during session
- ✅ Typing indicators
- ✅ Mobile-responsive interface
- ✅ Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### 2. AI Patient Summary ✨

Generate a comprehensive patient overview with one click, highlighting critical information and current status.

#### Where to Access
- **Patient Detail Page**: Click the "AI Summary" button in the top-right corner

#### What's Included

The AI summary provides:

1. **Alert Banner** - Critical alerts including:
   - Known allergies
   - Active admissions
   - Pending investigations

2. **Demographics** - Quick overview:
   - Age, gender, blood group
   - Contact information

3. **Current Status**:
   - Admission status (OPD/IPD)
   - Chief complaint
   - Admission date
   - Total visit count

4. **Latest Vital Signs**:
   - Temperature, BP, heart rate
   - SpO2, respiratory rate
   - Most recent recording date

5. **Medical History**:
   - Past medical conditions
   - Chronic diseases

6. **Current Medications**:
   - Active prescriptions
   - Dosage and frequency
   - Special instructions

7. **Recent Visit History**:
   - Last 5 visits
   - Visit type and status
   - Chief complaints

#### Features
- ✅ One-click generation
- ✅ Print-friendly format
- ✅ Timestamp for audit trail
- ✅ Color-coded alerts
- ✅ Organized sections

---

## Implementation Details

### Current Implementation (Demo)

The current implementation uses **mock AI responses** that intelligently parse patient data to provide relevant answers. This demonstrates the functionality without requiring external API keys.

### Production Integration

To integrate with real AI services (OpenAI, Anthropic, Google Gemini), follow the guidelines below:

#### 1. Backend API Setup

Create an API endpoint to handle AI requests:

```python
# Django REST Framework example
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import openai

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_chat(request):
    patient_id = request.data.get('patient_id')
    message = request.data.get('message')
    
    # Verify user has access to this patient
    if not has_patient_access(request.user, patient_id):
        return Response({'error': 'Unauthorized'}, status=403)
    
    # Fetch patient data
    patient = Patient.objects.get(id=patient_id)
    visits = Visit.objects.filter(patient=patient).order_by('-admission_datetime')[:5]
    
    # Build context
    context = build_patient_context(patient, visits)
    
    # Call OpenAI API
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo-preview",
        messages=[
            {
                "role": "system",
                "content": f"You are a medical AI assistant. Use this patient data: {context}"
            },
            {"role": "user", "content": message}
        ],
        temperature=0.3,  # Lower for more factual responses
    )
    
    return Response({
        'message': response.choices[0].message.content,
        'timestamp': datetime.now().isoformat()
    })
```

#### 2. Frontend Integration

Update the `PatientAIChat.tsx` component to call your backend:

```typescript
// Replace the mock response with real API call
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  },
  body: JSON.stringify({
    patient_id: patient.id,
    message: inputValue,
    conversation_history: messages,
  }),
});

const data = await response.json();
```

#### 3. Environment Variables

Add these to your `.env` file:

```bash
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# Or Anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Or Google Gemini
GOOGLE_API_KEY=...
GEMINI_MODEL=gemini-pro
```

#### 4. Security & Compliance

**HIPAA/GDPR Compliance Checklist:**

- [ ] **Business Associate Agreement (BAA)**: Sign BAA with AI provider
  - OpenAI offers BAA for enterprise customers
  - Anthropic offers BAA
  - Google Cloud offers BAA for Healthcare API

- [ ] **Data Encryption**:
  - All API calls must use HTTPS/TLS
  - Encrypt patient data at rest
  - Use encrypted environment variables for API keys

- [ ] **Access Control**:
  - Verify user is assigned to the patient
  - Log all AI interactions with user ID, patient ID, timestamp
  - Implement role-based access (only doctors/nurses)

- [ ] **Audit Trail**:
  ```python
  AIInteractionLog.objects.create(
      user=request.user,
      patient=patient,
      query=message,
      response=ai_response,
      timestamp=datetime.now()
  )
  ```

- [ ] **Data Minimization**:
  - Only send necessary patient data to AI
  - Avoid sending raw PHI when possible
  - Use pseudonymization where appropriate

- [ ] **Data Retention**:
  - Define retention policy for AI chat logs
  - Implement automatic deletion after X days/months
  - Allow patients to request deletion (GDPR)

- [ ] **Consent**:
  - Inform patients that AI is used for clinical decision support
  - Obtain consent where required
  - Allow opt-out option

#### 5. Recommended AI Providers

| Provider | Model | HIPAA Compliant | Cost (Est.) | Best For |
|----------|-------|-----------------|-------------|----------|
| **OpenAI** | GPT-4 Turbo | ✅ (with BAA) | $0.01/1K tokens | General medical Q&A |
| **Anthropic** | Claude 3 Opus | ✅ (with BAA) | $0.015/1K tokens | Long context, detailed analysis |
| **Google** | Gemini Pro | ✅ (Healthcare API) | $0.0005/1K chars | Cost-effective |
| **Azure OpenAI** | GPT-4 | ✅ (Healthcare) | $0.01/1K tokens | Enterprise, compliance |

#### 6. Example Prompts

**For Chat Assistant:**
```
System: You are a medical AI assistant helping Dr. {doctor_name} with patient {patient_mrn}.
Be concise, accurate, and cite sources from the patient record.
NEVER make treatment recommendations - only provide information.
If unsure, say so.

Patient Data:
- Name: {patient_name}
- Age: {age}, Gender: {gender}
- Allergies: {allergies}
- Medical History: {history}
- Current Medications: {medications}
- Recent Vitals: {vitals}
- Lab Results: {labs}

User Query: {user_message}
```

**For Summary Generation:**
```
System: Generate a concise clinical summary for healthcare providers.
Format: Use clear sections with bullet points.
Focus on: Current status, active problems, medications, recent vitals, pending investigations.
Highlight: Any critical alerts or abnormal findings.

Patient Data: {full_patient_record}

Generate a summary in the following format:
1. ALERTS (if any)
2. CURRENT STATUS
3. ACTIVE MEDICATIONS
4. RECENT VITALS
5. PENDING INVESTIGATIONS
6. RECENT VISIT HISTORY
```

#### 7. Rate Limiting & Cost Control

Implement rate limiting to prevent abuse:

```python
from django.core.cache import cache

def check_rate_limit(user_id):
    key = f"ai_chat_{user_id}"
    requests = cache.get(key, 0)
    
    if requests >= 50:  # 50 requests per hour
        raise Exception("Rate limit exceeded")
    
    cache.set(key, requests + 1, timeout=3600)
```

#### 8. Testing

Before production deployment:

1. **Unit Tests**: Test API endpoints with mock data
2. **Integration Tests**: Test end-to-end flow
3. **Load Testing**: Ensure system handles concurrent requests
4. **Accuracy Testing**: Validate AI responses against known data
5. **Security Testing**: Penetration testing, access control verification

---

## User Roles & Permissions

### Who Can Use AI Features?

- ✅ **Doctors** - Full access to all patients they're assigned to
- ✅ **Nurses** - Full access to all patients they're assigned to
- ❌ **Lab Technicians** - No access
- ❌ **Pharmacists** - No access
- ❌ **Receptionists** - No access
- ⚠️ **Admins** - Configurable (recommended: read-only access)

### Access Control Logic

```typescript
// Check if user has access to patient
const canAccessPatient = (user: User, patient: Patient, visits: Visit[]) => {
  // Admin can access all (optional)
  if (user.role === 'ADMIN') return true;
  
  // Check if user is assigned to any active visit
  const activeVisits = visits.filter(v => v.status === 'ACTIVE');
  const isAssigned = activeVisits.some(visit => 
    visit.assigned_doctors?.includes(user.id) ||
    visit.assigned_nurses?.includes(user.id)
  );
  
  return isAssigned;
};
```

---

## Cost Estimation

### Expected Costs (Monthly)

For a hospital with **500 patients** and **50 doctors/nurses**:

**Assumptions:**
- 10 AI chat queries per patient per month
- 1 summary generation per patient per month
- Average 500 tokens per chat response
- Average 1000 tokens per summary

**OpenAI GPT-4 Turbo:**
```
Chat: 500 patients × 10 queries × 500 tokens = 2,500,000 tokens
Summary: 500 patients × 1 summary × 1000 tokens = 500,000 tokens
Total: 3,000,000 tokens/month

Input cost: $0.01 per 1K tokens = $30/month
Output cost: $0.03 per 1K tokens = $90/month
Total: ~$120/month
```

**Cost Optimization Tips:**
1. Use **GPT-3.5-Turbo** for simple queries ($0.0015/1K tokens) = ~$5/month
2. Implement **caching** for common queries
3. Use **Claude Haiku** for basic summaries ($0.00025/1K tokens)
4. Implement **query deduplication**

---

## Troubleshooting

### Common Issues

**1. "AI chat not responding"**
- Check API key configuration
- Verify network connectivity
- Check rate limits
- Review backend logs

**2. "Unauthorized access"**
- Verify user is assigned to the patient
- Check authentication token
- Review permissions

**3. "Slow responses"**
- Optimize context size (send only relevant data)
- Use faster models (GPT-3.5 vs GPT-4)
- Implement response streaming
- Add loading states

**4. "Inaccurate responses"**
- Review prompt engineering
- Adjust temperature (lower = more factual)
- Provide more context
- Use GPT-4 instead of GPT-3.5

---

## Future Enhancements

Planned features for future releases:

1. **Voice Input**: Speak your queries instead of typing
2. **Multi-language Support**: AI responses in local languages
3. **Predictive Analytics**: Risk scores and early warnings
4. **Differential Diagnosis**: AI-suggested diagnoses based on symptoms
5. **Drug Interaction Checking**: AI-powered medication safety
6. **Clinical Decision Support**: Treatment recommendations (with disclaimers)
7. **Response Streaming**: Real-time token-by-token responses
8. **Context Expansion**: Include radiology images, ECG data
9. **Conversation Export**: Download chat history as PDF
10. **Smart Notifications**: AI-detected critical changes

---

## Support & Feedback

For questions or issues with AI features:

- **Email**: support@mediflow.com
- **Documentation**: https://docs.mediflow.com/ai-features
- **Issue Tracker**: https://github.com/mediflow/issues

---

## License & Disclaimer

⚠️ **Important Medical Disclaimer**:

The AI features in MediFlow are designed to **assist** healthcare providers, not replace clinical judgment. All AI-generated information should be reviewed and validated by qualified medical professionals before making clinical decisions.

- AI responses are for **informational purposes only**
- Not a substitute for professional medical advice
- Healthcare providers remain responsible for all clinical decisions
- AI may occasionally provide incorrect or incomplete information
- Always verify critical information against source data

---

## Changelog

### Version 1.0.0 (December 2025)
- ✅ Initial release of AI Chat Assistant
- ✅ Initial release of AI Patient Summary
- ✅ Mock AI implementation for demo
- ✅ Basic security and access controls
- ✅ Mobile-responsive design

### Upcoming (Version 1.1.0)
- 🔄 Production AI integration (OpenAI/Anthropic)
- 🔄 Voice input support
- 🔄 Multi-language support
- 🔄 Enhanced audit logging
- 🔄 Response streaming

---

**Built with ❤️ for healthcare providers by the MediFlow team**
