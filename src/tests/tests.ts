export const assert = (...args: any[]): void => {
    try {
        console.assert(...args);
    } catch (er) {
        assert.exitCode = 1;
        console.error(er);
    }
};

// Be sure the program knows there were testing errors
process.on('exit', function () {
    // To keep it clean, if no exitCode property is available, use 0
    process.exit(assert.exitCode || 0);
});

// In order to be able to test asynchronous tests too
export const asyncAssert = assert.async = (fn: (callback: () => void) => void, timeout?: number): void => {
    // Create a timer that will fail
    const timer = setTimeout(
        () => assert(false, 'timeout ' + fn),
        // Define a timeout or a default one
        timeout || assert.timeout
    );
    // Invoke the test function passing the callback that will clear the timer
    fn(() => clearTimeout(timer));
};

// Define a default timeout
assert.timeout = 10000;

// Add a type for exitCode
assert.exitCode = 0; // Initialize exitCode