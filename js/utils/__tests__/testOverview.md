# Test Overview
- Testing framework that is used here is Jest.
- You can check more about it out at https://facebook.github.io/jest/.
- Jest automatically looks for the tests in the repo (I assume that it checks __test__ folders only, but haven't confirmed this).

## Running
Just go to the console, and run `npm test`.

### Setup
Normally, you'd need to update `package.json` to include this:

    {
        ...
        "scripts": {
            "test":"jest"
        }
        ...
    }

But, that's already set up for us.

## Writing
### Testing Outline
You use `describe` to group the tests.

    describe('name of test group', function () {
        //Tests
    });

These `describe` statements can be nested to add hierarchy to testing groups.

    describe('name of test group', function () {
        describe('name of sub testing group', function () {
            //Tests
        });
    });

Using this grouping will make the testing output a lot more readable.

### Testing Code
Inside the describe statements, the `it()` function is used to create an individual test.

    describe('Test Group', function () {
        it('Test Name', function () {
            //Tests
        });
    });


And inside the testing statements, the you use `expect(value)` to perform the actual test.

    describe('Test Group', function () {
        it('Test Name', function () {
            expect(1).toBe(1);
        });
    });

### Using `expect(value)`
The `expect(value)` statemenet can be followed by a number of different statements, you can check these all out at https://facebook.github.io/jest/docs/api.html#expect-value.
