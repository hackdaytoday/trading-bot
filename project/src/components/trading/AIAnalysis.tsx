import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { metaApiService } from '../../services/metaapi';
import { toast } from 'react-toastify';

const AIAnalysis: React.FC = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const requestAnalysis = async () => {
    if (!user?.metaTrader.connected) {
      toast.error('Please connect to MetaTrader first');
      return;
    }

    setIsLoading(true);
    try {
      const result = await metaApiService.getAIAnalysis();
      setAnalysis(result);
      toast.success('Analysis completed successfully!');
    } catch (error: any) {
      toast.error(`Failed to get analysis: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">AI Market Analysis</h2>
      <button
        onClick={requestAnalysis}
        disabled={isLoading || !user?.metaTrader.connected}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Market'}
      </button>
      {analysis && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{analysis}</pre>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
