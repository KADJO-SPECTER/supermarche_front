const RevenueChart = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const values = [30, 40, 35, 50, 49, 60, 70] // Valeurs approximatives basées sur l'image
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Revenus totaux - Cette semaine</h2>
        <span className="text-xl font-bold">48.9k XOF</span>
      </div>
      <p className="text-gray-500 mb-6">Aujourd'hui</p>
      
      <div className="relative h-64">
        <div className="flex items-end justify-between h-full">
          {days.map((day, index) => (
            <div key={day} className="flex flex-col items-center w-10">
              <div 
                className="bg-blue-500 rounded-t w-8"
                style={{ height: `${values[index]}%` }}
              ></div>
              <span className="mt-2 text-xs text-gray-500">{day}</span>
            </div>
          ))}
        </div>
        
        {/* Échelle verticale */}
        <div className="absolute left-0 top-0 flex flex-col justify-between h-full text-xs text-gray-400">
          <span>100k</span>
          <span>50k</span>
          <span>0</span>
        </div>
      </div>
    </div>
  )
}

export default RevenueChart