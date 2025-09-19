import { Request, Response } from 'express';

// Simulação de dados - substituir por consultas reais ao banco
let orders: any[] = [];
let products: any[] = [];
let users: any[] = [];

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const userRole = req.user?.role;
      
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // Estatísticas básicas
      const totalProducts = products.length;
      const totalUsers = users.filter(u => u.role === 'customer').length;
      const todayOrders = orders.filter(o => new Date(o.createdAt) >= todayStart).length;
      const todayRevenue = orders
        .filter(o => new Date(o.createdAt) >= todayStart && o.status !== 'cancelled')
        .reduce((sum, o) => sum + (typeof o.totalAmount === 'string' ? parseFloat(o.totalAmount) : o.totalAmount), 0);

      // Pedidos por status
      const ordersByStatus = {
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
      };

      // Vendas dos últimos 7 dias
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        
        const dayRevenue = orders
          .filter(o => {
            const orderDate = new Date(o.createdAt);
            return orderDate >= dayStart && orderDate < dayEnd && o.status !== 'cancelled';
          })
          .reduce((sum, o) => sum + (typeof o.totalAmount === 'string' ? parseFloat(o.totalAmount) : o.totalAmount), 0);
        
        last7Days.push({
          date: date.toISOString().split('T')[0],
          revenue: dayRevenue
        });
      }

      return res.json({
        totalProducts,
        totalUsers,
        todayOrders,
        todayRevenue,
        ordersByStatus,
        last7Days,
        recentOrders: orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10)
      });
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async getSalesData(req: Request, res: Response) {
    try {
      const userRole = req.user?.role;
      
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      // Vendas com informações detalhadas
      const salesData = orders.map(order => ({
        id: order.id,
        customer: `Cliente ${order.userId.slice(-4)}`,
        total: typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount,
        status: order.status,
        date: order.createdAt,
        items: order.items?.length || 0
      }));

      return res.json(salesData);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  // Método para sincronizar dados (chamado pelos outros controllers)
  static syncOrders(ordersData: any[]) {
    orders = ordersData;
  }

  static syncProducts(productsData: any[]) {
    products = productsData;
  }

  static syncUsers(usersData: any[]) {
    users = usersData;
  }
}