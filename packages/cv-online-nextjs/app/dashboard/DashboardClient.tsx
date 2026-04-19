"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";

export default function DashboardClient() {
  const { data: session } = useSession();
  const [cvs, setCvs] = useState<any[]>([]);
  
  const getCvs = async () => {
    try {
      const res = await axiosInstance.get("/cvs");
      setCvs(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCvs();
  }, []);

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-32 pb-12">
      {/* Welcome Section */}
      <section className="mb-12" data-purpose="hero-section">
        <p className="text-lg font-normal mb-1">Good afternoon, {session?.user?.name}</p>
        <h1 className="text-6xl font-headline italic mb-8 text-foreground">Your CVs are looking sharp.</h1>
        <Link href="/cvs/create">
          <button className="flex items-center space-x-2 border border-[#1e3a3a] text-[#1e3a3a] px-5 py-2.5 rounded-sm hover:bg-gray-200 transition-colors text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span>Create New CV</span>
          </button>
        </Link>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" data-purpose="statistics-grid">
        {/* Total CVs */}
        <div className="border border-gray-200 bg-white p-6 rounded-sm">
          <p className="text-sm font-medium text-gray-500 mb-2">Total CVs</p>
          <p className="text-4xl font-normal text-foreground">{cvs.length}</p>
        </div>
        {/* Downloads */}
        <div className="border border-gray-200 bg-white p-6 rounded-sm">
          <p className="text-sm font-medium text-gray-500 mb-2">Downloads</p>
          <p className="text-4xl font-normal text-foreground">142</p>
        </div>
        {/* Top Template */}
        <div className="border border-gray-200 bg-white p-6 rounded-sm flex flex-col justify-between">
          <p className="text-sm font-medium text-gray-500 mb-2">Top Template</p>
          <div className="flex items-center justify-between mt-4">
            <p className="text-3xl font-medium text-gray-900">Modern Professional</p>
            <button className="p-1 text-gray-700 hover:text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Recent CVs Section */}
      <section data-purpose="recent-cvs-section">
        <h2 className="text-xl font-medium mb-6 text-foreground">Recent CVs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cvs.length === 0 ? (
            <p className="text-sm text-gray-500">You haven't created any CVs yet.</p>
          ) : (
            cvs.map((cv) => (
              <div key={cv.id} className="group" data-purpose="cv-item">
                <Link href={`/cvs/${cv.id}/edit`}>
                  <div className="bg-[#e5e7eb] aspect-[1/1.1] p-0 rounded-sm mb-4 flex items-center justify-center overflow-hidden border border-gray-200 relative hover:border-gray-400 transition-colors cursor-pointer">
                    {cv.thumbnailUrl ? (
                      <img 
                        src={cv.thumbnailUrl} 
                        alt={cv.title || "CV Thumbnail"} 
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <svg className="w-3/4 h-auto drop-shadow-md" fill="white" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">
                        <rect fill="white" height="297" width="210"></rect>
                        <rect fill="#4b5563" height="297" width="60" x="0" y="0"></rect>
                        <rect fill="#9ca3af" height="30" rx="15" width="30" x="15" y="20"></rect>
                        <rect fill="#d1d5db" height="4" rx="2" width="30" x="15" y="60"></rect>
                        <rect fill="#d1d5db" height="4" rx="2" width="20" x="15" y="70"></rect>
                        <rect fill="#111827" height="8" rx="2" width="80" x="80" y="30"></rect>
                        <rect fill="#9ca3af" height="6" rx="2" width="40" x="80" y="45"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="100" x="80" y="70"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="100" x="80" y="80"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="80" x="80" y="90"></rect>
                        <rect fill="#111827" height="6" rx="2" width="50" x="80" y="120"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="100" x="80" y="140"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="100" x="80" y="150"></rect>
                        <rect fill="#e5e7eb" height="3" rx="1.5" width="90" x="80" y="160"></rect>
                      </svg>
                    )}
                  </div>
                </Link>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground truncate max-w-[200px]">
                      {cv.title || "Untitled CV"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Modified {new Date(cv.updatedAt || cv.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-800">
                    <Link href={`/cvs/${cv.id}/edit`}>
                      <button className="hover:text-black">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </button>
                    </Link>
                    <button className="hover:text-black" onClick={async () => {
                      if (confirm('Are you sure you want to delete this CV?')) {
                        try {
                          await axiosInstance.delete(`/cvs/${cv.id}`);
                          getCvs();
                        } catch(e) { console.error('Delete error', e); }
                      }
                    }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                    <button className="hover:text-black">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
