require('dotenv').config();
const { classifyIssueWithGemini } = require('./services/geminiAgent');

async function runTests() {
  console.log("Starting Gemini API Tests...\n");
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is not set in your .env file!");
    return;
  }
  console.log("✅ GEMINI_API_KEY is present.\n");

  const testCases = [
    { description: "There is a huge pothole on Main St that damaged my tire.", expected: "Road Maintenance" },
    { description: "The street light on 5th Ave is flickering and sometimes turns off completely.", expected: "Street Lighting" },
    { description: "Someone dumped a bunch of garbage bags in the alleyway.", expected: "Waste Management" }
  ];

  let passed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    console.log(`Test ${i + 1}: "${test.description}"`);
    console.log(`Expected Category: ${test.expected}`);
    
    try {
      const result = await classifyIssueWithGemini(test.description);
      console.log(`Received Category: ${result}`);
      
      if (result === test.expected) {
        console.log("✅ PASS\n");
        passed++;
      } else {
        console.log("❌ FAIL\n");
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}\n`);
    }
  }

  console.log(`======================`);
  console.log(`Test Summary: ${passed}/${testCases.length} Passed`);
  console.log(`======================`);
  process.exit(0);
}

runTests();
