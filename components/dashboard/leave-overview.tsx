'use client'

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface LeaveOverviewProps {
  stats: {
    vacation: number
    sick: number
    personal: number
    other: number
  }
}

export function LeaveOverview({ stats }: LeaveOverviewProps) {
  const data = [
    { name: 'Vacation', value: stats.vacation, fill: 'hsl(var(--chart-1))' },
    { name: 'Sick', value: stats.sick, fill: 'hsl(var(--chart-2))' },
    { name: 'Personal', value: stats.personal, fill: 'hsl(var(--chart-3))' },
    { name: 'Other', value: stats.other, fill: 'hsl(var(--chart-4))' },
  ].filter(item => item.value > 0)

  const chartConfig = {
    vacation: { label: 'Vacation', color: 'hsl(var(--chart-1))' },
    sick: { label: 'Sick', color: 'hsl(var(--chart-2))' },
    personal: { label: 'Personal', color: 'hsl(var(--chart-3))' },
    other: { label: 'Other', color: 'hsl(var(--chart-4))' },
  }

  const total = stats.vacation + stats.sick + stats.personal + stats.other

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Requests Overview</CardTitle>
        <CardDescription>Distribution by leave type</CardDescription>
      </CardHeader>
      <CardContent>
        {total > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No leave requests yet
          </div>
        )}
      </CardContent>
    </Card>
  )
}
