'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, signOut, getCurrentSession } from "@/lib/auth";
import UploadModal from "@/components/UploadModal";
import RecordingCard from "@/components/RecordingCard";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import { Recording } from "@/types/recordings";

/**
 * Dashboard Page for Auralis Healthcare Documentation
 * 
 * Protected route - requires AWS Cognito authentication
 * 
 * This dashboard provides healthcare professionals with:
 * - Video recordings from S3
 * - Video playback functionality
 * - Search and filter functionality
 * - Video upload functionality to S3
 * 
 * Testing Checklist:
 * [ ] Videos load from S3
 * [ ] Pre-signed URLs generate correctly
 * [ ] Video plays in modal
 * [ ] Modal closes properly
 * [ ] Error handling works
 * [ ] Loading states display
 * [ ] Responsive on mobile
 * [ ] Works with multiple videos
 */

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Video recordings state
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [recordingsLoading, setRecordingsLoading] = useState(false);
  const [recordingsError, setRecordingsError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ key: string; name: string } | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      
      if (!authenticated) {
        router.push("/signin");
        return;
      }

      // Get user email and ID from session
      const session = await getCurrentSession();
      if (session) {
        const email = session.getIdToken().payload.email;
        const cognitoUserId = session.getIdToken().payload.sub;
        setUserEmail(email || "");
        setUserId(cognitoUserId || "");
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Handle sign out
  const handleSignOut = () => {
    signOut();
    router.push("/signin");
  };

  // Handle upload complete
  const handleUploadComplete = () => {
    // Refresh recordings list after upload
    fetchRecordings();
    console.log('Upload completed successfully');
  };

  // Fetch recordings from S3
  const fetchRecordings = async () => {
    setRecordingsLoading(true);
    setRecordingsError(null);

    try {
      const response = await fetch('/api/recordings/list');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch recordings');
      }

      const data = await response.json();
      setRecordings(data.recordings || []);
    } catch (err) {
      console.error('Error fetching recordings:', err);
      setRecordingsError(err instanceof Error ? err.message : 'Failed to load recordings');
    } finally {
      setRecordingsLoading(false);
    }
  };

  // Handle video play
  const handlePlay = (key: string, name: string) => {
    setSelectedVideo({ key, name });
    setShowPlayer(true);
  };

  // Handle video player close
  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectedVideo(null);
  };

  // Fetch recordings on mount
  useEffect(() => {
    if (!loading && userId) {
      fetchRecordings();
    }
  }, [loading, userId]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-black min-h-screen overflow-hidden overscroll-none flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  // Filter recordings based on search
  const filteredRecordings = recordings.filter(recording =>
    recording.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recording.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-black min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/50 border-b border-white/10">
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
            <span className="text-gray-300 text-sm hidden md:block">{userEmail}</span>
            <Button 
              onClick={handleSignOut}
              size="sm"
              className="px-6 py-2 text-sm bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-full font-semibold shadow-lg shadow-gray-500/30 hover:shadow-gray-500/50 transition-all duration-300 hover:scale-105 border border-gray-600"
            >
              Sign Out
            </Button>
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
              onClick={() => setShowUploadModal(true)}
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
                placeholder="Search recordings by filename or user ID..."
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
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Total Recordings</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {recordingsLoading ? '...' : recordings.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm shadow-xl shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Search Results</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {recordingsLoading ? '...' : filteredRecordings.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm shadow-xl shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 uppercase tracking-wider">Storage Used</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {recordingsLoading ? '...' : (recordings.reduce((acc, r) => acc + r.size, 0) / (1024 * 1024 * 1024)).toFixed(2)} GB
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Recordings List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Patient Recordings</h2>
            
            {recordingsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="animate-pulse flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-xl"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-blue-500/20 rounded w-3/4"></div>
                          <div className="h-3 bg-blue-500/10 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recordingsError ? (
              <Card className="bg-gradient-to-br from-[rgba(239,68,68,0.12)] to-[rgba(220,38,38,0.12)] border-[rgba(239,68,68,0.35)] backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 font-semibold mb-2">Error Loading Recordings</p>
                  <p className="text-gray-400 mb-4">{recordingsError}</p>
                  <Button
                    onClick={fetchRecordings}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredRecordings.length === 0 ? (
              <Card className="bg-gradient-to-br from-[rgba(59,130,246,0.08)] to-[rgba(6,182,212,0.08)] border-[rgba(59,130,246,0.3)] backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <svg className="w-16 h-16 text-blue-400/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-lg mb-2">
                    {searchQuery ? 'No recordings found matching your search.' : 'No recordings yet.'}
                  </p>
                  {!searchQuery && (
                    <p className="text-gray-500 mb-6">
                      Upload your first recording to get started!
                    </p>
                  )}
                  {!searchQuery && (
                    <Button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    >
                      + Upload Recording
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRecordings.map((recording) => (
                  <RecordingCard
                    key={recording.key}
                    videoKey={recording.key}
                    fileName={recording.fileName}
                    lastModified={recording.lastModified}
                    size={recording.size}
                    userId={recording.userId}
                    onPlay={handlePlay}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
        userId={userId}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={showPlayer}
        videoKey={selectedVideo?.key || null}
        videoName={selectedVideo?.name || ''}
        onClose={handleClosePlayer}
      />
    </main>
  );
}
