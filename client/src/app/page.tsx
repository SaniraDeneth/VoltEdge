export default function Home() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-radial from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 p-6">
         <main className="flex flex-col gap-8 items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-6xl font-black tracking-tighter bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
               VoltEdge
            </h1>
         </main>
      </div>
   );
}
