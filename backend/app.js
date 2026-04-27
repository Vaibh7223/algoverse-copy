import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const CHAT_FALLBACK =
  "I could not fetch live context right now, but I can still help. Please ask your question with a bit more detail, and I will provide a clear step-by-step explanation.";
const resolveBaseUrl = () => {
  const configured = process.env.OPENAI_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');

  const key = process.env.OPENAI_API_KEY || '';
  if (key.startsWith('sk-or-')) {
    return 'https://openrouter.ai/api/v1';
  }

  return 'https://api.openai.com/v1';
};

const OPENAI_BASE_URL = resolveBaseUrl();
const OPENAI_MODEL = process.env.OPENAI_MODEL || (OPENAI_BASE_URL.includes('openrouter.ai') ? 'openai/gpt-4o-mini' : 'gpt-4o-mini');

const normalizeText = (value = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

async function fetchDuckDuckGoAnswer(question) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(question)}&format=json&no_redirect=1&no_html=1`;
  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  const directAnswer = normalizeText(data?.AbstractText || data?.Answer || '');
  const heading = normalizeText(data?.Heading || '');

  if (directAnswer) {
    return heading ? `${heading}: ${directAnswer}` : directAnswer;
  }

  const firstRelated = data?.RelatedTopics?.find(topic => typeof topic?.Text === 'string')?.Text;
  return firstRelated ? normalizeText(firstRelated) : null;
}

async function fetchWikipediaSummary(question) {
  const titleGuess = question
    .replace(/[^\w\s-]/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join(' ');

  if (!titleGuess) return null;

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titleGuess)}`;
  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  return normalizeText(data?.extract || '');
}

async function fetchOpenAIAnswer(question) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const isOpenRouter = OPENAI_BASE_URL.includes('openrouter.ai');

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(isOpenRouter
        ? {
            'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:5173',
            'X-Title': process.env.OPENROUTER_APP_NAME || 'AlgoVerse',
          }
        : {}),
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant. Answer any user question clearly and accurately. If unsure, state uncertainty briefly and offer the best possible guidance.',
        },
        { role: 'user', content: question },
      ],
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content;
  return typeof answer === 'string' ? normalizeText(answer) : null;
}

async function checkOpenAIHealth() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      configured: false,
      model: OPENAI_MODEL,
      baseUrl: OPENAI_BASE_URL,
      message: 'OPENAI_API_KEY is missing',
    };
  }

  try {
    const isOpenRouter = OPENAI_BASE_URL.includes('openrouter.ai');
    const response = await fetch(`${OPENAI_BASE_URL}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...(isOpenRouter
          ? {
              'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:5173',
              'X-Title': process.env.OPENROUTER_APP_NAME || 'AlgoVerse',
            }
          : {}),
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        configured: true,
        model: OPENAI_MODEL,
        baseUrl: OPENAI_BASE_URL,
        message: `Provider responded with status ${response.status}`,
      };
    }

    return {
      ok: true,
      configured: true,
      model: OPENAI_MODEL,
      baseUrl: OPENAI_BASE_URL,
      message: 'LLM provider reachable',
    };
  } catch {
    return {
      ok: false,
      configured: true,
      model: OPENAI_MODEL,
      baseUrl: OPENAI_BASE_URL,
      message: 'Failed to reach LLM provider',
    };
  }
}

// --- Mock Database Arrays ---
const users = [];

// --- Routes ---

// 1. Auth Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Mock Authentication Logic
  if (email && password) {
    res.json({ token: 'mock_jwt_token_123', user: { email, role: 'user' } });
  } else {
    res.status(401).json({ message: 'Invalid Credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  users.push({ email, password });
  res.json({ message: 'User registered successfully!' });
});

// 2. AI Explanation Endpoint (Mocking Claude API)
app.post('/api/ai/explain', (req, res) => {
  const { algorithm } = req.body;
  res.json({
    explanation: `This is an AI-generated explanation for ${algorithm}. It utilizes a standard strategy to optimize performance constraints.`,
    complexity: {
      time: 'O(N log N)',
      space: 'O(1)',
    },
    analogy: 'Think of it like sorting a massive deck of cards by continually splitting it in half.',
  });
});

// 2b. General Chat Endpoint (live web-backed + fallback)
app.post('/api/ai/chat', async (req, res) => {
  const rawQuestion = req.body?.question;
  const question = typeof rawQuestion === 'string' ? rawQuestion.trim() : '';

  if (!question) {
    return res.status(400).json({ answer: 'Please ask a question so I can help.' });
  }

  try {
    const llmAnswer = await fetchOpenAIAnswer(question);
    if (llmAnswer) {
      return res.json({
        answer: llmAnswer,
        source: 'llm',
      });
    }

    const [duckAnswer, wikiAnswer] = await Promise.all([
      fetchDuckDuckGoAnswer(question),
      fetchWikipediaSummary(question),
    ]);

    const combined = [duckAnswer, wikiAnswer].filter(Boolean);

    if (combined.length > 0) {
      return res.json({
        answer: combined.join('\n\n'),
        source: 'live',
      });
    }

    return res.json({
      answer: `I did not find a confident live answer for "${question}" yet. ${CHAT_FALLBACK}`,
      source: 'fallback',
    });
  } catch (error) {
    return res.json({
      answer: CHAT_FALLBACK,
      source: 'fallback',
    });
  }
});

app.get('/api/ai/health', async (_req, res) => {
  const llm = await checkOpenAIHealth();
  res.status(llm.ok ? 200 : 503).json({
    service: 'algoverse-ai-chat',
    llm,
    fallbackSources: ['duckduckgo', 'wikipedia'],
  });
});

// 3. Admin Usage Endpoint
app.get('/api/admin/usage', (req, res) => {
  res.json({
    totalUsers: users.length || 154,
    totalExecutions: 8529,
    activeAlgorithms: 24,
  });
});

export default app;
