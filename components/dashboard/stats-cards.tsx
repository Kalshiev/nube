import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, CalendarClock, Building2 } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalEmployees: number
    activeEmployees: number
    pendingLeave: number
    departmentCount: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      description: 'Registered in the system',
      icon: Users,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees,
      description: 'Currently working',
      icon: UserCheck,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      title: 'Pending Leave',
      value: stats.pendingLeave,
      description: 'Awaiting approval',
      icon: CalendarClock,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
    {
      title: 'Departments',
      value: stats.departmentCount,
      description: 'Active departments',
      icon: Building2,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
