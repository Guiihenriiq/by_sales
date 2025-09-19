import { Request, Response } from 'express';
import { DashboardController } from './dashboardController';

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface CreateOrderRequest {
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
}

// Simulação de banco de dados em memória
let orders: any[] = [];
let orderIdCounter = 1;

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const { totalAmount, shippingAddress, paymentMethod, items }: CreateOrderRequest = req.body;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Validações básicas
      if (!totalAmount || !shippingAddress || !paymentMethod || !items || items.length === 0) {
        return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' });
      }

      // Criar pedido
      const order = {
        id: `order-${orderIdCounter++}-${Date.now()}`,
        userId,
        totalAmount,
        shippingAddress,
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: items.map((item, index) => ({
          id: `item-${index}-${Date.now()}`,
          ...item,
          product: {
            id: item.productId,
            name: `Produto ${item.productId.slice(-4)}`,
            images: ['https://via.placeholder.com/300x300?text=Produto']
          }
        }))
      };

      orders.push(order);
      
      // Sincronizar dados com dashboard
      DashboardController.syncOrders(orders);
      
      return res.status(201).json(order);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const userOrders = orders.filter(order => order.userId === userId);
      
      return res.json(userOrders);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const order = orders.find(o => o.id === id && o.userId === userId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      return res.json(order);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const orderIndex = orders.findIndex(o => o.id === id && o.userId === userId);
      
      if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
      }

      orders[orderIndex].status = status;
      orders[orderIndex].updatedAt = new Date().toISOString();
      
      return res.json(orders[orderIndex]);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  // Admin methods
  async findAllOrders(req: Request, res: Response) {
    try {
      const userRole = req.user?.role;
      
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      
      return res.json(orders);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async adminUpdateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userRole = req.user?.role;
      
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const orderIndex = orders.findIndex(o => o.id === id);
      
      if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
      }

      orders[orderIndex].status = status;
      orders[orderIndex].updatedAt = new Date().toISOString();
      
      // Sincronizar dados com dashboard
      DashboardController.syncOrders(orders);
      
      return res.json(orders[orderIndex]);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}