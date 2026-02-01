import React, { useState, FormEvent } from 'react';
import type { SearchOptions } from '../types';
import { LANGUAGE_OPTIONS, AUDIENCE_OPTIONS, TOPIC_SUGGESTIONS } from '../constants';
import { LanguageIcon, UsersIcon, LinkIcon, HashtagIcon, SearchIcon, SparklesIcon, LightbulbIcon } from './Icons';

interface KeywordInputFormProps {
  onGenerate: (options: SearchOptions) => void;
  isLoading: boolean;
}

const KeywordInputForm: React.FC<KeywordInputFormProps> = ({ onGenerate, isLoading }) => {
  const [language, setLanguage] = useState<string>('Vietnamese');
  const [topic, setTopic] = useState<string>('');
  const [mainKeyword, setMainKeyword] = useState<string>('');
  const [audience, setAudience] = useState<'viet' | 'foreign'>('viet');
  const [competitorUrl, setCompetitorUrl] = useState<string>('');
  const [keywordCount, setKeywordCount] = useState<number>(10);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert('Please enter a topic.');
      return;
    }
    onGenerate({
      language,
      topic,
      mainKeyword,
      audience,
      competitorUrl,
      keywordCount,
    });
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setTopic(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          {/* Topic */}
          <div>
            <label htmlFor="topic" className="flex items-center text-sm font-medium text-cyan-300 mb-2">
              <HashtagIcon className="h-5 w-5 mr-2" />
              Chủ Đề (Bắt buộc)
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="vd: Sinh tồn hoang dã, Mukbang AI"
              required
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
            <button
                type="button"
                onClick={() => setShowSuggestions(true)}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition-all duration-300"
            >
                <LightbulbIcon className="h-5 w-5" />
                Danh sách gợi ý
            </button>
          </div>

          {/* Main Keyword */}
          <div>
            <label htmlFor="mainKeyword" className="flex items-center text-sm font-medium text-cyan-300 mb-2">
              <HashtagIcon className="h-5 w-5 mr-2" />
              Từ Khóa Chính (Tùy chọn)
            </label>
            <input
              id="mainKeyword"
              type="text"
              value={mainKeyword}
              onChange={(e) => setMainKeyword(e.target.value)}
              placeholder="vd: xây nhà trú ẩn, ăn đồ siêu cay"
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
          </div>
          
          {/* Competitor URL */}
          <div>
            <label htmlFor="competitorUrl" className="flex items-center text-sm font-medium text-cyan-300 mb-2">
              <LinkIcon className="h-5 w-5 mr-2" />
              Link Video Đối Thủ (Tùy chọn)
            </label>
            <input
              id="competitorUrl"
              type="url"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Language */}
          <div>
            <label htmlFor="language" className="flex items-center text-sm font-medium text-cyan-300 mb-2">
              <LanguageIcon className="h-5 w-5 mr-2" />
              Ngôn Ngữ
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-gray-800">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Audience */}
          <div>
            <label htmlFor="audience" className="flex items-center text-sm font-medium text-cyan-300 mb-2">
              <UsersIcon className="h-5 w-5 mr-2" />
              Đối Tượng Mục Tiêu
            </label>
            <select
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value as 'viet' | 'foreign')}
              className="w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            >
              {AUDIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-gray-800">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword Count */}
          <div>
              <label htmlFor="keywordCount" className="flex items-center text-sm font-medium text-cyan-300 mb-2">
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Số lượng từ khóa
              </label>
              <input
                  id="keywordCount"
                  type="number"
                  min="1"
                  max="50"
                  value={keywordCount}
                  onChange={(e) => setKeywordCount(Number(e.target.value))}
                  placeholder="vd: 10"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-md shadow-sm px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-cyan-500/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
          >
            {isLoading ? (
              <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang phân tích...
              </>
            ) : (
              <>
                <SparklesIcon className="h-6 w-6" />
                Tìm Kiếm Từ Khóa
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Suggestions Modal */}
      {showSuggestions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            <header className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-cyan-400">Danh Sách Chủ Đề Gợi Ý</h2>
              <button onClick={() => setShowSuggestions(false)} className="text-gray-400 hover:text-white">&times;</button>
            </header>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {TOPIC_SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="text-left p-3 bg-gray-900/50 hover:bg-cyan-600/50 border border-gray-700 rounded-md transition-all duration-200 text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeywordInputForm;
