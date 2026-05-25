import { PrismaClient, Role, ServiceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1 Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@estrelinha.com' },
    update: {},
    create: {
      email: 'admin@estrelinha.com',
      clerkId: 'user_admin_123',
      role: Role.ADMIN,
      phone: '11999999999',
    },
  });
  console.log(`Admin created: ${admin.email}`);

  // 10 Users with Pets
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        clerkId: `user_clerk_${i}`,
        role: Role.CLIENT,
        phone: `1198888000${i}`,
        pets: {
          create: [
            {
              name: `Pet ${i}`,
              species: i % 2 === 0 ? 'Cão' : 'Gato',
              breed: i % 2 === 0 ? 'Golden Retriever' : 'Persa',
              weight: 5 + i,
              notes: 'Amigável e calmo.',
            },
          ],
        },
      },
    });
    console.log(`User created: ${user.email}`);
  }

  // 2 Shops
  const shop1Owner = await prisma.user.upsert({
    where: { email: 'shop1@estrelinha.com' },
    update: {},
    create: {
      email: 'shop1@estrelinha.com',
      clerkId: 'user_shop_1',
      role: Role.SHOP,
      phone: '11977770001',
    },
  });

  const shop2Owner = await prisma.user.upsert({
    where: { email: 'shop2@estrelinha.com' },
    update: {},
    create: {
      email: 'shop2@estrelinha.com',
      clerkId: 'user_shop_2',
      role: Role.SHOP,
      phone: '11977770002',
    },
  });

  const shop1 = await prisma.shop.upsert({
    where: { cnpj: '12345678000199' },
    update: {},
    create: {
      ownerId: shop1Owner.id,
      name: 'Estrelinha Matriz - Banho & Tosa',
      cnpj: '12345678000199',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      openHours: {
        mon: '08:00-18:00',
        tue: '08:00-18:00',
        wed: '08:00-18:00',
        thu: '08:00-18:00',
        fri: '08:00-18:00',
        sat: '08:00-13:00',
        sun: 'closed',
      },
    },
  });

  const shop2 = await prisma.shop.upsert({
    where: { cnpj: '12345678000200' },
    update: {},
    create: {
      ownerId: shop2Owner.id,
      name: 'Estrelinha Filial - Express',
      cnpj: '12345678000200',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      openHours: {
        mon: '09:00-20:00',
        tue: '09:00-20:00',
        wed: '09:00-20:00',
        thu: '09:00-20:00',
        fri: '09:00-20:00',
        sat: '09:00-18:00',
        sun: 'closed',
      },
    },
  });
  console.log(`Shops created: ${shop1.name}, ${shop2.name}`);

  // 5 Services
  const services = [
    {
      shopId: shop1.id,
      name: 'Banho P',
      durationMin: 45,
      price: 50.0,
      type: ServiceType.BATH,
    },
    {
      shopId: shop1.id,
      name: 'Tosa Higiênica',
      durationMin: 60,
      price: 80.0,
      type: ServiceType.GROOMING,
    },
    {
      shopId: shop2.id,
      name: 'Banho e Tosa Completa',
      durationMin: 120,
      price: 150.0,
      type: ServiceType.GROOMING,
    },
    {
      shopId: shop2.id,
      name: 'Pacote Mensal (4 Banhos)',
      durationMin: 45,
      price: 180.0,
      type: ServiceType.PACKAGE,
    },
    {
      shopId: shop1.id,
      name: 'Hidratação Especial',
      durationMin: 30,
      price: 40.0,
      type: ServiceType.BATH,
    },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
