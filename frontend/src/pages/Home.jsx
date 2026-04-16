import AthleteList from '../components/AthleteList'
import TodayDate from '../components/TodayDate'

function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-primary mb-2">Athletes</h1>
      <TodayDate />
      <AthleteList />
    </div>
  )
}

export default Home
