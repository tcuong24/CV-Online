'use client';

import { useEffect } from 'react';
import { useTemplateStore } from '@/store/useTemplateStore';
import Image from 'next/image';
import Link from 'next/link';

export default function TemplateGallery() {
  const { templates, categories, filters, isLoading, fetchTemplates, fetchCategories, setFilters } =
    useTemplateStore();

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Choose Your Template</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <select
          className="px-4 py-2 border rounded-lg"
          value={filters.category || ''}
          onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 border rounded-lg"
          value={filters.isPremium === undefined ? '' : filters.isPremium ? 'premium' : 'free'}
          onChange={(e) =>
            setFilters({
              ...filters,
              isPremium: e.target.value === '' ? undefined : e.target.value === 'premium',
            })
          }
        >
          <option value="">All Templates</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      )}

      {/* Templates Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="relative h-64 bg-gray-100">
                <Image
                  src={template.thumbnailUrl}
                  alt={template.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {template.isPremium && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Premium
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                {template.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{template.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{template.category}</span>
                  <span className="text-sm text-gray-400">{template.usageCount} uses</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No templates found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
