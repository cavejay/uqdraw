jest.dontMock('../API.js');

describe('API', () => {
  let API;
  let APIConstants = require('../API.js').APIConstants;

  beforeEach(() => {
    API = require('../API.js').default;
  });

  // Describe subscription related behaviour
  describe('subscription', () => {
    describe('subscribe', () => {

      it('sets up subscriptions correctly for each APIConstant', () => {
        Object.keys(APIConstants).forEach((key) => {
          let componentKey = '1asdf6';
          let filter = 'someFilterNameAsItsRequired';
          API.subscribe(key, componentKey, filter);

          let refs = API.getRefs();

          expect(refs[key]).toBeDefined();
          expect(refs[key][filter]).toBeDefined();
          expect(refs[key][filter].ref).toBeTruthy();
          expect(refs[key][filter].listening).toEqual({[componentKey]: componentKey});
        });
      });

      it('allows multiple components to listen to the same ref', () => {
        let componentKeys = ['asd123', '1234asd', '1234'];
        let filter = 'someFilter';
        componentKeys.forEach((componentKey) => {
          API.subscribe(APIConstants.subjects, componentKey, filter);
        });

        let listening = API.getRefs()[APIConstants.subjects][filter].listening;
        expect(listening).toEqual({
          'asd123': 'asd123',
          '1234asd': '1234asd',
          '1234': '1234',
        });
      });

    });

    describe('unsubscribe', () => {
      it('does not remove the Firebase ref if there are components still subscribed', () => {
        let componentKeys = ['asd123', '1234asd', '1234'];
        let filter = 'someFilter';
        for (let i = 0; i < componentKeys.length; i++) {
          API.subscribe(APIConstants.subjects, componentKeys[i], filter);
        }

        // Remove all but 1 listening component
        for (let i = 0; i < componentKeys.length - 1; i++) {
          API.unsubscribe(APIConstants.subjects, componentKeys[i], filter);
        }

        let ref = API.getRefs()[APIConstants.subjects][filter].ref;
        expect(ref.off).not.toBeCalled();
        expect(ref).toBeTruthy();
      });

      it('removes the Firebase ref once all listening components are unsubscribed', () => {
        let componentKeys = ['asd123', '1234asd', '1234'];
        let filter = 'someFilter';

        // subscribe multiple components, then unsubscribe them all
        componentKeys.forEach((key) => {
          API.subscribe(APIConstants.subjects, key, filter);
        });
        expect(API.getRefs()[APIConstants.subjects][filter].ref).toBeTruthy();
        componentKeys.forEach((key) => {
          API.unsubscribe(APIConstants.subjects, key, filter);
        });

        let filterTracker = API.getRefs()[APIConstants.subjects][filter];
        expect(filterTracker.listening).toEqual({});
        expect(filterTracker.ref).toBeNull();
      });

      it('removes subscriptions correctly for every APIConstant', () => {
        Object.keys(APIConstants).forEach((key) => {
          // Setup a subscription
          let componentKey = '1asdf6';
          let filter = 'someFilterNameAsItsRequired';
          API.subscribe(key, componentKey, filter);

          // Get ref before unsubscribe call, as it will null it out.
          let refs = API.getRefs();
          let ref = refs[key][filter].ref;
          API.unsubscribe(key, componentKey, filter);

          expect(ref.off).toBeCalled();
          expect(refs[key][filter].listening).toEqual({});
          expect(refs[key][filter].ref).toBeNull();
        });
      });
    });
  });

  // Describe persistence related behaviour (add, remove, update, etc)
  describe('persistence', () => {
    // What happens if the ref no exist (eg forgot to subscribe first)?

    // Test that return type is what we expected
  });
});