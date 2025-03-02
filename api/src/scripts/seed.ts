import prisma from "../prisma";
import { seedPermissions } from "../services/permission.service";
import bcrypt from "bcryptjs";
import { Order_status, Payment_status, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { Stock_status, Status } from "@prisma/client"; // Ensure these enums are imported

// Configuration
const SEED_COUNTS = {
  sizes: 5,
  colors: 10,
  categories: 10,
  products: 20,
  paymentMethods: 3,
  deliveryAreas: 5,
  imagesPerProduct: 2,
  customers: 12,
};

const seedInitialData = async () => {
  // Clean existing data
  await prisma.$transaction([
    prisma.order_item.deleteMany(),
    prisma.order.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.color.deleteMany(),
    prisma.sizes.deleteMany(),
    prisma.payment_method.deleteMany(),
    prisma.delevery_area.deleteMany(),
    prisma.login_history.deleteMany(),
    prisma.admin.deleteMany(),
    prisma.role.deleteMany(),
    prisma.permission.deleteMany(),
  ]);

  await seedPermissions();

  // Create super admin role
  const superAdminRole = await prisma.role.create({
    data: {
      name: "Super Admin",
      permissions: {
        connect: await prisma.permission.findMany(),
      },
    },
  });
  console.log(`Created super admin role`);

  // create default read role
  await prisma.role.create({
    data: {
      name: "Default Admin",
      permissions: {
        connect: await prisma.permission.findMany({
          where: { name: { endsWith: "read" } },
        }),
      },
    },
  });
  console.log(`Created roles sizes`);

  // Create initial admin user
  const admin = await prisma.admin.create({
    data: {
      name: "habib",
      email: "admin@example.com",
      password: await bcrypt.hash("securepassword", 12),
      role_id: superAdminRole.id,
      verified: true,
      status: "ACTIVE",
    },
  });
  console.log(`Created super admin user`);

  // 1. Seed Sizes
  const sizes = await prisma.sizes.createMany({
    data: Array.from({ length: SEED_COUNTS.sizes }).map((_, i) => {
      const sizeName = `${faker.helpers.arrayElement([
        "S",
        "M",
        "L",
        "XL",
      ])}${i}`;
      return {
        name: sizeName,
        slug: faker.helpers.slugify(`size-${sizeName}-${i}`), // Make slug unique by adding index
        order: i,
        status: Status.PUBLISED,
        admin_id: admin.id,
      };
    }),
  });
  console.log(`Created ${SEED_COUNTS.sizes} sizes`);

  // 2. Seed Colors
  const colors = await prisma.color.createMany({
    data: Array.from({ length: SEED_COUNTS.colors }).map((_, i) => {
      const colorName = faker.color.human();
      return {
        name: `${colorName} ${i}`,
        hex_code: faker.color.rgb(),
        status: Status.PUBLISED,
        slug: faker.helpers.slugify(`color-${colorName}-${i}`), // Make slug unique by adding index
        admin_id: admin.id,
      };
    }),
  });
  console.log(`Created ${SEED_COUNTS.colors} colors`);

  // 3. Seed Categories (with image URLs)
  const categories = await prisma.category.createMany({
    data: Array.from({ length: SEED_COUNTS.categories }).map((_, i) => {
      const name = faker.commerce.department();
      return {
        name: `${name} ${i}`,
        slug: faker.helpers.slugify(`${name}-${i}`),
        description: faker.commerce.productDescription(),
        status: Status.PUBLISED,
        image_data: {
          url: faker.image.urlLoremFlickr({ category: "commerce" }),
          name: faker.commerce.productName(),
        },
        parent_id: null, // Add parent categories later if needed
        admin_id: admin.id,
      };
    }),
  });
  console.log(`Created ${SEED_COUNTS.categories} categories`);

  // 4. Seed Products with Relations
  const categoryIds = (await prisma.category.findMany()).map((c) => c.id);
  const colorIds = (await prisma.color.findMany()).map((c) => c.id);
  const sizeIds = (await prisma.sizes.findMany()).map((s) => s.id);

  for (let i = 0; i < SEED_COUNTS.products; i++) {
    const basePrice = faker.number.float({
      min: 10,
      max: 1000,
      fractionDigits: 1,
    });
    const salePrice = faker.datatype.boolean()
      ? basePrice * faker.number.float({ min: 0.5, max: 0.9 })
      : null;

    const name = faker.commerce.productName();

    await prisma.product.create({
      data: {
        name: `${name} ${i}`,
        slug: faker.helpers.slugify(`${name}-${i}`),
        sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
        description: faker.commerce.productDescription(),
        base_price: basePrice,
        sale_price: salePrice || 3,
        stock_quantity: faker.number.int({ min: 0, max: 1000 }),
        stock_status: faker.helpers.arrayElement(Object.values(Stock_status)),
        is_featured: faker.datatype.boolean(),
        is_special: faker.datatype.boolean(),
        purchase_limit: faker.number.int({ min: 1, max: 5 }),
        status: Status.PUBLISED,

        // Relations
        categories: {
          connect: faker.helpers
            .arrayElements(categoryIds, { min: 1, max: 3 })
            .map((id) => ({ id })),
        },
        colors: {
          connect: faker.helpers
            .arrayElements(colorIds, { min: 1, max: 2 })
            .map((id) => ({ id })),
        },
        sizes: {
          connect: faker.helpers
            .arrayElements(sizeIds, { min: 1, max: 2 })
            .map((id) => ({ id })),
        },
        admin_id: admin.id,

        // Optional fields
        meta_title: faker.lorem.words(12),
        meta_description: faker.lorem.sentence(),
        scheduled_for: faker.datatype.boolean()
          ? faker.date.future()
          : undefined,
      },
    });
  }
  console.log(`Created ${SEED_COUNTS.products} products with relations`);

  // await prisma.payment_method.createMany({
  //   data: [
  //     {
  //       name: "Credit Card",
  //       slug: "credit-card",
  //       number: "1400007504",
  //     },
  //     {
  //       name: "Mobile Banking",
  //       slug: "mobile-banking",
  //       number: "1400007504",
  //     },
  //     {
  //       name: "Cash on Delivery",
  //       slug: "cash-on-delivery",
  //       number: "1400007504",
  //     },
  //   ],
  // });
  // console.log(`Created ${SEED_COUNTS.paymentMethods} payment methods`);

  // 6. Seed Delivery Areas
  await prisma.delevery_area.createMany({
    data: Array.from({ length: SEED_COUNTS.deliveryAreas }).map(() => ({
      name: `${faker.location.city()} Area`,
      slug: faker.helpers.slugify(faker.location.city()),
      charge: faker.number.int({ min: 0, max: 500 }),
    })),
  });
  console.log(`Created ${SEED_COUNTS.deliveryAreas} delivery areas`);

  // 7. Seed Product Images
  const products = await prisma.product.findMany();

  for (const product of products) {
    const images = Array.from({ length: SEED_COUNTS.imagesPerProduct }).map(
      (_, index) => ({
        product_id: product.id,
        image_data: {
          url: faker.image.urlLoremFlickr({ category: "commerce" }),
          name: faker.commerce.product(),
        },
        alt_text: faker.lorem.words(3),
        order: index,
        is_main: index === 0, // First image is main
      })
    );

    await prisma.productImage.createMany({
      data: images,
    });
  }
  console.log(
    `Created ${products.length * SEED_COUNTS.imagesPerProduct} product images`
  );
  // 8. Seed Customers
  const customers = await prisma.customer.createMany({
    data: Array.from({ length: SEED_COUNTS.customers }).map(() => ({
      name: faker.person.fullName(),
      ip: faker.internet.ip(),
      address: faker.location.streetAddress(),
      number: faker.phone.number().slice(0, 15), // Ensure min 5 digits
    })),
  });
  console.log(`Created ${SEED_COUNTS.customers} customers`);

  // // 9. Seed Orders with Order Items
  // const allProducts = await prisma.product.findMany();
  // const allCustomers = await prisma.customer.findMany();
  // const paymentStatuses = Object.values(Payment_status);
  // const orderStatuses = Object.values(Order_status);

  // for (let i = 0; i < SEED_COUNTS.orders; i++) {
  //   const customer = faker.helpers.arrayElement(allCustomers);
  //   const productCount = faker.number.int({
  //     min: 1,
  //     max: SEED_COUNTS.maxItemsPerOrder,
  //   });
  //   const selectedProducts = faker.helpers.arrayElements(
  //     allProducts,
  //     productCount
  //   );

  //   // Calculate order total
  //   let total = 0;
  //   const items = selectedProducts.map((product) => {
  //     const quantity = faker.number.int({ min: 1, max: 5 });
  //     const price = Number(product.sale_price || product.base_price);
  //     total += price * quantity;

  //     return {
  //       product_id: product.id,
  //       quantity,
  //       price: new Prisma.Decimal(price.toFixed(2)),
  //     };
  //   });

  //   // Create order with nested items
  //   await prisma.order.create({
  //     data: {
  //       customer_id: customer.id,
  //       total_amount: new Prisma.Decimal(total.toFixed(2)),
  //       status: faker.helpers.arrayElement(orderStatuses),
  //       payment_status: faker.helpers.arrayElement(paymentStatuses),
  //       shipping_address: customer.address,
  //       number: faker.string.numeric(10), // 10-digit order number
  //       items: {
  //         create: items,
  //       },
  //       coupon_code: faker.datatype.boolean({ probability: 0.3 })
  //         ? faker.string.alphanumeric(6).toUpperCase()
  //         : null,
  //     },
  //   });
  // }
  // console.log(`Created ${SEED_COUNTS.orders} orders with items`);
};

seedInitialData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
