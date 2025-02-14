import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { content } = await request.json();

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `다음 이력서 내용을 더 전문적이고 설득력 있게 개선해주세요. 
                 성과와 책임을 구체적인 수치와 함께 강조하고, 
                 전문 용어를 적절히 사용해 주세요:
                 
                 ${content}`
      }]
    });

    return Response.json({ 
      enhancedContent: message.content[0].text 
    });
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 