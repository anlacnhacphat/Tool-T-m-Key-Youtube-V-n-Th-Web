
import React, { useState } from 'react';
import type { KeywordResult, SearchOptions } from '../types';
import { CopyIcon, CheckIcon, DownloadIcon, BackIcon, ChartBarIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';

interface ResultsDisplayProps {
  results: KeywordResult[];
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
  searchOptions: SearchOptions | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading, error, onReset, searchOptions }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Logic for Geo based on Audience
  const geo = searchOptions?.audience === 'viet' ? 'VN' : 'US';

  // Helper for single keyword URL
  const getSingleTrendUrl = (keyword: string) => {
    return `https://trends.google.com/trends/explore?date=today%201-m&geo=${geo}&q=${encodeURIComponent(keyword)}`;
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
        <div className="text-center">
            <div className="p-8 bg-red-900/20 border border-red-500 rounded-lg text-red-300 mb-6">{error}</div>
            <button
                onClick={onReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-red-500/40 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-500/50"
            >
                <BackIcon className="h-5 w-5" />
                Thử lại
            </button>
        </div>
    );
  }

  if (results.length === 0 && !isLoading) {
     return (
      <div className="text-center">
        <div className="p-8 bg-gray-800/50 border border-dashed border-gray-600 rounded-lg mb-6">
            <p className="text-gray-400">Không tìm thấy từ khóa nào phù hợp. Vui lòng thử lại với chủ đề khác.</p>
        </div>
        <button
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-red-500/40 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-500/50"
        >
            <BackIcon className="h-5 w-5" />
            Quay lại
        </button>
      </div>
    );
  }
  
  const handleDownload = () => {
    if (!searchOptions) return;

    const slugify = (str: string) => {
      str = str.toLowerCase();
      str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      str = str.replace(/[đĐ]/g, 'd');
      str = str.replace(/[^a-z0-9\s-]/g, '').trim();
      str = str.replace(/\s+/g, '_');
      return str;
    };

    const fileName = `${slugify(searchOptions.topic || 'ket_qua_tim_kiem')}.csv`;
    const escapeCsvField = (field: string | number | undefined) => `"${String(field ?? '').replace(/"/g, '""')}"`;

    const infoRows = [
        ["Thông tin tìm kiếm"],
        ["Chủ đề", searchOptions.topic],
        ["Từ khóa chính", searchOptions.mainKeyword || 'N/A'],
        ["Đối tượng", searchOptions.audience === 'viet' ? 'View Việt' : 'View Ngoại'],
        ["Ngôn ngữ", searchOptions.language],
        ["Link đối thủ", searchOptions.competitorUrl || 'N/A'],
        []
    ];

    const hasTranslations = results.some(r => r.vietnameseTranslation);
    const headers = ["Từ khóa", ...(hasTranslations ? ["Bản dịch Tiếng Việt"] : []), "Link Kiểm Tra Trend"];
    const dataRows = results.map(row => {
      const baseRow = [
        row.keyword,
      ];
      if (hasTranslations) {
        baseRow.push(row.vietnameseTranslation || '');
      }
      baseRow.push(getSingleTrendUrl(row.keyword));
      return baseRow;
    });

    const csvContent = [
        ...infoRows.map(row => row.map(escapeCsvField).join(',')),
        headers.map(escapeCsvField).join(','),
        ...dataRows.map(row => row.map(escapeCsvField).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-white">Kết Quả Đề Xuất</h2>
        </div>
        
        <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-lg shadow-md">
            <table className="w-full min-w-[600px]">
                <thead className="bg-gray-900/50">
                    <tr>
                        <th className="p-4 w-16 text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">STT</th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">Từ Khóa</th>
                        <th className="p-4 w-24 text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">Sao chép</th>
                        <th className="p-4 w-32 text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">Kiểm tra</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <tr key={`${result.keyword}-${index}`} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors">
                            <td className="p-4 text-center text-gray-400">{index + 1}</td>
                            <td className="p-4">
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-400 break-all">{result.keyword}</h3>
                                    {result.vietnameseTranslation && (
                                        <p className="mt-1 text-sm text-gray-400 italic">({result.vietnameseTranslation})</p>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 text-center">
                                <button
                                    onClick={() => handleCopy(result.keyword, index)}
                                    className="inline-flex items-center justify-center p-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition-all shadow-lg shadow-pink-500/20"
                                    title="Sao chép từ khóa"
                                >
                                    {copiedIndex === index ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
                                </button>
                            </td>
                            <td className="p-4 text-center">
                                <a
                                    href={getSingleTrendUrl(result.keyword)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center p-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-gray-900 transition-all duration-200 shadow-sm border border-yellow-500 hover:border-yellow-400"
                                    title={`Kiểm tra "${result.keyword}" trên Google Trends`}
                                >
                                    <ChartBarIcon className="h-5 w-5" />
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>


        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
                onClick={handleDownload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-6 rounded-lg shadow-lg shadow-yellow-500/40 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
            >
                <DownloadIcon className="h-5 w-5" />
                Tải file Excel
            </button>
            <button
                onClick={onReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-red-500/40 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-500/50"
            >
                <BackIcon className="h-5 w-5" />
                Tìm kiếm mới
            </button>
        </div>
    </div>
  );
};

export default ResultsDisplay;
