import { useState } from 'react';
import { X } from 'lucide-react';

interface RadiologyOrderFormProps {
  visitId: string;
  visitNumber: string;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
}

const radiologyStudies = [
  {
    category: 'X-Ray',
    studies: [
      { type: 'X-Ray Chest', bodyPart: 'Chest' },
      { type: 'X-Ray Abdomen', bodyPart: 'Abdomen' },
      { type: 'X-Ray Spine', bodyPart: 'Spine' },
      { type: 'X-Ray Skull', bodyPart: 'Skull' },
      { type: 'X-Ray Pelvis', bodyPart: 'Pelvis' },
      { type: 'X-Ray Extremity', bodyPart: 'Extremity' },
    ],
  },
  {
    category: 'CT Scan',
    studies: [
      { type: 'CT Brain', bodyPart: 'Brain' },
      { type: 'CT Chest', bodyPart: 'Chest' },
      { type: 'CT Abdomen', bodyPart: 'Abdomen' },
      { type: 'CT Spine', bodyPart: 'Spine' },
      { type: 'CT Angiography', bodyPart: 'Vascular' },
    ],
  },
  {
    category: 'MRI',
    studies: [
      { type: 'MRI Brain', bodyPart: 'Brain' },
      { type: 'MRI Spine', bodyPart: 'Spine' },
      { type: 'MRI Abdomen', bodyPart: 'Abdomen' },
      { type: 'MRI Joints', bodyPart: 'Musculoskeletal' },
    ],
  },
  {
    category: 'Ultrasound',
    studies: [
      { type: 'USG Abdomen', bodyPart: 'Abdomen' },
      { type: 'USG Pelvis', bodyPart: 'Pelvis' },
      { type: 'USG Pregnancy', bodyPart: 'Obstetric' },
      { type: 'USG Doppler', bodyPart: 'Vascular' },
      { type: 'USG Thyroid', bodyPart: 'Neck' },
    ],
  },
  {
    category: 'Other',
    studies: [
      { type: 'Mammography', bodyPart: 'Breast' },
      { type: 'ECG', bodyPart: 'Cardiac' },
      { type: 'Echo', bodyPart: 'Cardiac' },
      { type: 'PET Scan', bodyPart: 'Whole Body' },
    ],
  },
];

export function RadiologyOrderForm({ visitId, visitNumber, onClose, onSubmit }: RadiologyOrderFormProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [studyType, setStudyType] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [clinicalIndication, setClinicalIndication] = useState('');
  const [priority, setPriority] = useState<'ROUTINE' | 'URGENT' | 'STAT'>('ROUTINE');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setStudyType('');
    setBodyPart('');
  };

  const handleStudyChange = (study: string) => {
    setStudyType(study);
    const selectedStudy = radiologyStudies
      .find((cat) => cat.category === selectedCategory)
      ?.studies.find((s) => s.type === study);
    
    if (selectedStudy) {
      setBodyPart(selectedStudy.bodyPart);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!studyType.trim()) {
      newErrors.studyType = 'Study type is required';
    }
    if (!bodyPart.trim()) {
      newErrors.bodyPart = 'Body part is required';
    }
    if (!clinicalIndication.trim()) {
      newErrors.clinicalIndication = 'Clinical indication is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const orderData = {
      order_number: `RO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000).padStart(6, '0')}`,
      visit: visitId,
      study_type: studyType,
      body_part: bodyPart,
      clinical_indication: clinicalIndication,
      status: 'PENDING' as const,
      priority,
      ordered_at: new Date().toISOString(),
    };

    onSubmit(orderData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Order Radiology Study</h2>
            <p className="text-gray-600">Visit: {visitNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Priority */}
          <div>
            <label className="block text-gray-700 mb-2">Priority *</label>
            <div className="flex gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="ROUTINE"
                  checked={priority === 'ROUTINE'}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-gray-700">Routine</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="URGENT"
                  checked={priority === 'URGENT'}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-gray-700">Urgent</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="STAT"
                  checked={priority === 'STAT'}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-gray-700">STAT</span>
              </label>
            </div>
          </div>

          {/* Study Category */}
          <div>
            <label className="block text-gray-700 mb-2">Study Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category...</option>
              {radiologyStudies.map((cat) => (
                <option key={cat.category} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          {/* Study Type */}
          <div>
            <label className="block text-gray-700 mb-2">Study Type *</label>
            {selectedCategory ? (
              <select
                value={studyType}
                onChange={(e) => handleStudyChange(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.studyType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a study...</option>
                {radiologyStudies
                  .find((cat) => cat.category === selectedCategory)
                  ?.studies.map((study) => (
                    <option key={study.type} value={study.type}>
                      {study.type}
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type="text"
                value={studyType}
                onChange={(e) => {
                  setStudyType(e.target.value);
                  // Clear body part when manually entering
                  if (!selectedCategory) {
                    setBodyPart('');
                  }
                }}
                placeholder="Select a category first or enter custom study"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.studyType ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            )}
            {errors.studyType && (
              <p className="text-red-500 mt-1">{errors.studyType}</p>
            )}
          </div>

          {/* Body Part */}
          <div>
            <label className="block text-gray-700 mb-2">Body Part / Region *</label>
            <input
              type="text"
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
              placeholder="e.g., Chest, Abdomen, Brain, Left Knee..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.bodyPart ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bodyPart && (
              <p className="text-red-500 mt-1">{errors.bodyPart}</p>
            )}
          </div>

          {/* Clinical Indication */}
          <div>
            <label className="block text-gray-700 mb-2">Clinical Indication *</label>
            <textarea
              value={clinicalIndication}
              onChange={(e) => setClinicalIndication(e.target.value)}
              placeholder="Reason for study, suspected diagnosis, relevant clinical history..."
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.clinicalIndication ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.clinicalIndication && (
              <p className="text-red-500 mt-1">{errors.clinicalIndication}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Order Study
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
