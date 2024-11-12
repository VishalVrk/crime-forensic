import React from 'react';
import { Calendar, Search } from 'lucide-react';

const NavigationTabs = ({ selectedTab, setSelectedTab }) => {
  return (
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
  );
};

export default NavigationTabs;