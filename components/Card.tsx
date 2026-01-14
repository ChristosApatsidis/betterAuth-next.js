// components/Card.tsx

export default function Card({ title, children }: { 
  title: string; 
  children: React.ReactNode 
}) {
  return (
    <div className="bg-base-200 border border-base-300 rounded">
      <div className="bg-base-300 p-2 font-bold">
        {title}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}