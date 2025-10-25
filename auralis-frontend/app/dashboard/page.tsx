'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

/**
 * Dashboard Page for Auralis Healthcare Documentation
 * 
 * NOTE: This page currently has no authentication for development purposes.
 * TODO: Add proper authentication middleware before production deployment.
 * 
 * This dashboard provides healthcare professionals with:
 * - Recent patient interaction records
 * - Quick access to captured details (symptoms, emotions, cues)
 * - Search and filter functionality
 * - New recording interface
 */

// Mock data - TODO: Replace with actual API calls
const mockPatientRecords = [
  {
    id: 1,
    patientName: "Sarah Johnson",
    date: "2025-10-25",
    time: "10:30 AM",
    symptoms: ["Persistent headache", "Fatigue", "Dizziness"],
    emotions: "Anxious about symptoms, concerned about work impact",
    keyPoints: "Patient mentioned stress at work increased last week. History of migraines.",
    duration: "15 min"
  },
  {
    id: 2,
    patientName: "Michael Chen",
    date: "2025-10-25",
    time: "09:15 AM",
    symptoms: ["Lower back pain", "Limited mobility"],
    emotions: "Frustrated with recovery progress, motivated to improve",
    keyPoints: "Pain worse in mornings. Completed physical therapy exercises inconsistently.",
    duration: "20 min"
  },
  {
    id: 3,
    patientName: "Emily Rodriguez",
    date: "2025-10-24",
    time: "2:45 PM",
    symptoms: ["Shortness of breath", "Chest tightness"],
    emotions: "Worried but trying to stay calm, mentioned family history",
    keyPoints: "Symptoms during exercise only. Requested cardiac screening due to family history.",
    duration: "18 min"
  }
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);

  // Filter records based on search
  const filteredRecords = mockPatientRecords.filter(record =>
    record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-black min-h-screen overflow-hidden overscroll-none">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/50 border-b border-white/10">
        <div className="w-full px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            Auralis
          </Link>
          
          {/* User Actions */}
          <div className="flex gap-4 items-center">
            <span className="text-gray-300 text-sm hidden md:block">Dr. Smith</span>
            {/* TODO: Add proper logout functionality with auth */}
            <Link href="/">
              <Button 
                size="sm"
                className="px-6 py-2 text-sm bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-full font-semibold shadow-lg shadow-gray-500/30 hover:shadow-gray-500/50 transition-all duration-300 hover:scale-105 border border-gray-600"
              >
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Background Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Patient Records
              </h1>
              <p className="text-gray-400 mt-2">
                All interactions automatically captured and organized
              </p>
            </div>
            <Button 
              size="lg"
              className="px-8 py-6 text-base bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105"
            >
              + New Recording
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="bg-gradient-to-br from-[rgba(59,130,246,0.08)] to-[rgba(6,182,212,0.08)] border-[rgba(59,130,246,0.3)] backdrop-blur-sm">
            <CardContent className="p-6">
              <input
                type="text"
                placeholder="Search by patient name or symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-gray-900/50 border border-blue-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-lg"
              />
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm shadow-xl shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Today&apos;s Interactions</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    8
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm shadow-xl shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 uppercase tracking-wider">This Week</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    42
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm shadow-xl shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Total Records</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    1,247
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Records List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Recent Interactions</h2>
            
            {filteredRecords.length === 0 ? (
              <Card className="bg-gradient-to-br from-[rgba(59,130,246,0.08)] to-[rgba(6,182,212,0.08)] border-[rgba(59,130,246,0.3)] backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-400 text-lg">No records found matching your search.</p>
                </CardContent>
              </Card>
            ) : (
              filteredRecords.map((record) => (
                <Card 
                  key={record.id}
                  className={`bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm shadow-xl shadow-blue-500/10 transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-400/50 cursor-pointer ${
                    selectedRecord === record.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl text-white mb-2">
                          {record.patientName}
                        </CardTitle>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>{record.date}</span>
                          <span>•</span>
                          <span>{record.time}</span>
                          <span>•</span>
                          <span>{record.duration}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30"
                        >
                          View Full
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {selectedRecord === record.id && (
                    <CardContent className="space-y-4 border-t border-blue-500/20 pt-6">
                      {/* Symptoms Section */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-blue-300 uppercase tracking-wider">
                          Symptoms Captured
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {record.symptoms.map((symptom, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-200"
                            >
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Emotional Cues Section */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                          Emotional Cues
                        </h4>
                        <p className="text-gray-300 leading-relaxed">
                          {record.emotions}
                        </p>
                      </div>

                      {/* Key Points Section */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-green-300 uppercase tracking-wider">
                          Key Points
                        </h4>
                        <p className="text-gray-300 leading-relaxed">
                          {record.keyPoints}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
