"use client"

import { useEffect, useState } from "react"
import { format, getDay, getDaysInMonth } from "date-fns"
import { cn } from "@/lib/utils"

type DayPoints = {
  day: number
  month: number
  pointsGain: number
  pointsDeduct: number
}

type Props = {
  pointsData: DayPoints[]
  year: number
  ifGain: boolean
}

const getColor = (points: number, ifGain: boolean) => {
  if (ifGain) {
    if (points === 0) return "bg-zinc-800"
    if (points < 5) return "bg-green-900"
    if (points < 10) return "bg-green-700"
    if (points < 20) return "bg-green-500"
    return "bg-green-300"
  } else {
    if (points === 0) return "bg-zinc-800"
    if (points < 5) return "bg-red-900"
    if (points < 10) return "bg-red-700"
    if (points < 20) return "bg-red-500"
    return "bg-red-300"
  }
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const PointsGrid = ({ pointsData, year, ifGain }: Props) => {
  const [daysInMonth, setDaysInMonth] = useState<number[]>([])

  useEffect(() => {
    // Initialize days in month array
    const daysInMonthArr: number[] = []
    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
      // Get the number of days in the month
      const days = getDaysInMonth(new Date(year, monthIdx, 1))
      daysInMonthArr.push(days)
    }

    setDaysInMonth(daysInMonthArr)
  }, [year])

  return (
    <div className="overflow-x-auto p-4">
      <div className="grid grid-cols-12 gap-2">
        {/* Month labels */}
        {monthNames.map((month, i) => (
          <div
            key={i}
            className="flex justify-center items-center text-sm font-semibold text-gray-500"
          >
            {month}
          </div>
        ))}

        {/* Grids for each month */}
        {monthNames.map((month, monthIdx) => {
          const daysInCurrentMonth = daysInMonth[monthIdx]
          const firstDayOfMonth = new Date(year, monthIdx, 1)
          const firstDayWeekday = getDay(firstDayOfMonth) // Get the weekday of the first day of the month

          // Calculate how many empty slots before the first day of the month
          const leadingEmptyDays = firstDayWeekday

          // Calculate the total number of days to display in the grid
          const totalDaysToShow = leadingEmptyDays + daysInCurrentMonth
          const rows = Math.ceil(totalDaysToShow / 7) // 7 columns for each week

          return (
            <div key={monthIdx} className="flex flex-col gap-2">
              {/* Generate days grid for each month */}
              {Array.from({ length: rows }).map((_, rowIdx) => {
                return (
                  <div key={rowIdx} className="flex gap-[2px]">
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                      const dayOfMonth = rowIdx * 7 + dayIdx - leadingEmptyDays
                      if (dayOfMonth < 1 || dayOfMonth > daysInCurrentMonth) {
                        return <div key={dayIdx} className="w-3 h-3"></div> // Empty slot for days outside the month
                      }

                      const date = new Date(year, monthIdx, dayOfMonth)
                      const data = pointsData.find(
                        (d) => d.day === date.getDate() && d.month === date.getMonth()
                      )
                      let points = 0
                      if (ifGain) points = data ? data.pointsGain : 0
                      else points = data ? data.pointsDeduct : 0

                      const formattedDate = format(date, "dd MMMM yyyy") // Full date format

                      return (
                        <div
                          key={dayIdx}
                          title={`${formattedDate} - ${points} pts`} // Display full date and points on hover
                          className={cn(
                            "w-3 h-3 rounded-sm",
                            getColor(points, ifGain),
                            "transition-all"
                          )}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PointsGrid
