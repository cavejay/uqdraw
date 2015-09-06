jest.dontMock('../testable.js');

describe('Dummy Tests', function () {
    it('should always pass, 1 should be 1', function() {
            expect(1).toBe(1);
    });

    it('should always pass, one() should return 1', function() {
            let dummy = require('../testable.js').default;

            expect(dummy.one).toBe(1);
            expect(dummy.two()).toBe(1);
    });
});
