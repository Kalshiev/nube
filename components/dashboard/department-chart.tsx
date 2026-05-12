'use client'

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
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

interface DepartmentChartProps {
  data: { name: string; count: number }[]
}

export function DepartmentChart({ data }: DepartmentChartProps) {
  const chartConfig = {
    count: {
      label: 'Employees',
      color: 'hsl(var(--chart-1))',
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees by Department</CardTitle>
        <CardDescription>Distribution across departments</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  fill="var(--color-count)" 
                  radius={[0, 4, 4, 0]}
                  name="Employees"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No employee data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
