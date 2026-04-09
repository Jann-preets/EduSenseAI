import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts'
import { MessageSquare, ThumbsUp, ThumbsDown, Brain, Zap, Clock } from 'lucide-react'
import clsx from 'clsx'

import StatCard from '../components/StatCard'
import ReviewForm from '../components/ReviewForm'
import api from '../api/axios'

const SENTIMENT_COLORS = {
  Positive: '#10b981', // emerald
  Neutral: '#64748b', // slate
  Negative: '#ef4444' // red
}

const EMOTION_COLORS = {
  Happy: '#f59e0b', // amber
  Sad: '#3b82f6', // blue
  Angry: '#ef4444', // red
  Frustrated: '#f97316', // orange
  Confused: '#a855f7' // purple
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [typingInsight, setTypingInsight] = useState("")

  const loadData = async () => {
    try {
      const [statsRes, reviewsRes] = await Promise.all([
        api.get('/api/stats'),
        api.get('/api/reviews?limit=5')
      ])
      setStats(statsRes.data)
      setReviews(reviewsRes.data)
      
      // Typing effect for the first insight
      if (statsRes.data.insights && statsRes.data.insights.length > 0) {
        animateTyping(statsRes.data.insights[0])
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const animateTyping = (text) => {
    setTypingInsight("")
    let i = 0
    const intervalId = setInterval(() => {
      setTypingInsight((prev) => prev + text.charAt(i))
      i++
      if (i >= text.length) clearInterval(intervalId)
    }, 30)
  }

  const handleReviewSubmitted = () => {
    // Reload data when a new review is added
    loadData()
  }

  const renderHighlightedText = (text, keywords) => {
    if (!keywords || keywords.length === 0) return text
    
    // Simple word replacement for highlighting (case insensitive)
    let parts = text.split(new RegExp(`(${keywords.join('|')})`, 'gi'))
    return parts.map((part, i) => 
      keywords.some(k => k.toLowerCase() === part.toLowerCase()) 
        ? <span key={i} className="bg-yellow-200 dark:bg-yellow-500/30 text-yellow-900 dark:text-yellow-200 font-bold px-1 rounded">{part}</span>
        : part
    )
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header section with typing insight */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-900/20"
      >
        <div className="flex items-center space-x-3 mb-2">
          <Zap className="text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">AI Instant Insight</h2>
        </div>
        <p className="text-lg text-slate-700 dark:text-slate-300 font-medium h-6">
          {typingInsight}
          <motion.span 
            animate={{ opacity: [0, 1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-5 bg-indigo-500 ml-1 align-middle"
          />
        </p>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Reviews" 
          value={stats?.total_reviews || 0} 
          icon={<MessageSquare size={32} className="text-blue-500" />} 
          style="bg-blue-100 dark:bg-blue-900/30"
          delay={0.1}
        />
        <StatCard 
          title="Positive Sentiments" 
          value={`${stats?.positive_percent || 0}%`} 
          icon={<ThumbsUp size={32} className="text-emerald-500" />} 
          style="bg-emerald-100 dark:bg-emerald-900/30"
          delay={0.2}
        />
        <StatCard 
          title="Negative Sentiments" 
          value={`${stats?.negative_percent || 0}%`} 
          icon={<ThumbsDown size={32} className="text-red-500" />} 
          style="bg-red-100 dark:bg-red-900/30"
          delay={0.3}
        />
        <StatCard 
          title="Primary Emotion" 
          value={stats?.most_common_emotion || "N/A"} 
          icon={<Brain size={32} className="text-amber-500" />} 
          style="bg-amber-100 dark:bg-amber-900/30"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form & History */}
        <div className="lg:col-span-1 space-y-8">
          <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
          
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 }}
             className="glass-card p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
              <Clock className="mr-2 text-indigo-500" size={20} />
              Recent Reviews
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.map((review, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  key={review.id} 
                  className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-slate-800 dark:text-slate-200 mb-3 italic">
                    "{review.keywords ? renderHighlightedText(review.text, JSON.parse(review.keywords.replace(/'/g, '"'))) : review.text}"
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className={clsx(
                      "px-2 py-1 rounded-full font-medium border",
                      review.sentiment === 'Positive' ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800" :
                      review.sentiment === 'Negative' ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800" :
                      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
                    )}>
                      {review.sentiment} ({review.sentiment_confidence}%)
                    </span>
                    <span className="px-2 py-1 rounded-full font-medium border bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                      {review.emotion} ({review.emotion_confidence}%)
                    </span>
                    <span className="px-2 py-1 rounded-full font-medium border bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                      {review.department}
                    </span>
                  </div>
                </motion.div>
              ))}
              {reviews.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No reviews yet.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sentiment Pie Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 h-[350px] flex flex-col"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Sentiment Distribution</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.sentiment_data || []}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {(stats?.sentiment_data || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name] || '#ccc'} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', background: 'rgba(255,255,255,0.9)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend manually */}
              <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm">
                {Object.entries(SENTIMENT_COLORS).map(([name, color]) => (
                   <div key={name} className="flex items-center">
                     <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                     <span className="text-slate-600 dark:text-slate-400">{name}</span>
                   </div>
                ))}
              </div>
            </motion.div>

            {/* Emotion Bar Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-6 h-[350px] flex flex-col"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Emotion Spectrum</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.emotion_data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                      {(stats?.emotion_data || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name] || '#ccc'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Trend Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6 h-[350px] flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Sentiment Trend (Recent Pulse)</h3>
              <div className="text-xs text-slate-500 dark:text-slate-400">Score: +1 (Pos), 0 (Neu), -1 (Neg)</div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.trend_data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[-1, 1]} ticks={[-1, 0, 1]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sentiment_score" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
