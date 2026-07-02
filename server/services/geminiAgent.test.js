const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { classifyIssueWithGemini, ALLOWED_CATEGORIES } = require('./geminiAgent');

describe('Gemini Agent Issue Classification', () => {
  // Increase timeout for API calls
  jest.setTimeout(10000);

  test('should classify a pothole issue as Road Maintenance', async () => {
    const description = "There is a huge pothole on Main St that damaged my tire.";
    const result = await classifyIssueWithGemini(description);
    
    // Check if the result is in the allowed categories and specifically matches our expectation
    expect(ALLOWED_CATEGORIES).toContain(result);
    expect(result).toBe("Road Maintenance");
  });

  test('should classify a broken street light as Street Lighting', async () => {
    const description = "The street light on 5th Ave is flickering and sometimes turns off completely.";
    const result = await classifyIssueWithGemini(description);
    
    expect(result).toBe("Street Lighting");
  });

  test('should classify dumped trash as Waste Management', async () => {
    const description = "Someone dumped a bunch of garbage bags in the alleyway.";
    const result = await classifyIssueWithGemini(description);
    
    expect(result).toBe("Waste Management");
  });

  test('should return null for empty description', async () => {
    const result = await classifyIssueWithGemini("");
    expect(result).toBeNull();
  });
});
