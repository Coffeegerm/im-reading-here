export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            I&apos;m Reading Here
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Book club management made simple
          </p>
          <div className="space-y-4">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
              <p className="text-muted-foreground">
                This is a barebones frontend for the I&apos;m Reading Here book club management platform.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Features Coming Soon:</h3>
              <ul className="text-left space-y-1 text-muted-foreground">
                <li>• User authentication and profiles</li>
                <li>• Book search and import</li>
                <li>• Create and join book clubs</li>
                <li>• Schedule meetings and events</li>
                <li>• Vote on book selections</li>
                <li>• Track reading progress</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
