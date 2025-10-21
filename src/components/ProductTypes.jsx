const ProductTypes = () => {
  const categories = [
    { name: "Électronique", percentage: 43.3, color: "bg-blue-500" },
    { name: "Épicerie", percentage: 28.1, color: "bg-green-500" },
    { name: "Meubles", percentage: 13.6, color: "bg-yellow-500" },
    { name: "Mode et style de vie", percentage: 13.6, color: "bg-purple-500" },
    { name: "Cadence et jouets", percentage: 13.6, color: "bg-red-500" }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Type de produits</h2>
      <p className="text-gray-500 mb-6">Au cours des 30 derniers jours</p>
      
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 flex justify-center items-center">
          {/* Graphique circulaire simplifié */}
          <div className="relative w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-lg font-semibold">Total</span>
          </div>
        </div>
        
        <div className="md:w-2/3 mt-6 md:mt-0">
          {categories.map((category, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm font-medium">{category.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${category.color}`}
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductTypes