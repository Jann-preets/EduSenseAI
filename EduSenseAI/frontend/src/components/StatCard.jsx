import { motion } from 'framer-motion'

export default function StatCard({ title, value, icon, delay = 0, style="bg-white" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, translateY: -5 }}
      className="glass-card p-6 relative overflow-hidden group"
    >
      <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 scale-150">
        {icon}
      </div>
      <div className="flex items-center justify-between z-10 relative">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${style}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
