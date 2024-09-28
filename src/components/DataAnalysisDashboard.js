import React, { useState } from 'react';
import { Search, Calendar, MessageSquare, Mail, File, X, Check, Upload } from 'lucide-react';

const DataAnalysisDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('timeline');
  const [events, setEvents] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({ whatsapp: false, email: false, file: false });

  const handleFileUpload = (type) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          let newEvents = [];
          
          if (type === 'whatsapp' && jsonData.whatsapp_data) {
            newEvents = jsonData.whatsapp_data.events.map(event => ({...event, type}));
          } else if (type === 'email' && jsonData.email_data) {
            newEvents = jsonData.email_data.events.map(event => ({...event, type}));
          } else if (type === 'file' && jsonData.file_activity_data) {
            newEvents = jsonData.file_activity_data.events.map(event => ({...event, type}));
          } else {
            throw new Error("Invalid JSON structure");
          }

          setEvents(prevEvents => [...prevEvents, ...newEvents]);
          setUploadStatus(prev => ({...prev, [type]: true}));
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert("Error parsing JSON file. Please ensure it's a valid JSON with the correct structure.");
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredEvents = events.filter(event => 
    event.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderIcon = (type) => {
    switch (type) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'file': return <File className="w-4 h-4" />;
      default: return null;
    }
  };

  const renderStatusIcon = (isSuspicious) => {
    return isSuspicious ? 
      <X className="w-4 h-4 text-red-500" /> : 
      <Check className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Crime Forensic toolkit (FTK)</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {['whatsapp', 'email', 'file'].map((type) => (
            <div key={type} className="flex items-center">
              <input
                type="file"
                id={`${type}Upload`}
                className="hidden"
                onChange={handleFileUpload(type)}
                accept=".json"
              />
              <label
                htmlFor={`${type}Upload`}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload {type.charAt(0).toUpperCase() + type.slice(1)} Data
              </label>
            </div>
          ))}
        </div>

        {Object.values(uploadStatus).some(status => status) && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p className="font-bold">Data uploaded:</p>
            <p>{Object.entries(uploadStatus)
              .filter(([_, status]) => status)
              .map(([type]) => type.charAt(0).toUpperCase() + type.slice(1))
              .join(', ')}
            </p>
          </div>
        )}

        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search keywords or phrases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border rounded px-2 py-1"
          />
          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
            Search
          </button>
        </div>

        <div className="mb-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                className={`mr-1 ${
                  selectedTab === 'timeline'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                } font-medium text-sm py-4 px-1`}
                onClick={() => setSelectedTab('timeline')}
              >
                <Calendar className="w-4 h-4 mr-2 inline" />
                Timeline
              </button>
              <button
                className={`mr-1 ${
                  selectedTab === 'analysis'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                } font-medium text-sm py-4 px-1`}
                onClick={() => setSelectedTab('analysis')}
              >
                <Search className="w-4 h-4 mr-2 inline" />
                Analysis
              </button>
            </nav>
          </div>
        </div>

        {selectedTab === 'timeline' && (
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  {renderIcon(event.type)}
                  <div className="ml-4">
                    <p className="font-semibold">{event.content}</p>
                    <p className="text-sm text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
                    {event.type === 'whatsapp' && (
                      <p className="text-xs text-gray-400">From: {event.sender} To: {event.receiver}</p>
                    )}
                    {event.type === 'email' && (
                      <p className="text-xs text-gray-400">From: {event.sender} To: {event.receiver} Subject: {event.subject}</p>
                    )}
                    {event.type === 'file' && (
                      <p className="text-xs text-gray-400">User: {event.user} Action: {event.action} Path: {event.filePath}</p>
                    )}
                  </div>
                </div>
                {renderStatusIcon(event.isSuspicious)}
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'analysis' && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p>Analysis features would be implemented here, such as keyword frequency, data visualizations, etc.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataAnalysisDashboard;