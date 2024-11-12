import React from 'react';
import { MessageSquare, Mail, File, X, Check } from 'lucide-react';

const TimelineView = ({ events }) => {
  const renderIcon = (type) => {
    switch (type) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'file': return <File className="w-4 h-4" />;
      default: return null;
    }
  };

  const renderStatusIcon = (is_suspicious) => {
    return is_suspicious ? 
      <X className="w-4 h-4 text-red-500" /> : 
      <Check className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-4">
      {events.map(event => (
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
                <p className="text-xs text-gray-400">
                  From: {event.sender} To: {event.receiver} Subject: {event.subject}
                </p>
              )}
              {event.type === 'file' && (
                <p className="text-xs text-gray-400">
                  User: {event.user} Action: {event.action} Path: {event.filePath}
                </p>
              )}
            </div>
          </div>
          {renderStatusIcon(event.is_suspicious)}
        </div>
      ))}
    </div>
  );
};

export default TimelineView;