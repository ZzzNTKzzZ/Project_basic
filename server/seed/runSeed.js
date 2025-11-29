import { exec } from "child_process";

const scripts = [
  "seed/seedCategory.js",
  "seed/seedTag.js",
  "seed/seedUser.js",
  "seed/seedProduct.js",
  "seed/seedReview.js",
  "seed/seedOrder.js"
];

(async () => {
  for (let script of scripts) {
    console.log(`\n🔹 Running ${script} ...`);
    await new Promise((resolve, reject) => {
      const child = exec(`node ${script}`, (err, stdout, stderr) => {
        if (err) return reject(err);
        console.log(stdout);
        resolve();
      });
    });
  }
  console.log("\n✅ All seeds completed!");
  process.exit(0);
})();
