
import React, { useState, useCallback } from 'react';
import { findKeywords } from './services/geminiService';
import type { KeywordResult, SearchOptions } from './types';
import KeywordInputForm from './components/KeywordInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { LogoIcon, PlayIcon, VideoIcon, ImageIcon } from './components/Icons';

const App: React.FC = () => {
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchOptions, setSearchOptions] = useState<SearchOptions | null>(null);

  const handleGenerateKeywords = useCallback(async (options: SearchOptions) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    setSearchOptions(options);

    try {
      const keywords = await findKeywords(options);
      setResults(keywords);
    } catch (e) {
      console.error(e);
      setError('An error occurred while fetching keywords. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResults([]);
    setError(null);
    setSearchOptions(null);
  }, []);

  const showResults = isLoading || error || (results && results.length > 0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="https://yt3.googleusercontent.com/Gug5UDLjPMRBto68HqZvJCSryebEkqiI2_9qV_8y16ZKIVLgxYBFx_PyUYZStcTzSc3v7TLq=s900-c-k-c0x00ffffff-no-rj"
              alt="Văn Thế Web Avatar"
              className="w-40 h-40 rounded-full border-4 border-white shadow-2xl object-cover"
            />
          </div>
          <div className="flex items-center justify-center gap-4 mb-2">
            <LogoIcon className="h-12 w-12 text-cyan-400" />
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text tracking-tight">
              Tool Tìm Key Youtube Văn Thế Web
            </h1>
          </div>
          <p className="text-lg text-gray-400 mb-6">
            Công cụ siêu đỉnh để tự động hoá mọi việc của Team Văn Thế Web hotline: 038.6019.486
          </p>
        </header>

        <div className="max-w-2xl mx-auto w-full mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                    href="https://Veo3go.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-green-500/40 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500/50"
                >
                    <VideoIcon className="h-5 w-5" />
                    Tool tạo video
                </a>
                <a
                    href="https://youtu.be/mILoJ0QVMPI?si=5mIrxRcaowGimMzL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-pink-500/40 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-500/50"
                >
                    <PlayIcon className="h-5 w-5" />
                    Hướng dẫn cài đặt
                </a>
            </div>
            <hr className="border-t-2 border-gray-700 my-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                    href="https://Pic4go.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg shadow-lg shadow-yellow-500/40 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-500/50"
                >
                    <ImageIcon className="h-5 w-5" />
                    Tool tạo ảnh
                </a>
                <a
                    href="https://youtu.be/qEhx4Op5StQ?si=bh0Rnv8mPsfu1l2R"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-pink-500/40 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-500/50"
                >
                    <PlayIcon className="h-5 w-5" />
                    Hướng dẫn cài đặt
                </a>
            </div>
        </div>
        
        <hr className="w-full border-t border-gray-700/50 mb-8" />
        
        <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8 border border-gray-700">
          <KeywordInputForm onGenerate={handleGenerateKeywords} isLoading={isLoading} />
          
          {showResults && (
            <div className="mt-10 pt-10 border-t border-gray-700/50">
              <ResultsDisplay 
                results={results} 
                isLoading={isLoading} 
                error={error} 
                onReset={handleReset} 
                searchOptions={searchOptions} 
              />
            </div>
          )}
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Bản quyền hoạt động bởi team Văn Thế Web</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
