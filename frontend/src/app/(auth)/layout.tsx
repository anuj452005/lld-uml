export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-full w-full flex items-center justify-center bg-bg-canvas overflow-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: 'url("/auth-bg.png")' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-bg-canvas/50 via-bg-canvas/80 to-bg-canvas" />
      
      {/* Animated subtle grid overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
