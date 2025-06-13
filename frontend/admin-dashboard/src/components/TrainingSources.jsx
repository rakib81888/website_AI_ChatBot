import React, { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const TrainingSources = ({ clientId }) => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceType, setSourceType] = useState('website');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [file, setFile] = useState(null);
  const [qaPairs, setQaPairs] = useState([{ question: '', answer: '' }]);

  useEffect(() => {
    // Simulate API call to fetch training sources
    setTimeout(() => {
      setSources([
        { id: 1, type: 'website', data: { url: 'https://client1.com' }, status: 'completed', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, type: 'file', data: { name: 'manual.pdf' }, status: 'processing', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, type: 'manual', data: { qaCount: 15 }, status: 'completed', createdAt: new Date(Date.now() - 172800000).toISOString() },
        { id: 4, type: 'website', data: { url: 'https://client1.com/blog' }, status: 'failed', createdAt: new Date(Date.now() - 259200000).toISOString() },
      ]);
      setLoading(false);
    }, 800);
  }, [clientId]);

  const handleAddQA = () => {
    setQaPairs([...qaPairs, { question: '', answer: '' }]);
  };

  const handleQaChange = (index, field, value) => {
    const newQaPairs = [...qaPairs];
    newQaPairs[index][field] = value;
    setQaPairs(newQaPairs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit training source based on type
    console.log('Submitting training source:', { sourceType, websiteUrl, file, qaPairs });
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newSource = {
        id: sources.length + 1,
        type: sourceType,
        data: sourceType === 'website' ? { url: websiteUrl } : 
              sourceType === 'file' ? { name: file?.name || 'document' } : 
              { qaCount: qaPairs.length },
        status: 'queued',
        createdAt: new Date().toISOString()
      };
      
      setSources([newSource, ...sources]);
      setWebsiteUrl('');
      setFile(null);
      setQaPairs([{ question: '', answer: '' }]);
      setLoading(false);
    }, 1000);
  };

  if (loading && sources.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Training Sources</h2>
      
      <div className="bg-white rounded-lg shadow">
        <Tabs>
          <TabList>
            <Tab>Website</Tab>
            <Tab>File Upload</Tab>
            <Tab>Manual Q&A</Tab>
          </TabList>
          
          <TabPanel>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  The bot will crawl and index all pages on this website
                </p>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Start Training
              </button>
            </form>
          </TabPanel>
          
          <TabPanel>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          onChange={(e) => setFile(e.target.files[0])}
                          accept=".pdf,.docx,.txt"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX, TXT up to 10MB
                    </p>
                  </div>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                disabled={!file}
              >
                Start Training
              </button>
            </form>
          </TabPanel>
          
          <TabPanel>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Questions & Answers
                </label>
                
                <div className="space-y-4">
                  {qaPairs.map((pair, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Question"
                          value={pair.question}
                          onChange={(e) => handleQaChange(index, 'question', e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Answer"
                          value={pair.answer}
                          onChange={(e) => handleQaChange(index, 'answer', e.target.value)}
                          required
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setQaPairs(qaPairs.filter((_, i) => i !== index))}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    onClick={handleAddQA}
                  >
                    <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add another question
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save and Train
              </button>
            </form>
          </TabPanel>
        </Tabs>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Training History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sources.map((source) => (
                <tr key={source.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        {source.type === 'website' ? '🌐' : source.type === 'file' ? '📄' : '❓'}
                      </div>
                      <div className="capitalize">{source.type}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {source.type === 'website' && source.data.url}
                    {source.type === 'file' && source.data.name}
                    {source.type === 'manual' && `${source.data.qaCount} Q&A pairs`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={source.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(source.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrainingSources;