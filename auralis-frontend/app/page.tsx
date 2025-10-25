'use client';

import { Button } from "@/components/ui/button";

export default function Home() {
  const scrollToDescription = () => {
    document.getElementById('description')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <main className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-black overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
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
          <div className="pt-8">
            <Button 
              onClick={scrollToDescription}
              size="lg"
              className="group relative px-12 py-6 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105 min-w-[200px] h-auto"
            >
              <span className="relative z-10">Get Started</span>
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
      <div id="description" className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24 md:py-32">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left Column */}
            <div className="space-y-10">
              {/* Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#06b6d4] bg-clip-text text-transparent leading-[1.1]">
                Your Memory Has Limits.<br />Auralis Doesn&apos;t.
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl lg:text-2xl text-[#e0e6ed] leading-relaxed opacity-90">
                Stop worrying about what you might forget. Auralis automatically captures every detail from patient interactions—symptoms, concerns, emotions, even subtle cues—so you can be fully present without mentally tracking what to write down later.
              </p>

              {/* Value Propositions */}
              <div className="space-y-5 pt-4">
                <div className="group p-6 bg-[rgba(59,130,246,0.05)] border-l-4 border-[#3b82f6] rounded-xl hover:bg-[rgba(59,130,246,0.08)] hover:translate-x-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#10b981]/20 flex items-center justify-center mt-0.5">
                      <span className="text-[#10b981] text-xl font-bold">✓</span>
                    </div>
                    <p className="text-[#d1d5db] leading-relaxed text-base md:text-lg">
                      Captures every detail automatically—no mental note-taking required
                    </p>
                  </div>
                </div>

                <div className="group p-6 bg-[rgba(59,130,246,0.05)] border-l-4 border-[#3b82f6] rounded-xl hover:bg-[rgba(59,130,246,0.08)] hover:translate-x-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#10b981]/20 flex items-center justify-center mt-0.5">
                      <span className="text-[#10b981] text-xl font-bold">✓</span>
                    </div>
                    <p className="text-[#d1d5db] leading-relaxed text-base md:text-lg">
                      Remembers patient emotions and subtle cues you might miss
                    </p>
                  </div>
                </div>

                <div className="group p-6 bg-[rgba(59,130,246,0.05)] border-l-4 border-[#3b82f6] rounded-xl hover:bg-[rgba(59,130,246,0.08)] hover:translate-x-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#10b981]/20 flex items-center justify-center mt-0.5">
                      <span className="text-[#10b981] text-xl font-bold">✓</span>
                    </div>
                    <p className="text-[#d1d5db] leading-relaxed text-base md:text-lg">
                      Instant access to complete records—no struggling to recall
                    </p>
                  </div>
                </div>

                <div className="group p-6 bg-[rgba(59,130,246,0.05)] border-l-4 border-[#3b82f6] rounded-xl hover:bg-[rgba(59,130,246,0.08)] hover:translate-x-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#10b981]/20 flex items-center justify-center mt-0.5">
                      <span className="text-[#10b981] text-xl font-bold">✓</span>
                    </div>
                    <p className="text-[#d1d5db] leading-relaxed text-base md:text-lg">
                      Focus on patients, not on remembering what to document
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats Panel */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-gradient-to-br from-[rgba(59,130,246,0.12)] to-[rgba(6,182,212,0.12)] border border-[rgba(59,130,246,0.35)] rounded-3xl p-10 md:p-12 space-y-12 backdrop-blur-sm shadow-2xl shadow-blue-500/20">
                {/* Stat 1 */}
                <div className="space-y-4 pb-10 border-b border-[rgba(59,130,246,0.25)]">
                  <div className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#06b6d4] bg-clip-text text-transparent leading-none">
                    Zero
                  </div>
                  <div className="text-xs md:text-sm font-bold tracking-widest text-[#9ca3af] uppercase">
                    Details Forgotten
                  </div>
                  <p className="text-[#e0e6ed] leading-relaxed text-base md:text-lg opacity-90">
                    Every interaction captured perfectly, every time
                  </p>
                </div>

                {/* Stat 2 */}
                <div className="space-y-4 pb-10 border-b border-[rgba(59,130,246,0.25)]">
                  <div className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#06b6d4] bg-clip-text text-transparent leading-none">
                    100%
                  </div>
                  <div className="text-xs md:text-sm font-bold tracking-widest text-[#9ca3af] uppercase">
                    Automatic Recall
                  </div>
                  <p className="text-[#e0e6ed] leading-relaxed text-base md:text-lg opacity-90">
                    Access any patient detail instantly, days or weeks later
                  </p>
                </div>

                {/* Stat 3 */}
                <div className="space-y-4">
                  <div className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#06b6d4] bg-clip-text text-transparent leading-none">
                    Complete
                  </div>
                  <div className="text-xs md:text-sm font-bold tracking-widest text-[#9ca3af] uppercase">
                    Context Preserved
                  </div>
                  <p className="text-[#e0e6ed] leading-relaxed text-base md:text-lg opacity-90">
                    Symptoms, emotions, and subtle cues—all documented
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
