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
    maternity: number
    paternity: number
    unpaid: number
  }
}

export function LeaveOverview({ stats }: LeaveOverviewProps) {
  const data = [
    { name: 'Vacation', value: stats.vacation, fill: 'hsl(var(--chart-1))' },
    { name: 'Sick', value: stats.sick, fill: 'hsl(var(--chart-2))' },
    { name: 'Personal', value: stats.personal, fill: 'hsl(var(--chart-3))' },
    { name: 'Maternity', value: stats.maternity, fill: 'hsl(var(--chart-4))' },
    { name: 'Paternity', value: stats.paternity, fill: 'hsl(var(--chart-5))' },
    { name: 'Unpaid', value: stats.unpaid, fill: 'hsl(var(--accent))' },
  ].filter(item => item.value > 0)

  const chartConfig = {
    vacation: { label: 'Vacation', color: 'hsl(var(--chart-1))' },
    sick: { label: 'Sick', color: 'hsl(var(--chart-2))' },
    personal: { label: 'Personal', color: 'hsl(var(--chart-3))' },
    maternity: { label: 'Maternity', color: 'hsl(var(--chart-4))' },
    paternity: { label: 'Paternity', color: 'hsl(var(--chart-5))' },
    unpaid: { label: 'Unpaid', color: 'hsl(var(--accent))' },
  }

  const total = stats.vacation + stats.sick + stats.personal + stats.maternity + stats.paternity + stats.unpaid

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
