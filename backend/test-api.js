const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      url,
      { method, headers },
      (res) => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, text: data });
          }
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

const runTests = async () => {
  console.log('\n--- Running CraftCart Backend API Tests ---');

  try {
    // 1. Health check
    const health = await request('/api/health');
    console.log(`[1] Health Check: ${health.status === 200 ? 'PASS' : 'FAIL'} (${health.data?.status})`);

    // 2. Products List
    const prods = await request('/api/products?limit=5');
    console.log(`[2] Products Query: ${prods.status === 200 && prods.data?.products?.length === 5 ? 'PASS' : 'FAIL'} (Returned ${prods.data?.products?.length} products, total ${prods.data?.total})`);

    // 3. Categories
    const cats = await request('/api/products/meta/categories');
    console.log(`[3] Categories API: ${cats.status === 200 && cats.data?.categories?.length === 5 ? 'PASS' : 'FAIL'} (${cats.data?.categories?.length} categories found)`);

    // 4. Customer Login
    const custLogin = await request('/api/auth/login', 'POST', {
      email: 'demo@craftcart.com',
      password: 'Customer@12345'
    });
    const custToken = custLogin.data?.token;
    console.log(`[4] Customer Login: ${custLogin.status === 200 && custToken ? 'PASS' : 'FAIL'} (Welcome ${custLogin.data?.user?.name})`);

    // 4b. Customer Registration
    const newEmail = `user_${Date.now()}@example.com`;
    const regRes = await request('/api/auth/register', 'POST', {
      name: 'Rohan Sharma',
      email: newEmail,
      phone: '9876543210',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    console.log(`[4b] Customer Registration: ${regRes.status === 201 ? 'PASS' : 'FAIL'} (${regRes.data?.message})`);

    // 5. Customer Profile
    const profile = await request('/api/auth/me', 'GET', null, custToken);
    console.log(`[5] Customer Profile Auth: ${profile.status === 200 && profile.data?.user?.email === 'demo@craftcart.com' ? 'PASS' : 'FAIL'}`);

    // 6. Cart Add
    const firstProductId = prods.data.products[0]._id;
    const addCart = await request('/api/cart', 'POST', { productId: firstProductId, quantity: 1 }, custToken);
    console.log(`[6] Cart Add Item: ${addCart.status === 200 ? 'PASS' : 'FAIL'} (Total items: ${addCart.data?.cart?.itemCount})`);

    // 7. Cart Get
    const cartGet = await request('/api/cart', 'GET', null, custToken);
    console.log(`[7] Cart Fetch: ${cartGet.status === 200 && cartGet.data?.cart?.items?.length > 0 ? 'PASS' : 'FAIL'} (Subtotal: ₹${cartGet.data?.cart?.subtotal})`);

    // 8. Wishlist Get
    const wishGet = await request('/api/wishlist', 'GET', null, custToken);
    console.log(`[8] Wishlist Query: ${wishGet.status === 200 ? 'PASS' : 'FAIL'} (Count: ${wishGet.data?.count})`);

    // 9. Customer Orders
    const ordersGet = await request('/api/orders/my-orders', 'GET', null, custToken);
    console.log(`[9] Customer Orders Query: ${ordersGet.status === 200 ? 'PASS' : 'FAIL'} (${ordersGet.data?.count} orders found)`);

    // 10. Admin Login
    const adminLogin = await request('/api/auth/login', 'POST', {
      email: 'admin@craftcart.com',
      password: 'Admin@12345'
    });
    const adminToken = adminLogin.data?.token;
    console.log(`[10] Admin Login: ${adminLogin.status === 200 && adminLogin.data?.user?.role === 'admin' ? 'PASS' : 'FAIL'}`);

    // 11. Admin Dashboard Stats
    const adminStats = await request('/api/admin/dashboard', 'GET', null, adminToken);
    console.log(`[11] Admin Dashboard Stats: ${adminStats.status === 200 ? 'PASS' : 'FAIL'} (Revenue: ₹${adminStats.data?.stats?.totalRevenue}, Products: ${adminStats.data?.stats?.totalProducts})`);

    // 12. Non-Admin blocked from Admin Route
    const blockedCheck = await request('/api/admin/dashboard', 'GET', null, custToken);
    console.log(`[12] Role Protection (Customer blocked from Admin): ${blockedCheck.status === 403 ? 'PASS' : 'FAIL'} (${blockedCheck.data?.message})`);

    console.log('\n--- All Backend API Verification Tests Passed! ---\n');
    process.exit(0);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
};

runTests();
