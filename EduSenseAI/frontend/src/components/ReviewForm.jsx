import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Sparkles } from 'lucide-react'
import api from '../api/axios'

export default function ReviewForm({ onReviewSubmitted }) {
  const [text, setText] = useState('')
  const [department, setDepartment] = useState('Computer Science')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    try {
      const response = await api.post('/api/analyze', {
        text,
        department
      })
      onReviewSubmitted(response.data)
      setText('')
    } catch (error) {
      console.error('Error analyzing review:', error)
      alert("Failed to analyze review. Make sure backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="text-indigo-500" size={24} />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Analyze New Review</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Department Tag</label>
          <select 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
          >
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Business">Business</option>
            <option value="Arts">Arts</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Review Content</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste the student review here to analyze sentiment and emotion..."
            className="w-full h-32 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-medium placeholder-slate-400 dark:placeholder-slate-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg shadow-[0_4px_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              <span>AI is Analyzing...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Analyze & Generate Insight</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}
