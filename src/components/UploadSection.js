import React from 'react';
import { Upload } from 'lucide-react';

const UploadSection = ({ handleFileUpload, uploadStatus }) => {
  return (
    <div>
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
    </div>
  );
};

export default UploadSection;