import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import UploadSection from './UploadSection';
import SearchBar from './SearchBar';
import NavigationTabs from './NavigationTabs';
import TimelineView from './TimelineView';
import AnalysisView from './AnalysisView';

// Initialize Supabase client
const supabaseUrl = 'https://vwumohgechgpnojjvobh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dW1vaGdlY2hncG5vamp2b2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyOTE5NDIsImV4cCI6MjA0Njg2Nzk0Mn0.aW2UM9uAVNY19uFzi6-cv70P85E8xS3Eq3fPwJQeNPE';
const supabase = createClient(supabaseUrl, supabaseKey);

const DataAnalysisDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('timeline');
  const [events, setEvents] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({ whatsapp: false, email: false, file: false });
  const [loading, setLoading] = useState(false);

  // Fetch events from Supabase on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Error fetching events. Please try again.');
    }
  };

  const handleFileUpload = (type) => async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          let newEvents = [];
          
          // Convert JSON data into events
          if (type === 'whatsapp' && jsonData.whatsapp_data) {
            newEvents = jsonData.whatsapp_data.events.map(event => ({...event, type}));
          } else if (type === 'email' && jsonData.email_data) {
            newEvents = jsonData.email_data.events.map(event => ({...event, type}));
          } else if (type === 'file' && jsonData.file_activity_data) {
            newEvents = jsonData.file_activity_data.events.map(event => ({...event, type}));
          } else {
            throw new Error("Invalid JSON structure");
          }

          // Send each event to the backend for analysis and storage
          await Promise.all(
            newEvents.map(async (event) => {
              await fetch('https://crime-app-backend.onrender.com/api/analyze-text', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      text: event.content,
                      source: type,
                      metadata: {
                          sender: event.sender,
                          receiver: event.receiver,
                          user: event.user,
                          action: event.action,
                          filePath: event.filePath
                      }
                  })
              });
            })
          );

          // Update upload status and refresh the events list from Supabase
          setUploadStatus(prev => ({...prev, [type]: true}));
          fetchEvents(); // Fetch all events directly from Supabase

        } catch (error) {
          console.error("Error processing data:", error);
          alert("Error processing data. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(file);
    }
  };


  const filteredEvents = events.filter(event => 
    event.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Crime Forensic toolkit (FTK)</h2>
        
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded">
              <p>Processing data...</p>
            </div>
          </div>
        )}

        <UploadSection 
          handleFileUpload={handleFileUpload} 
          uploadStatus={uploadStatus} 
        />

        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />

        <NavigationTabs 
          selectedTab={selectedTab} 
          setSelectedTab={setSelectedTab} 
        />

        {selectedTab === 'timeline' ? (
          <TimelineView events={filteredEvents} />
        ) : (
          <AnalysisView events={filteredEvents} />
        )}
      </div>
    </div>
  );
};

export default DataAnalysisDashboard;