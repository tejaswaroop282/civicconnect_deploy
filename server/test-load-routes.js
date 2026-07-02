console.log("Loading auth routes...");
try {
  require('./routes/auth');
  console.log("✅ Auth routes loaded successfully.");
} catch (e) {
  console.error("❌ Auth routes failed:", e);
}

console.log("Loading issues routes...");
try {
  require('./routes/issues');
  console.log("✅ Issues routes loaded successfully.");
} catch (e) {
  console.error("❌ Issues routes failed:", e);
}

console.log("Loading admin routes...");
try {
  require('./routes/admin');
  console.log("✅ Admin routes loaded successfully.");
} catch (e) {
  console.error("❌ Admin routes failed:", e);
}
