import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const authResult = verifyToken(request);
  if (authResult.error) {
    return NextResponse.json({ message: authResult.error }, { status: authResult.status });
  }

  const articleId = (await params).id;
  const { articleBody } = await request.json();

  if (!articleBody) {
    return NextResponse.json({ message: 'Article body is required for summarization.' }, { status: 400 });
  }

  let finalSummary: string; 

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant specialized in summarizing text concisely."
        },
        {
          role: "user",
          content: `Please summarize the following article concisely:\n\n${articleBody}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const openAISummary = chatCompletion.choices[0].message.content;

    if (openAISummary) {
      finalSummary = openAISummary;
      console.log('OpenAI summary generated successfully.');
    } else {
      console.warn('OpenAI API returned an empty summary. Falling back to mock.');
      throw new Error('OpenAI returned empty content');
    }

  } catch (error: any) {
    console.error('OpenAI summarization failed, falling back to mock:', error);

    if (error.response?.status === 401) {
      console.error('Specific OpenAI Error: API key might be invalid or missing.');
    } else if (error.response?.status === 429) {
      console.error('Specific OpenAI Error: Quota exceeded or rate limited.');
    }

    finalSummary = `[MOCK SUMMARY] This is a mock summary for article "${articleId}". It highlights key points from the provided content, demonstrating how an AI would condense information. For instance, if the article discussed software development, this summary would mention frameworks, methodologies, and best practices in a concise manner. (Actual content: "${articleBody.substring(0, Math.min(articleBody.length, 100))}...")`;
  }

  return NextResponse.json({ summary: finalSummary }, { status: 200 });
}