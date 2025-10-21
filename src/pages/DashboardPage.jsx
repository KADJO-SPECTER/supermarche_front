import StatsCards from '../components/StatsCards'
import RevenueChart from '../components/RevenueChart'
import SalesAnalysis from '../components/SalesAnalysis'
import ProductTypes from '../components/ProductTypes'

const DashboardPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCards />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <SalesAnalysis />
      </div>
      
      <div className="mt-6">
        <ProductTypes />
      </div>
    </>
  )
}

export default DashboardPage