// Mocha configuration
  beforeEach(function() {
    // Set the default timeouts for all tests
    this.currentTest.timeout(5000);
    this.currentTest.slow(100);
  });
