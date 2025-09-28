import { FileText } from "lucide-react";

const SituationDescriptions = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        {/* Step Header */}
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-4">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Situation Descriptions</h1>
            <p className="text-gray-600">Describe your current situation and assistance needs</p>
          </div>
        </div>

        {/* Form Content Placeholder */}
        <div className="space-y-6">
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Situation Description Form</h3>
            <p className="text-gray-500">
              This step will collect detailed information about your current situation and specific assistance needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SituationDescriptions;
