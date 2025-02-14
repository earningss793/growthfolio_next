'use client';

import { useState } from 'react';

export default function ResumePage() {
  const [originalContent, setOriginalContent] = useState('');
  const [enhancedContent, setEnhancedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: originalContent }),
      });

      if (!response.ok) {
        throw new Error('API 요청에 실패했습니다');
      }

      const data = await response.json();
      setEnhancedContent(data.enhancedContent);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">이력서 개선 도우미</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold">
            원본 이력서 내용
          </label>
          <textarea
            value={originalContent}
            onChange={(e) => setOriginalContent(e.target.value)}
            className="w-full h-64 p-2 border rounded"
            placeholder="이력서 내용을 입력하거나 붙여넣으세요..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? '개선 중...' : '이력서 개선하기'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {enhancedContent && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">개선된 이력서</h2>
          <div className="p-4 bg-gray-50 rounded whitespace-pre-wrap">
            {enhancedContent}
          </div>
        </div>
      )}
    </div>
  );
} 