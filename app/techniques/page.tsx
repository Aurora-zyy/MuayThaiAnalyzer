import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Info } from "lucide-react"

export default function TechniquesPage() {
  // Mock technique library data
  const techniques = {
    punches: [
      { id: 1, name: "Jab", level: "Beginner", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 2, name: "Cross", level: "Beginner", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 3, name: "Hook", level: "Intermediate", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 4, name: "Uppercut", level: "Intermediate", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    kicks: [
      { id: 5, name: "Teep (Push Kick)", level: "Beginner", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 6, name: "Roundhouse Kick", level: "Beginner", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 7, name: "Side Kick", level: "Intermediate", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 8, name: "Axe Kick", level: "Advanced", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    elbows: [
      { id: 9, name: "Horizontal Elbow", level: "Intermediate", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 10, name: "Uppercut Elbow", level: "Intermediate", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 11, name: "Downward Elbow", level: "Advanced", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    knees: [
      { id: 12, name: "Straight Knee", level: "Beginner", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 13, name: "Diagonal Knee", level: "Intermediate", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 14, name: "Flying Knee", level: "Advanced", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
    combos: [
      { id: 15, name: "Jab-Cross", level: "Beginner", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 16, name: "Jab-Cross-Hook", level: "Intermediate", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 17, name: "Kick-Punch Combo", level: "Intermediate", thumbnail: "/placeholder.svg?height=200&width=300" },
      { id: 18, name: "Elbow-Knee Combo", level: "Advanced", thumbnail: "/placeholder.svg?height=200&width=300" },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Technique Library</h1>
          <p className="text-gray-600 mt-1">
            Learn and practice proper Muay Thai techniques with professional demonstrations
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/upload">Upload Your Practice</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="punches" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="punches">Punches</TabsTrigger>
          <TabsTrigger value="kicks">Kicks</TabsTrigger>
          <TabsTrigger value="elbows">Elbows</TabsTrigger>
          <TabsTrigger value="knees">Knees</TabsTrigger>
          <TabsTrigger value="combos">Combinations</TabsTrigger>
        </TabsList>

        {Object.entries(techniques).map(([category, items]) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((technique) => (
                <Card key={technique.id}>
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={technique.thumbnail || "/placeholder.svg"}
                        alt={technique.name}
                        className="w-full h-[180px] object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                        {technique.level}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-t-lg">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <Play className="h-4 w-4 mr-2" />
                          Watch Demo
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{technique.name}</h3>
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          <Info className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/upload">Practice</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Training Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Proper Stance</h3>
            <p className="text-sm text-gray-600 mb-3">
              Keep your weight evenly distributed and stay on the balls of your feet for quick movement.
            </p>
            <Button variant="link" className="px-0 text-red-600">
              Learn More
            </Button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Hip Rotation</h3>
            <p className="text-sm text-gray-600 mb-3">
              Generate power by rotating your hips fully when throwing kicks and punches.
            </p>
            <Button variant="link" className="px-0 text-red-600">
              Learn More
            </Button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Breathing Technique</h3>
            <p className="text-sm text-gray-600 mb-3">
              Exhale sharply when striking to maximize power and maintain stamina.
            </p>
            <Button variant="link" className="px-0 text-red-600">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
