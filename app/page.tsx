import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, BarChart3, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Muay Thai Master</h1>
              <p className="text-xl md:text-2xl opacity-90">
                Perfect your technique with AI-powered analysis and professional comparisons
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="bg-white text-red-800 hover:bg-gray-100">
                  <Link href="/upload">
                    Upload Video <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/techniques">Technique Library</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=500&width=500"
                  alt="Muay Thai fighter in action"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg">
                  <div className="text-red-800 font-bold">Form Score</div>
                  <div className="text-3xl font-bold text-red-600">92</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Upload className="h-10 w-10 text-red-600" />}
              title="Upload & Analyze"
              description="Record or upload your Muay Thai practice videos for AI-powered analysis of your technique."
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-red-600" />}
              title="Compare & Learn"
              description="See your technique compared side-by-side with professional fighters to spot differences."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-red-600" />}
              title="Track Progress"
              description="Monitor your improvement over time with detailed metrics and personalized feedback."
            />
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Performance Metrics</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <MetricCard
              title="Form"
              score={85}
              description="Correctness of posture, stance, and technique"
              color="bg-blue-500"
            />
            <MetricCard
              title="Chain of Power"
              score={78}
              description="Efficiency of kinetic chain for maximum power delivery"
              color="bg-purple-500"
            />
            <MetricCard
              title="Explosiveness"
              score={90}
              description="Speed, aggression, and fluidity of movements"
              color="bg-red-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Improve Your Technique?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of Muay Thai practitioners who are perfecting their skills with AI-powered feedback.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link href="/upload">Upload Your First Video</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/journey">View Demo Journey</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">Muay Thai Master</h3>
              <p className="mt-2 text-gray-400">Perfect your technique with AI</p>
            </div>
            <div className="flex gap-8">
              <Link href="/upload" className="hover:text-red-400">
                Upload
              </Link>
              <Link href="/journey" className="hover:text-red-400">
                Journey
              </Link>
              <Link href="/techniques" className="hover:text-red-400">
                Techniques
              </Link>
              <Link href="/reports" className="hover:text-red-400">
                Reports
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 Muay Thai Master. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function MetricCard({ title, score, description, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <div
          className={`${color} text-white text-2xl font-bold rounded-full w-14 h-14 flex items-center justify-center`}
        >
          {score}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
