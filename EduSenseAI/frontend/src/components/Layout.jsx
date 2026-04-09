import { Moon, Sun, BrainCircuit, Activity, FileText, Settings, Menu } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Layout({ children, darkMode, toggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navItems = [
    { name: 'Dashboard', icon: <Activity size={20} />, active: true },
    { name: 'Reviews', icon: <FileText size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 border-r border-slate-200 dark:border-slate-800 glass z-20 flex flex-col"
          >
            <div className="p-6 flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <BrainCircuit className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold text-gradient whitespace-nowrap overflow-hidden">EduSense AI</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4 overflow-hidden">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    item.active
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.icon}
                  <span className="whitespace-nowrap">{item.name}</span>
                </div>
              ))}
            </nav>
            
            <div className="p-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                 <div className="text-sm">
                   <p className="font-semibold text-slate-800 dark:text-slate-200">Admin</p>
                   <p className="text-xs text-slate-500 dark:text-slate-400">EduSense Pro</p>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
        {/* Header */}
        <header className="h-20 px-8 glass border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="text-slate-600 dark:text-slate-400" size={24} />
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <motion.div
                initial={false}
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? (
                  <Sun className="text-amber-400" size={22} />
                ) : (
                  <Moon className="text-slate-600" size={22} />
                )}
              </motion.div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
