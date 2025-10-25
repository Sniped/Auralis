'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const scrollToDescription = () => {
    document.getElementById('description')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <main className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-black overflow-hidden overscroll-none">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        <div className="text-center space-y-6">
          {/* Main title with gradient */}
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-gradient">
            Auralis
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Stop Relying on Memory
          </p>
          
          {/* CTA Button */}
          <div className="pt-4 flex gap-4 justify-center items-center">
            <Button 
              onClick={scrollToDescription}
              size="lg"
              className="group relative px-10 py-5 text-base bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Get Started</span>
            </Button>
            <Button 
              size="lg"
              className="group relative px-10 py-5 text-base bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-full font-semibold shadow-lg shadow-gray-500/30 hover:shadow-gray-500/50 transition-all duration-300 hover:scale-105 border border-gray-600"
            >
              <span className="relative z-10">Sign In</span>
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
      
      {/* Grid overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      {/* Description Section */}
      <div id="description" className="relative z-10 h-screen flex flex-col items-center justify-center py-6 md:py-8 px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent animate-gradient text-center mb-5 md:mb-6">
          Your Memory Has Limits. Auralis Doesn&apos;t.
        </h2>
        
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-8 items-start">
            {/* Left Column */}
            <div className="space-y-3">
              {/* Description */}
              <p className="text-base md:text-lg text-[#e0e6ed] leading-relaxed opacity-90">
                Stop worrying about what you might forget. Auralis automatically captures every detail from patient interactions—symptoms, concerns, emotions, even subtle cues—so you can be fully present without mentally tracking what to write down later.
              </p>

              {/* Value Propositions */}
              <div className="space-y-3 pt-2">
                <div className="group p-4 bg-[rgba(59,130,246,0.05)] border-l-4 border-[#3b82f6] rounded-xl hover:bg-[rgba(59,130,246,0.08)] hover:translate-x-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#10b981]/20 flex items-center justify-center mt-0.5">
                      <span className="text-[#10b981] text-sm font-bold">✓</span>
                    </div>
                    <p className="text-[#d1d5db] leading-relaxed text-sm">
                      Captures every detail automatically—no mental note-taking required
                    </p>
                  </div>
                </div>

                <div className="group p-4 bg-[rgba(59,130,246,0.05)] border-l-4 border-[#3b82f6] rounded-xl hover:bg-[rgba(59,130,246,0.08)] hover:translate-x-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#10b981]/20 flex items-center justify-center mt-0.5">
                      <span className="text-[#10b981] text-sm font-bold">✓</span>
                    </div>
                    <p className="text-[#d1d5db] leading-relaxed text-sm">
                      Remembers patient emotions and subtle cues you might miss
                    </p>
                  </div>
                </div>

                <div className="group p-4 bg-[rgba(59,130,246,0.05)] border-l-4 border-[#3b82f6] rounded-xl hover:bg-[rgba(59,130,246,0.08)] hover:translate-x-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#10b981]/20 flex items-center justify-center mt-0.5">
                      <span className="text-[#10b981] text-sm font-bold">✓</span>
                    </div>
                    <p className="text-[#d1d5db] leading-relaxed text-sm">
                      Instant access to complete records—no struggling to recall
                    </p>
                  </div>
                </div>

                <div className="group p-4 bg-[rgba(59,130,246,0.05)] border-l-4 border-[#3b82f6] rounded-xl hover:bg-[rgba(59,130,246,0.08)] hover:translate-x-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#10b981]/20 flex items-center justify-center mt-0.5">
                      <span className="text-[#10b981] text-sm font-bold">✓</span>
                    </div>
                    <p className="text-[#d1d5db] leading-relaxed text-sm">
                      Focus on patients, not on remembering what to document
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats Panel */}
            <div className="space-y-3">
              {/* Stat 1 */}
              <Card className="bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm shadow-2xl shadow-blue-500/20">
                <CardContent className="p-6 space-y-2">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#06b6d4] bg-clip-text text-transparent leading-none">
                    Zero
                  </div>
                  <div className="text-xs font-bold tracking-widest text-[#9ca3af] uppercase">
                    Details Forgotten
                  </div>
                  <p className="text-[#e0e6ed] leading-relaxed text-sm opacity-90">
                    Every interaction captured perfectly, every time
                  </p>
                </CardContent>
              </Card>

              {/* Stat 2 */}
              <Card className="bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm shadow-2xl shadow-blue-500/20">
                <CardContent className="p-6 space-y-2">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#06b6d4] bg-clip-text text-transparent leading-none">
                    100%
                  </div>
                  <div className="text-xs font-bold tracking-widest text-[#9ca3af] uppercase">
                    Automatic Recall
                  </div>
                  <p className="text-[#e0e6ed] leading-relaxed text-sm opacity-90">
                    Access any patient detail instantly, days or weeks later
                  </p>
                </CardContent>
              </Card>

              {/* Stat 3 */}
              <Card className="bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border-[rgba(59,130,246,0.35)] backdrop-blur-sm shadow-2xl shadow-blue-500/20">
                <CardContent className="p-6 space-y-2">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#06b6d4] bg-clip-text text-transparent leading-none">
                    Complete
                  </div>
                  <div className="text-xs font-bold tracking-widest text-[#9ca3af] uppercase">
                    Context Preserved
                  </div>
                  <p className="text-[#e0e6ed] leading-relaxed text-sm opacity-90">
                    Symptoms, emotions, and subtle cues—all documented
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Sign In Button */}
        <div className="mt-6">
          <Button 
            size="lg"
            className="px-10 py-5 text-base bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">Sign In</span>
          </Button>
        </div>
      </div>
      
      {/* Grid overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
    </main>
  );
}
