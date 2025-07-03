// MSW handlers for API mocking (optional)
// This provides an alternative to the built-in mock API service

import { http, HttpResponse } from 'msw';

export const handlers = [
  // Session initialization
  http.post('/api/session-init', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
      success: true,
      message: 'Session initialized successfully'
    });
  }),

  // Character generation
  http.post('/api/chat', async ({ request }) => {
    const body = await request.json();
    const { action } = body as any;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (action === 'generate_character') {
      return HttpResponse.json({
        success: true,
        data: {
          parent: {
            name: 'Maya',
            age: 28,
            occupation: 'freelance graphic designer',
            location: 'modest apartment in a quiet neighborhood',
            financeLevel: 5,
            partner: 'Alex',
            background: 'You are a 28-year-old mother named Maya, working as a freelance graphic designer...'
          },
          child: {
            name: 'Luna',
            gender: 'girl',
            age: 'just born',
            personality: 'Luna is a bright and curious baby with a natural love for exploration.',
            traits: 'She babbles constantly, as if asking questions, and is fascinated by colors, shapes, and sounds.',
            health: 'excellent',
            potential: 'You sense she will grow into a thoughtful, inquisitive child who thrives on learning.'
          }
        }
      });
    }

    if (action === 'next_scenario') {
      return HttpResponse.json({
        success: true,
        data: {
          scenario: {
            age: 2,
            stage: 'Toddler',
            situation: 'Luna has been babbling nonstop and pointing at everything...',
            options: [
              { id: 'A', text: "Enroll her in the class—it's a worthy investment..." },
              { id: 'B', text: 'Try free alternatives: library storytimes...' },
              { id: 'C', text: 'Ask Alex to cut his trip short...' },
              { id: 'D', text: 'Delay the decision—focus on your work deadline...' }
            ],
            customOptionEnabled: true,
            financialStatus: 'Middle'
          }
        }
      });
    }

    if (action === 'make_decision') {
      return HttpResponse.json({
        success: true,
        data: {
          consequence: 'You enroll Luna in the language development class...',
          effects: {
            childDevelopment: { language: 2, creativity: 1 },
            familyDynamics: { stress: 1, bonding: 1 },
            finances: { level: 4 }
          }
        }
      });
    }

    return HttpResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  }),

  // Event logging
  http.post('/api/log-event', async () => {
    return HttpResponse.json({ success: true });
  }),
];