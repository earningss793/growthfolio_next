import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: false,
  },
};

// 타임아웃 설정
const TIMEOUT = 30000; // 30초로 다시 늘림

export async function POST(request) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return Response.json({ 
        error: "이력서 내용이 필요합니다" 
      }, { status: 400 });
    }

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), TIMEOUT);
    });

    const messagePromise = anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: `분석할 이력서 내용입니다. 다음 형식에 맞춰 JSON으로 변환해주세요.
    각 프로젝트별로 구체적인 업무 내용 5가지와 수치화된 성과 3가지를 포함해야 합니다:

     ${content}

    다음은 원하는 출력 형식의 예시입니다:
    {
        "work_experience": [
            {
                "start_date": "2023.10",
                "end_date": "2024.08",
                "company": "빅플래닛메이드엔터",
                "team": "비주얼컨텐츠팀",
                "responsibilities": [
                    {
                        "project": "프로젝트 1: 앨범 프로모션 컨텐츠",
                        "details": [
                            "아티스트 앨범 발매에 맞춘 컨텐츠 기획 및 제작.",
                            "앨범의 타이틀곡에 대한 홍보 영상 제작 및 배포.",
                            "소셜 미디어용 짧은 숏폼 컨텐츠 제작.",
                            "앨범 프로모션 관련 행사 자료 시각화 및 디자인.",
                            "팬들과 소통할 수 있는 디지털 이벤트 기획."
                        ],
                        "results": [
                            "앨범 프로모션 컨텐츠 조회수 100만 회 기록.",
                            "SNS 채널 평균 CTR 12.5% 달성.",
                            "담당 기간 전 대비 앨범 매출 25% 증가."
                        ]
                    }
                ]
            }
        ]
    }

    주의사항:
    1. 각 프로젝트의 업무 내용(details)은 반드시 5개의 구체적인 문장으로 작성해주세요.
    2. 각 프로젝트의 성과(results)는 반드시 3개의 수치화된 결과로 작성해주세요.
    3. 입력된 내용을 바탕으로 현실적인 수치와 성과를 추정하여 작성해주세요.
    4. 모든 프로젝트를 분리하여 각각 자세히 분석해주세요.`
      }]
    });

    const message = await Promise.race([
      messagePromise,
      timeoutPromise
    ]);

    const enhancedContent = message.content[0].text;
    
    try {
      // JSON 파싱 검증
      JSON.parse(enhancedContent);
    } catch (e) {
      return Response.json({ 
        error: "응답을 JSON으로 파싱할 수 없습니다" 
      }, { status: 500 });
    }

    return Response.json({ enhancedContent });
    
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      error: error.message || "서버 오류가 발생했습니다" 
    }, { status: 500 });
  }
} 