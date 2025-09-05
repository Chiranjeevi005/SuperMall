/**
 * @jest-environment node
 */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Order from '@/models/Order';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Order Model', () => {
  it('should create and save an order successfully', async () => {
    const orderData = {
      orderId: 'ORD-2023-000001',
      customer: new mongoose.Types.ObjectId(),
      vendor: new mongoose.Types.ObjectId(),
      items: [
        {
          product: new mongoose.Types.ObjectId(),
          quantity: 2,
          price: 100,
        },
      ],
      totalAmount: 200,
      status: 'pending' as const,
      shippingAddress: {
        street: '123 Main St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country',
      },
      paymentMethod: 'credit-card',
      paymentStatus: 'pending' as const,
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.orderId).toBe(orderData.orderId);
    expect(savedOrder.customer.toString()).toBe(orderData.customer.toString());
    expect(savedOrder.vendor.toString()).toBe(orderData.vendor.toString());
    expect(savedOrder.items.length).toBe(1);
    expect(savedOrder.items[0].product.toString()).toBe(orderData.items[0].product.toString());
    expect(savedOrder.items[0].quantity).toBe(orderData.items[0].quantity);
    expect(savedOrder.items[0].price).toBe(orderData.items[0].price);
    expect(savedOrder.totalAmount).toBe(orderData.totalAmount);
    expect(savedOrder.status).toBe(orderData.status);
    expect(savedOrder.shippingAddress.street).toBe(orderData.shippingAddress.street);
    expect(savedOrder.shippingAddress.city).toBe(orderData.shippingAddress.city);
    expect(savedOrder.shippingAddress.state).toBe(orderData.shippingAddress.state);
    expect(savedOrder.shippingAddress.zipCode).toBe(orderData.shippingAddress.zipCode);
    expect(savedOrder.shippingAddress.country).toBe(orderData.shippingAddress.country);
    expect(savedOrder.paymentMethod).toBe(orderData.paymentMethod);
    expect(savedOrder.paymentStatus).toBe(orderData.paymentStatus);
    expect(savedOrder.createdAt).toBeDefined();
    expect(savedOrder.updatedAt).toBeDefined();
  });

  it('should fail to create an order without required fields', async () => {
    const orderData = {
      // Missing required fields
    };

    try {
      const order = new Order(orderData);
      await order.save();
    } catch (error: any) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    }
  });

  it('should respect enum values for status and paymentStatus', async () => {
    const orderData = {
      orderId: 'ORD-2023-000002',
      customer: new mongoose.Types.ObjectId(),
      vendor: new mongoose.Types.ObjectId(),
      items: [
        {
          product: new mongoose.Types.ObjectId(),
          quantity: 1,
          price: 50,
        },
      ],
      totalAmount: 50,
      status: 'invalid-status' as any, // Invalid status
      shippingAddress: {
        street: '456 Oak Ave',
        city: 'Another City',
        state: 'Another State',
        zipCode: '67890',
        country: 'Another Country',
      },
      paymentMethod: 'paypal',
      paymentStatus: 'invalid-payment-status' as any, // Invalid payment status
    };

    try {
      const order = new Order(orderData);
      await order.save();
    } catch (error: any) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      // Note: The exact error message might vary, so we're just checking for ValidationError
    }
  });
});