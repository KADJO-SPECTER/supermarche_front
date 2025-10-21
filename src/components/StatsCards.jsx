const StatsCards = () => {
  const stats = [
    { title: "Recettes totales", value: "203k", change: "13.9%", positive: true },
    { title: "Panier moyen", value: "3.4k", change: "1.5%", positive: true },
    { title: "Affluence moyenne", value: "683", change: "0.9%", positive: true },
    { title: "Taux de fidélisation", value: "2.4%", change: "10.97%", positive: true }
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-semibold text-gray-900">{stat.value}</span>
            <span className={`ml-2 text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

export default StatsCards