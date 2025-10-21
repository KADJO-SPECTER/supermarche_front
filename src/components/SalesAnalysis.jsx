const SalesAnalysis = () => {
  const stores = [
    { name: "ESATIC", sales: "896.3 XOF", performance: "23%" },
    { name: "CHU", sales: "683.3 XOF", performance: "3.8%" },
    { name: "POSTE", sales: "569.3 XOF", performance: "8.2%" }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Analyse des ventes en magasin</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Point de vente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant des ventes
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stores.map((store, index) => (
              <tr key={index}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {store.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {store.sales}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {store.performance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SalesAnalysis