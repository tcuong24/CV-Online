'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useCvEditor } from '@/store';
import Image from 'next/image';

export default function TemplatePreview() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  const [cvTitle, setCvTitle] = useState('My CV');
  const [isCreating, setIsCreating] = useState(false);

  const { currentTemplate, isLoading, fetchTemplate } = useTemplateStore();
  const { createCV } = useCvEditor();

  useEffect(() => {
    if (templateId) {
      fetchTemplate(templateId);
    }
  }, [templateId]);

  const handleUseTemplate = async () => {
    setIsCreating(true);
    try {
      const cvId = await createCV(cvTitle, templateId);
      router.push(`/editor/${cvId}`);
    } catch (error) {
      console.error('Failed to create CV:', error);
      alert('Failed to create CV. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading || !currentTemplate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Template Info */}
        <div>
          <button
            onClick={() => router.back()}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back to Templates
          </button>

          <h1 className="text-4xl font-bold mb-4">{currentTemplate.name}</h1>

          {currentTemplate.description && (
            <p className="text-gray-600 mb-6">{currentTemplate.description}</p>
          )}

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4">Template Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{currentTemplate.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Layout:</span>
                <span className="font-medium">{currentTemplate.layoutType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">
                  {currentTemplate.isPremium ? 'Premium' : 'Free'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Used by:</span>
                <span className="font-medium">{currentTemplate.usageCount} people</span>
              </div>
            </div>
          </div>

          {/* Create CV Form */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Create Your CV</h3>
            <input
              type="text"
              value={cvTitle}
              onChange={(e) => setCvTitle(e.target.value)}
              placeholder="Enter CV title"
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <button
              onClick={handleUseTemplate}
              disabled={isCreating || !cvTitle.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Creating...' : 'Use This Template'}
            </button>
          </div>
        </div>

        {/* Right: Template Preview */}
        <div>
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-[600px]">
                <Image
                  src={currentTemplate.thumbnailUrl}
                  alt={currentTemplate.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
