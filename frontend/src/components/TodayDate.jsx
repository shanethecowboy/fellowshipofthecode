function TodayDate() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return <p className="text-muted-foreground text-sm mb-4">{today}</p>
}

export default TodayDate
